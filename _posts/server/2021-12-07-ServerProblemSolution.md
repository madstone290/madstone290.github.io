---
title: 서버 문제 및 해결
permalink: server/problem-solution
categories:
  - server
tags:
  - server
  - linux
  - selinux
  - nginx
---

# 서버 문제 및 해결
서버에서 발생한 문제 및 해결법을 정리한다.

## (13: Permission denied) while connecting to upstream
내용: Nginx <-> kestrel(dotnet) 리버스 프록시 구성 중 에러 발생

OS: centos7

원인: SELinux booleans 보안정책 옵션 중 httpd_can_network_connect 값이 off. off인 경우 httpd(nginx, apache...)에서 네트워크 연결 불가.

해결: httpd_can_network_connect 값을 on으로 변경. 
```
# -P: persistant
sudo setsebool -P httpd_can_network_connect 1
```




