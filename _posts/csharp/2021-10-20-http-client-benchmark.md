---
title: HttpClient 효율적으로 사용하기
permalink: csharp/http-client-efficiency
categories:
  - csharp
tags:
  - c#
  - csharp
  - http
  - stream
  - benchmark
  - benchmarkdotnet
---



# HttpClient 효율적으로 사용하기
  System.Net.Http.HttpClient + Newtonsoft.Json 조합을 효율적으로 사용하는 법에 대해 정리하였다.

## String vs Stream
HttpContent를 읽고 쓸때 여러가지 옵션을 제공한다. 주로 문자열과 스트림을 사용한다.
아래는 응답 컨텐츠를 읽고 모델로 변환하는 과정이다.

### 문자열

```csharp
public async Task<List<Person>> ReadAsStringAsync()
{
    using (var request = new HttpRequestMessage(HttpMethod.Get, ROUTE))
    using (var response = await httpClient.SendAsync(request, CancellationToken.None))
    {
        var content = await response.Content.ReadAsStringAsync();
        if (response.IsSuccessStatusCode)
            return JsonConvert.DeserializeObject<List<Person>>(content);
        throw new Exception(new 
        { 
	        StatusCode = (int)response.StatusCode, 
        	Content = content 
        }.ToString());
    }
}
```
컨텐츠를 문자열로 읽고 이 문자열을 다시 역직렬화한다. 문자열 생성에 추가적인 비용이 든다.



### 스트림

```csharp
public async Task<List<Person>> ReadAsStreamAsync()
{
    using (var request = new HttpRequestMessage(HttpMethod.Get, ROUTE))
    using (var response = await httpClient.SendAsync(request, CancellationToken.None))
    {
        var stream = await response.Content.ReadAsStreamAsync();
        if (response.IsSuccessStatusCode)
        	return DeserializeJsonFromStream<List<Person>>(stream);
        var content = await StreamToStringAsync(stream);
        throw new Exception(new 
        { 
	        StatusCode = (int)response.StatusCode, 
        	Content = content 
        }.ToString());
    }
}
```
컨텐츠를 송수신에 사용된 스트림을 그대로 사용한다. 추가적인 비용이 들지 않는다.

## HttpCompletionOption
HttpClient의 동작완료 시점을 설정해주는 열거형이다.

|옵션|설명|
|---|---|
| ResponseContentRead | 기본값. 컨텐츠를 포함한 모든 응답메시지를 읽었을 때 동작이 완료되었다고 판단한다 |
| ResponseHeadersRead | 헤더읽기가 완료된 시점에 동작이 완료되었다고 판단한다. 스트림과 같이 사용하여 지연시간없이 컨텐츠 읽기가 가능하다.|

```csharp
public async Task<List<Person>> ReadAsStreamOptimizedAsync()
{
    using (var request = new HttpRequestMessage(HttpMethod.Get, ROUTE))
    // SendAsync 메소드에 HttpCompletionOption을 인자로 전달하면 된다.
    using (var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, CancellationToken.None))
    {
        var stream = await response.Content.ReadAsStreamAsync();
        if (response.IsSuccessStatusCode)
        	return DeserializeJsonFromStream<List<Person>>(stream);
        var content = await StreamToStringAsync(stream);
        throw new Exception(new 
        { 
	        StatusCode = (int)response.StatusCode, 
        	Content = content 
        }.ToString());
    }
}
```

## 벤치마크 테스트
[BenchmarkDotNet](https://benchmarkdotnet.org/)을 이용하여 성능분석을 하였다.

### JSON 데이터 응답 컨트롤러 
```csharp
[Route("api/[controller]")]
public class ValuesController : Controller
{
    [Route("long")]
    public FileStreamResult GetLong()
    {
        var fileStream = System.IO.File.Open("people-long.json", System.IO.FileMode.Open);
        return File(fileStream, "application/json");
    }

    [Route("middle")]
    public FileStreamResult GetMiddle()
    {
        var fileStream = System.IO.File.Open("people-middle.json", System.IO.FileMode.Open);
        return File(fileStream, "application/json");
    }

    [Route("short")]
    public FileStreamResult GetShort()
    {
        var fileStream = System.IO.File.Open("people-short.json", System.IO.FileMode.Open);
        return File(fileStream, "application/json");
    }

    [HttpPost]
    public void Post([FromBody] Person value)
    {
    }
}
```
### 벤치마크 테스트 구성
* 3개의 경로에 4개 메소드를 벤치마크 대상으로 정했다.
* 각 경로마다 796763, 400022, 124788 길이( byte)의 컨텐츠가 응답으로 전송된다.
* 응답을 10회 처리하는 것을 1회의 operation으로 구성하였다.

```csharp
private static readonly HttpClient httpClient;
private const int N = 10;

[Params("api/values/long", "api/values/middle", "api/values/short")]
public string Route { get; set; }

static HttpClientRun()
{
    httpClient = new WebApplicationFactory<Startup>().CreateClient();
}

[Benchmark]
public async Task GetStringBenchAsync()
{
    for (int i = 0; i < N; i++)
    {
        await GetStringAsync();
    }
}

[Benchmark]
public async Task ReadAsStringBenchAsync()
{
    for (int i = 0; i < N; i++)
    {
        await ReadAsStringAsync();
    }
}


[Benchmark]
public async Task ReadAsStreamBenchAsync()
{
    for (int i = 0; i < N; i++)
    {
        await ReadAsStreamAsync();
    }
}

[Benchmark]
public async Task ReadAsStreamOptimizedBenchAsync()
{
    for (int i = 0; i < N; i++)
    {
        await ReadAsStreamOptimizedAsync();
    }
}
```
### 벤치마크 결과
![benchmark-result](/assets/images/csharp/http-client-benchmark-result.png)

* 문자열 방식 및 스트림 방식 모두 응답컨텐츠가 길어질수록 처리시간 및 메모리 사용량이 선형으로 증가한다.
* ReadAsStringAsync()보다 HttpClient에서 구현된 GetStringAsync() 메소드가 처리시간 및 메모리사용량에서 우월하다. 
  * ReadAsStringAsync()를 제대로 사용하지 못한 것 같다.
  * GetStringAsync()의 결과를 문자열 방식의 결과값으로 사용하였다.
* 스트림 방식은 문자열 방식보다 3% 빠르게 처리하며 27% 적은 메모리를 사용한다.
* 최적화된 스트림방식은 문자열방식보다 13% 빠르게 처리하며 45% 적은 메모리를 사용한다.

## 링크
* [소스코드](https://github.com/madstone290/HttpClientBenchmark)

## 결론
스트림 방식을 사용하여 컨텐츠를 읽을 때 메모리 사용량과 처리속도에서 모두 이득을 얻을 수 있다. 
적극적으로 스트림 방식을 사용하자.