# 기여 가이드

## 브랜치 전략
- `main`(운영) / `dev`(개발) 분리. 기능은 `feature/*` → `dev` → `main`.
- 자세한 정책: [docs/policies.md](docs/policies.md)

## 개발 환경 (백엔드)
```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env   # 키 채우기
.venv/bin/python -m pytest -q          # 테스트
.venv/bin/python -m backend.main       # 1단계 콘솔 데모
```

## 커밋 컨벤션
Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

## 코드 스타일
- Python: ruff 린트, 타입힌트 권장.
- 프론트: WDS/Montage 전용, 모바일 우선 — [docs/design-system.md](docs/design-system.md)

## 개발 보조 에이전트
`.claude/agents/`에 기획(`planner`)·디자인(`designer`)·프롬프트(`prompt-engineer`) 서브에이전트 정의. 필요 시 명시적으로 호출한다(자동 스폰 안 함).
