---
title: 구글 드라이브 API 사용하기
permalink: csharp/use-google-drive-api
categories:
  - csharp
tags:
  - c#
  - csharp
  - google
  - drive
  - google drive
  - open api
  - api
---



# 구글 드라이브 API를 사용하여 파일전송하기
Google drive API를 사용하여 파일을 업로드한다. 구글드라이브를 통해 파일을 읽어올 수 있다. 

## GCP 프로젝트 생성하기
구글 API를 사용하기 위해 GCP(구글 클라우드 플랫폼)에서 신규 프로젝트를 생성한다.

[GCP 콘솔](https://console.cloud.google.com)->홈->대시보드로 이동한다.

## 구글 드라이브 API 활성화 하기
프로젝트에서 API를 사용에 앞서 활성화를 해주어야 한다. GCP 콘솔->API 및 서비스->라이브러리로 이동한다. Google drive api 검색 후 사용 버튼을 누른다.

## 사용자 인증 추가하기
클라이언트 식별을 위해 사용자 인증이 필요하다. 사용자 인증은 3가지가 있으면 필요에 맞게 사용한다. GCP 콘솔->API 및 서비스->사용자 인증 정보로 이동한다.

|인증방법|내용|
|-------|----|
|API 키|할당량과 접근 권한을 확인하는데 사용된다.|
|OAuth|사용자 동의를 얻고 사용자의 데이터에 접근한다.|
|서비스 계정|봇 계정을 사용한다.|

다른 사용자의 데이터에 접근할 일이 없으므로 서비스 계정을 사용하여 파일을 업로드한다.
서비스 계정을 생성하면 해당 계정의 구글드라이브가 생성되는데 **일반적인 웹환경에서 접속이 불가능하다.** 이런 문제를 해결하기 위해 **일반 사용자의 드라이브에 폴더를 생성하고 서비스계정에 공유한다.**

## C#에서 google drive api사용하기
개발자 문서에 튜토리얼이 잘 정리되어 있다.
* [구글 드라이브 API 문서](https://developers.google.com/drive/api/v3/about-sdk)
* [구글 드라이브 API 문서 C#](https://developers.google.com/drive/api/v3/quickstart/dotnet)
* [C# 가이드](https://www.daimto.com/google-drive-api-c/)

API 사용은 두 단계로 정리할 수 있다.
1. 사용자 인증. OAuth 혹은 서비스 계정을 사용하여 인증을 진행한다. 인증이 완료되면 인증객체를 통해 DriveService객체를 생성할 수 있다.
2. DriveService객체를 통해 드라이브 기능을 사용한다. 파일 추가,수정,삭제 등의 작업을 할 수 있다.

## 결론
구글 드라이브 API를 사용하여 파일을 공유할 수 있다. 외부에서 접속이 불가능한 환경에서 파일을 공유하는 매체로 구글드라이브를 이용할 수 있다.