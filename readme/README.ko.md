# 트위치 라디오모드 크롬 확장 프로그램

웹에서 트위치를 실행할 때 라디오모드를 할 수 있게 하는 크롬 확장 프로그램입니다. 영상에서 소리 부분만 재생하는 것이 아니고 소리만 있는 스트림을 바로 재생하기 때문에 

## 설치

[크롬 웹스토어](https://chrome.google.com/webstore/detail/twitch-radio-mode/dbojkfdnamfipdnlknbpjphemjnldeoo) 에서 설치 가능합니다.

코드를 다운받아 설치하실 경우 [여기](https://support.google.com/chrome/a/answer/2714278?hl=ko)의 2단계를 참조해 주세요.

다운받은 zip 파일에 이미 컴파일된 자바스크립트 코드가 있어 실행을 위해 별도의 빌드는 필요하지 않습니다.

## 사용

스트리머의 트위치 채널 페이지에서 영상 아래쪽 재생 버튼 및 음량 조절과 함께 라디오 모양의 아이콘이 생성되어 있습니다.

![Radio mode button](https://raw.githubusercontent.com/c-rainbow/twitch-audio-web/master/public/images/radiobutton.png)

클릭하면 영상이 정지되고 라디오모드가 실행됩니다. 라디오 아이콘의 색도 변합니다.

![Radio mode on](https://raw.githubusercontent.com/c-rainbow/twitch-audio-web/master/public/images/radiomode.png)

음량 조절은 영상의 조절 버튼을 그대로 사용하여 가능하고, 중지하려면 라디오 버튼을 한번 더 클릭해주세요.

영상 재생 버튼을 누르면 라디오모드가 중지되고 바로 영상이 재생됩니다.

## 개발

이 프로젝트는 TypeScript와 webpack을 사용하여 개발되었습니다. 프로젝트를 다운받은 후 필요한 라이브러리를 설치해주세요.

```
> npm i
```

웹팩으로 빌드 시 dist/background.js 와 dist/contentscript.js 파일이 업데이트됩니다.

```
> webpack
```

컴파일된 코드를 크롬 브라우저에서 설치해 주세요.