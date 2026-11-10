# 테스트 · 검증 기록

## 1. 정적 검사 · 빌드 (2026-11-10)

| 항목 | 명령 | 결과 |
| --- | --- | --- |
| 타입 검사 | `pnpm typecheck` | 통과 |
| 린트 | `pnpm lint` | 통과 |
| 프로덕션 빌드 | `pnpm build` | 통과 (`/` 정적 프리렌더, revalidate 1h) |

## 2. 단위 테스트 — `pnpm test` (18건 통과)

| 대상 | 검증 내용 |
| --- | --- |
| `contact/http` | 201 저장 / 200 중복 / 함정 필드 무시 / 400 필드 오류 / 400 UUID 아님 / 415 / 400 깨진 JSON / 413 (content-length 없이도) / 503 미설정 / 500 내부 정보 비노출 |
| `contact/repository` | snake_case 컬럼 변환, `23505` → 중복, 그 외 오류 전파 |
| `achievements/seed-sql` | 작은따옴표 이스케이프, 커밋된 `seed.sql` = 기준 데이터, display_order 중복 없음 |
| `supabase/config` | 공백 제거, 값 누락 시 null |

## 3. API 테스트 — 프로덕션 서버 (`pnpm build && pnpm start`)

Supabase 미설정 상태에서 실행했습니다.

| 요청 | 기대 | 결과 |
| --- | --- | --- |
| `GET /` | 200, 수상 목록(seed) 포함 | 200 ✅ |
| `GET /api/health` | 200, `supabaseConfigured: false` | 200 ✅ |
| `POST /api/contact` (유효) | 503 `SERVICE_UNAVAILABLE` | 503 ✅ |
| `POST /api/contact` (`text/plain`) | 415 | 415 ✅ |
| `POST /api/contact` (깨진 JSON) | 400 `INVALID_JSON` | 400 ✅ |
| `GET /api/contact` | 405 | 405 ✅ |

> 실제 Supabase 프로젝트에 대한 `201`/`200(중복)` 확인은 Supabase 프로젝트 생성 후 진행합니다. 저장 경로의 SQL·권한은 아래 4번에서 실제 PostgreSQL로 검증했습니다.

## 4. RLS · 동시성 테스트 — `pnpm test:db` (8건 통과)

격리된 PostgreSQL 16에 Supabase와 같은 `anon` / `authenticated` 역할을 만들고, 마이그레이션 → seed 순서로 적용한 뒤 `anon` 역할 연결로 실행했습니다.

### 권한 (RLS + 컬럼 권한)

| 시나리오 | 결과 |
| --- | --- |
| anon이 수상·활동 조회 | 기준 데이터와 같은 순서로 조회 ✅ |
| anon이 수상 추가·수정·삭제 | `42501` 거부 ✅ |
| anon이 연락 메시지 작성 | 저장됨 ✅ |
| anon이 연락 메시지 조회 | `42501` 거부 ✅ (다른 방문자 메시지 노출 방지) |
| anon이 `id` 직접 지정 / 수정 / 삭제 | `42501` 거부 ✅ |
| seed 재적용 | 행 수 변화 없음 ✅ |

### 데이터 정합성 (check 제약)

서버 검증을 우회해 DB에 직접 넣어도 `23514`로 거부됨을 확인했습니다: 공백뿐인 이름, 51자 이름, 이메일 형식 오류, 10자 미만 / 2000자 초과 메시지.

### 동시성

| 시나리오 | 결과 |
| --- | --- |
| 같은 `idempotencyKey`로 50건 동시 insert | 1건 성공, 49건 모두 `23505`, 저장 행 1건 ✅ |
| 서로 다른 키 50건 동시 insert | 50건 모두 저장 ✅ |

**판단 기준**: 중복 여부를 애플리케이션에서 먼저 조회(check-then-insert)하면 동시 요청 사이에 경쟁 조건이 생깁니다. 그래서 `idempotency_key unique` 제약 하나로 판정하고, API는 `23505`를 "이미 처리된 요청"(200)으로 변환합니다. 위 테스트로 동시 요청에서 오류 종류가 `23505` 외에 섞이지 않음을 확인했습니다.

## 5. 화면 검수 (Chrome headless)

| 뷰포트 | 결과 |
| --- | --- |
| 1440×900 | 콘솔 오류 없음, 가로 스크롤 없음 |
| 390×844 | 콘솔 오류 없음, 가로 스크롤 없음 (아래 수정 후) |

### 검증 중 발견해 수정한 문제

| 문제 | 원인 | 수정 |
| --- | --- | --- |
| 빌드 실패: `crypto.randomUUID()` in Client Component | 렌더링 중 무작위 값을 만들면 정적 프리렌더 결과에 고정됨 | 키를 첫 제출 시점(이벤트 핸들러)에 발급하고 ref로 보관 |
| 모바일 가로 스크롤 | 1열 grid 안의 `pre`(코드 블록)가 열 최소 너비를 늘림 | `grid-cols-1` + 자식 `min-w-0`로 코드 블록만 가로 스크롤 |
| 표지로 돌아와도 내비게이션 강조 유지 | 표지 섹션을 관찰하지 않음 | 표지도 관찰해 강조 해제 |
| `test:db` 초기 실패 | `DROP DATABASE`를 여러 문장 묶음(암묵적 트랜잭션)으로 실행 | 문장을 하나씩 실행 |

## 6. 디자인·콘텐츠 개편 후 재검증 (2026-11-10)

Notion 기준으로 내용을 바꾸고 다크 테마로 화면을 다시 구성한 뒤 같은 검증을 반복했습니다.

| 항목 | 결과 |
| --- | --- |
| `pnpm typecheck` / `pnpm lint` / `pnpm build` | 통과 |
| `pnpm test` | 18건 통과 |
| `pnpm test:db` (RLS·동시성) | 8건 통과 — 수상·활동 순서를 Notion과 같은 오래된 순으로 바꾼 seed로 재확인 |
| `GET /` · `GET /api/health` | 200 |
| `POST /api/contact` (`text/plain` / Supabase 미설정) | 415 / 503 |
| 화면 1440×900 · 390×844 | 콘솔 오류 없음, 가로 스크롤 없음 |

### 콘텐츠 반영 기준

- Notion에서 취소선이 그어진 항목(Kafka, TypeScript, 2027.01 해외 인턴십)은 제외했습니다.
- "서비스 화면 및 구현 증빙"(스크린샷 자리)과 FocusOn "예상 문제와 검증 계획 — SAMPLE" 표는 작성 예정 항목이라 제외했습니다.
- Contact의 이메일 오타(`pakrjinuk09`)는 Closing에 적힌 `parkjinuk09@gmail.com`으로 통일했습니다.
- Notion 아키텍처 이미지 2장은 작업 환경에서 내려받을 수 없어 넣지 못했습니다(이미지 추가 방법은 README 참고).

## 7. 전체 폭 레이아웃 · 프로젝트 상세 페이지 추가 후 재검증 (2026-11-10)

| 항목 | 결과 |
| --- | --- |
| `pnpm typecheck` / `pnpm lint` / `pnpm build` | 통과 (`/projects/capteam`, `/projects/focuson` 정적 생성) |
| `pnpm test` / `pnpm test:db` | 18건 / 8건 통과 |
| `GET /` · `/projects/capteam` · `/projects/focuson` · `/api/health` | 200 |
| `GET /projects/nope` (없는 프로젝트) | 404 |
| 메인 · 상세 화면 1440×900 / 390×844 | 콘솔 오류 없음, 가로 스크롤 없음 |

### 발견해 수정한 문제

| 문제 | 원인 | 수정 |
| --- | --- | --- |
| 빌드 실패: `dynamicParams` 사용 불가 | Cache Components 환경에서는 route segment config `dynamicParams`를 지원하지 않음 | 설정을 제거하고, 목록에 없는 slug는 `notFound()`로 404 처리 |
| 상세 페이지에서 "맨 위로" 버튼이 동작하지 않을 수 있음 | 메인 표지의 `#top` 앵커에 의존 | 앵커 대신 `window.scrollTo`로 이동 (모션 줄이기 설정 시 즉시 이동) |

## 8. 참고 사이트 색상·표지 사진 반영 후 재검증 (2026-11-10)

- 색상: 참고 사이트의 실제 계산값(배경 `#171717`, zinc 계열 본문, 민트 `#46edd5` 4px 스크롤바, pink-400 태그, indigo-300 카드 강조)으로 맞춤
- 기준 글자 크기: 14 → 15(640px~) → 16px(768px~)
- 표지: 사용자 제공 사진(HEIC 6016px → WebP 2400px, 약 430KB)을 배경으로 넣고 어둡게 덮어 글자 대비 확보

| 항목 | 결과 |
| --- | --- |
| typecheck / lint / build | 통과 |
| `pnpm test` / `pnpm test:db` | 18건 / 8건 통과 |
| `/`, `/projects/capteam`, `/projects/focuson`, `/images/hero-dome.webp` | 200 |
| 화면 1440×900 / 390×844 | 콘솔 오류 없음, 가로 스크롤 없음 |
