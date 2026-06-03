# 디자인 시스템 정책 — WDS/Montage + 모바일 우선

오일레이더 프론트엔드의 **모든 디자인 스타일은 원티드 WDS(Montage)** 를 따른다. 참고 저장소: `montage-web/`.

## 실제 적용 방식 (중요)
`@wanteddev/wds-*` 패키지는 GitHub Packages **비공개 레지스트리**이고 우리 계정에 접근 권한이 없어 **패키지로 설치하지 않는다**. 대신:
1. **토큰 값 로컬 복제**: `montage-web/packages/wds-theme` 빌드 결과에서 추출한 실제 토큰 값(색/간격/타이포/그림자)을 `frontend/src/theme/tokens.ts` 에 그대로 옮겨, WDS와 **동일한 디자인 값**을 Emotion 테마로 사용한다. (light 테마 · WDS v3.8.1)
2. **컴포넌트 직접 구현**: WDS 컴포넌트를 import 하지 않고, 위 토큰만 사용해 동일한 룩앤필로 자체 구현한다.
3. **참고 소스**: `montage-web/` 의 `docs/data/components`, `packages/*/src`, `.claude/references`, 그리고 로컬 빌드한 `wds-mcp` 를 디자인 근거로 참고한다.

> 토큰 값이 바뀌면 `wds-theme` 재빌드 후 `tokens.ts` 를 갱신한다. 임의 색/간격 하드코딩은 여전히 금지 — 항상 `theme` 경유.

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
> ⚠️ `@wanteddev/wds-mcp`는 공개 npm에 없어 위 npx 명령은 토큰이 필요하다. 우리는 **로컬 빌드**로 대체했다:
> ```bash
> # montage-web 모노레포에서 (Node 22 필요)
> pnpm install
> pnpm --filter "@wanteddev/wds-theme..." build
> pnpm --filter @wanteddev/wds-mcp build
> # Claude Code 등록 (Node 22 절대경로 권장)
> claude mcp add montage-mcp-server -- <node22> <repo>/montage-web/packages/wds-mcp/dist/index.mjs
> ```
> firebase 자격증명 없이도 동작 확인됨(✓ Connected).
주요 도구: `list_components`, `get_component`, `list_tokens`, `get_color_usage`, `wds_coding_guidelines`, `list_icons`, `list_dummy_components`.

> designer 에이전트는 설계 전 위 도구로 규칙·토큰을 확인한 뒤 작업한다.
