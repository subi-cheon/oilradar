# 디자인 시스템 정책 — WDS/Montage + 모바일 우선

오일레이더 프론트엔드의 **모든 디자인 스타일은 원티드 WDS(Montage)** 를 따른다. 참고 저장소: `montage-web/`.

## 절대 규칙
1. **WDS 컴포넌트 우선**: UI는 `@wanteddev/wds` 컴포넌트로 구성한다. 컴포넌트가 없을 때만 신규 작성하되, 먼저 `wds-mcp`로 존재 여부를 확인한다.
2. **토큰만 사용**: 색상·간격·타이포는 `@wanteddev/wds-theme` 디자인 토큰을 쓴다. **임의 HEX 색상·px 하드코딩 금지.**
3. **모바일 우선**: 모바일 레이아웃을 기준으로 설계하고 PC로 확장한다.
   - PC: 좌(카카오맵) / 우(챗봇) 분할.
   - 모바일: 지도 / 챗봇 **탭 전환**, 하단 `BottomTabBar`(`@wanteddev/wds-dummy`) 활용.
4. **폰트**: Pretendard. 앱 루트는 WDS `<ThemeProvider>` + `@wanteddev/wds/global.css`.
5. **버전 일치**: 모든 `@wanteddev/wds-*` 패키지는 동일 버전으로 설치.

## 설치 메모 (frontend 단계에서)
`@wanteddev/wds-*`는 GitHub Packages 비공개 레지스트리. `.npmrc`에 아래 추가 + GitHub 토큰 필요:
```
@wanteddev:registry=https://npm.pkg.github.com/
```

## AI 개발 보조 — wds-mcp
WDS는 컴포넌트/토큰/아이콘/가이드라인을 제공하는 MCP 서버를 운영한다. Claude Code 등록:
```
claude mcp add montage-mcp-server -- npx -y @wanteddev/wds-mcp@latest
```
> ⚠️ `@wanteddev/wds-mcp`는 **공개 npm에 없고 GitHub Packages 비공개 레지스트리**에 있다. 위 npx 명령은 `.npmrc` 레지스트리 설정 + GitHub 토큰(`read:packages`)이 있어야 동작한다. **frontend(4단계) 착수 시 토큰과 함께 등록**한다. (그 전에는 연결 실패하므로 등록 보류)
주요 도구: `list_components`, `get_component`, `list_tokens`, `get_color_usage`, `wds_coding_guidelines`, `list_icons`, `list_dummy_components`.

> designer 에이전트는 설계 전 위 도구로 규칙·토큰을 확인한 뒤 작업한다.
