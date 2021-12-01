---
title: Marium reflect 백업 및 복원
permalink: computer/marium-backup
categories:
  - computer
tags:
  - computer
  - backup
  - restore
  - macrium reflect
---



# Macrium Reflec를 이용하여 백업 및 복원하기
컴퓨터에 발생할 수 있는 문제에 대비하여 시스템 이미지를 생성하고 이를 통해 시스템을 복원할 수 있다. 윈도우 내장 백업/복원 프로그램은 지원이 중단되었으므로 Macrium Reflect를 이용하여 이미지 생성 및 복원을 실행할 수 있다.

## Macrium Reflect
백업 및 복원 소프트웨어이다. 설치를 위해서 다음 [링크](https://www.macrium.com/reflectfree)로 이동한다. 이메일 인증과정을 거친 후 프로그램을 설치한다.

## 백업
백업장소로 외장하드를 사용하였다.
Image this disk... 버튼을 눌러 이미지가 생성될 디렉토리를 선택한다.
이미지 이름을 작성한 후 이미지 생성을 시작한다.

### 문제 및 해결
이미지 생성 중 **Error: Backup aborted! - Write operation failed - The request could not be performed because of an I/O device error** 에러가 발생할 수 있다.
외장하드 디스크 정책 중 빠른제거 옵션을 사용할 경우 발생하며 향상된 성능 옵션 사용시 문제를 해결할 수 있다.

[외장하드 디스크 정책 변경하기](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=sjinwon2&logNo=220815103923#:~:text=%EC%93%B0%EA%B8%B0%20%EC%BA%90%EC%8B%9C%EB%8A%94%20%ED%95%98%EB%93%9C%20%EB%94%94%EC%8A%A4%ED%81%AC,%EA%B8%B0%EB%8A%A5%EC%9D%B4%EB%9D%BC%EA%B3%A0%20%EB%A7%90%ED%95%98%EA%B8%B0%EB%8F%84%20%ED%95%B4%EC%9A%94.)


## 복원
복원을 위해서는 부팅용 USB가 필요하다. Rescue 버튼을 이용하여 부팅USB를 생성한다.
부팅USB를 사용하여 부팅을 진행한 후 Macrium Reflect 복원화면에서 기존에 생성한 이미지 경로를 선택한다.
복원이 완료되면 부팅USB를 제거한 후 재부팅한다.

## 결론
Macrium Reflect를 이용하여 시스템 이미지를 생성할 수 있다. 생성된 이미지를 이용하여 언제든지 간편하게 시스템 복원이 가능하다.