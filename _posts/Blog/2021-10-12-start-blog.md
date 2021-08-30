---
title: Blog 시작하기
permalink: blog/start-blog
categories:
  - blog
tags:
  - web
  - html
  - blog
  - jekyll
  - github
---



# 블로그 시작하기
블로그를 구축하면서 알게된 내용을 정리하였다.

## Github
Github pages 서비스를 통해 정적 사이트 호스팅이 가능하다.  Github를 선택한 이유는 단순하다.
블로그 구성을 직접 해봄으로써 다양한 기술을 배우고 싶었다. 필요한 기능을 직접 구현해야하는 점이 누군가에겐 번거로움일 수 있다. 하지만 내겐 해당 기능을 직접 구현해 볼 좋은기회였다.

* 깃허브 페이지는 무료로 정적 사이트 호스팅을 제공한다.
* 사이트 구성에 필요한 파일들을 깃허브 저장소에 올리면 사이트가 호스팅된다.

## Jekyll
정적 사이트를 생성해주는 프로그램이다. Liquid 언어를 통해 사이트 생성에 필요한 다양한 기능을 제공한다. 깃허브 페이지에는 지킬 프로세스가 백그라운드에서 동작하고 있으므로 빌드되지 않은 지킬파일(md, html)을 커밋하여도 변환된 결과를 확인할 수 있다.
* [Jekyll](https://jekyllrb.com/) 지킬 사이트
* [지킬 시작하기](http://jekyllbootstrap.com/)를 참조하였다.

## Minimal mistake
지킬로 구현된 인기테마 중 하나이다. 구성이 간단하고 확장이 용이해 선택하였다.
* [시작 가이드](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/)가 잘 정리되어 있다.

## Staticman
정적 사이트에서 댓글기능을 제공하는 오픈소스이다. 댓글을 리파지토리에 보관한다.
Jekyll + GitHub Pages에 최적화되어 있다.  Staticman인스턴스를 Heroku 플랫폼에서 구동하였다.
* [Staticman](https://staticman.net/) 문서를 참조하였다.
* [Adding comments to a Jekyll site with Staticman](https://mademistakes.com/mastering-jekyll/static-comments/)를 참조하였다.

## 결론
블로그를 구축하면서 다양한 기술 및 개념들을 알게 되었다.  