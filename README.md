# ⛽ 오일레이더 (OilRadar)

지도 + 챗봇 웹 서비스. 챗봇이 연료 종류·위치를 물어보고, 오피넷 공공 API로 반경 10km 내 **최저가 주유소**를 실시간 탐색해 카카오맵에 표시하고 네이버지도 경로 안내로 연결한다.

> 기획서: [oilradar-plan_v3.md](oilradar-plan_v3.md)

## 현재 상태 — 1단계 완료 (백엔드 코어)
오피넷 API 연결 + 반경 내 유종별 최저가 계산 로직 + 콘솔 데모 + 테스트.

```
backend/
  config.py       # .env 로딩 + 유종코드/브랜드/반경 상수
  geo.py          # WGS84 ↔ KATEC 좌표 변환, 거리 계산
  models.py       # Station, CheapestResult
  opinet.py       # 오피넷 aroundAll.do 클라이언트 (10km 그리드 분할)
  calculator.py   # 유종별 최저가 산출 (동점 시 거리순)
  naver_link.py   # 네이버지도 딥링크
  main.py         # 1단계 콘솔 데모 진입점
tests/            # pytest (네트워크 목)
```

## 빠른 시작
```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env          # OPINET_API_KEY 등 입력
.venv/bin/python -m pytest -q
.venv/bin/python -m backend.main        # .env 기본 좌표(대전 둔산동)
.venv/bin/python -m backend.main 36.3504 127.3845 5000   # 좌표·반경 지정
```

## 프론트엔드 (2단계 — 진행 중)
지도 + 챗봇 레이아웃. **모바일 우선**(지도/챗봇 탭 전환), 데스크탑은 좌 지도 / 우 챗봇 분할. 디자인은 WDS/Montage 토큰을 로컬 복제해 적용([docs/design-system.md](docs/design-system.md)).

```bash
cd frontend
# Node 22 필요 (nvm use 22), pnpm
pnpm install
cp .env.example .env.local      # NEXT_PUBLIC_KAKAO_MAP_KEY (선택)
node_modules/.bin/next dev       # http://localhost:3000
```
> 카카오맵 키가 없으면 지도 자리에 주유소 목록 플레이스홀더가 표시됩니다. 챗봇은 현재 mock 데이터로 동작하며, 백엔드 API/Claude 연동은 4단계 예정.

## 문서
- [CONTRIBUTING.md](CONTRIBUTING.md) — 브랜치/커밋/개발 환경
- [docs/policies.md](docs/policies.md) — 개발·운영 정책 (main/dev 서버 분리 포함)
- [docs/design-system.md](docs/design-system.md) — WDS/Montage + 모바일 우선 디자인 정책
- [.claude/agents/](.claude/agents/) — 기획/디자인/프롬프트 보조 서브에이전트

## 로드맵
1. ✅ 오피넷 연결 + 최저가 계산
2. ✅ Next.js 레이아웃 (좌 지도 / 우 챗봇, 모바일 탭) + 카카오맵 연동 (현재)
3. 챗봇 대화 흐름
4. Claude API 자연어 후속질문
5. 지도-챗봇 마커 동기화
6. 모바일 반응형 + 네이버지도 딥링크
7. 배포 (main=운영 / dev=개발)
8. 실효비용 계산 + 유가 트렌드
