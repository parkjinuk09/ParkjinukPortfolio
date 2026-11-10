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

## 9. 참고 사이트 구성으로 메인 화면 재작성 후 재검증 (2026-11-10)

참고 사이트를 실제로 열어 레이아웃 값(본문 최대 1100px, 좌측 168px 정렬, About 1fr:3fr, 프로젝트 슬라이드 2열·비활성 흑백, 글 카드 14:9 2열)과 글자 크기(표지 수식어 24px · 대제목 3.2rem Montserrat, 섹션 제목 30/48px)를 측정해 맞췄습니다.

| 항목 | 결과 |
| --- | --- |
| typecheck / lint / build | 통과 |
| `pnpm test` / `pnpm test:db` | 18건 / 8건 통과 |
| `/`, `/projects/capteam`, `/projects/focuson`, `/api/health` | 200 |
| `POST /api/contact` (`text/plain` / Supabase 미설정) | 415 / 503 |
| 메인 · 상세 1440×900 / 390×844 | 콘솔 오류 없음, 가로 스크롤 없음 |

### 발견해 수정한 문제

| 문제 | 원인 | 수정 |
| --- | --- | --- |
| 린트 실패: 렌더 중 변수 재할당 | 글자 순번을 `let`으로 누적 | 단어별 시작 위치를 미리 계산 |
| 표지 아래쪽에 배경이 잘린 경계선 | 배경은 화면 높이인데 표지 영역이 더 짧음 | 표지 영역 최소 높이를 화면 높이로 지정 |
| 상세 페이지에서 메뉴 "Troubleshooting"이 강조됨 | 상세 페이지에도 같은 id(`troubleshooting`)가 있어 현재 섹션으로 감지 | 다른 페이지에서는 현재 섹션 감지를 하지 않음 |

### 없는 프로젝트 주소 404 처리

- 문제: 없는 주소(`/projects/nope`)의 서버 시작 후 첫 요청이 200으로 응답됨
- 원인: Cache Components는 목록에 없는 경로에 정적 셸을 먼저 스트리밍(`x-nextjs-postponed: 1`)하므로, 페이지의 `notFound()`가 실행되기 전에 상태 코드 200이 이미 전송됨
- 수정: `src/proxy.ts`에서 렌더링 전에 slug를 확인하고, 목록에 없으면 존재하지 않는 경로로 rewrite해 not-found 화면을 404로 응답
- 확인: `/projects/abc` 첫 요청·재요청 모두 404, `/projects/capteam` · `/projects/focuson` 200, `/` · `/api/health` 200

## 10. 링크 · 기술 로고 · 소개 문구 · 프로젝트 카드 수정 (2026-11-11)

| 요청 | 반영 |
| --- | --- |
| Tistory · Instagram · LinkedIn 링크 | 헤더 · 표지 아이콘, 표지 Contact 목록, 연락 영역에 추가 |
| Java · Redis · AWS EC2 로고 | Devicon 컬러 SVG로 교체 (AWS는 어두운 배경에서 보이도록 글자색만 흰색으로 변경) |
| 2026 → 2023 | About 두 번째 수치를 `2023 ~`로 변경 |
| 소개 문장 가독성 | "고려하는 것 / 경험한 것" 두 묶음의 키워드로 분리 |
| 기술 스택 호버 | 평소 흑백(`grayscale(1)`) → 호버 시 원래 색(`grayscale(0)`) |
| 트러블슈팅 카드 | 메인에서 제거하고 같은 자리에 프로젝트 카드(Main Projects) 배치. 트러블슈팅은 프로젝트 상세에 그대로 있음 |

| 항목 | 결과 |
| --- | --- |
| typecheck / lint / build | 통과 |
| `pnpm test` / `pnpm test:db` | 18건 / 8건 통과 |
| 헤더 링크 5개 href | GitHub · Blog · Instagram · LinkedIn · Email 확인 |
| 기술 로고 9개 | 모두 로드(naturalWidth 150) |
| 1440×900 / 390×844 | 콘솔 오류 없음, 가로 스크롤 없음 |

## 11. 표지 Contact 목록을 대표 수상으로 교체 (2026-11-11)

- 문제: 표지 왼쪽 아이콘과 오른쪽 Contact 목록이 같은 링크 5개를 중복 표시하고, 목록이 6줄로 길어 Projects 목록과 균형이 맞지 않음
- 수정: 링크는 왼쪽 아이콘에만 두고, 오른쪽은 대표 수상 2건(여수 해커톤 최우수상 · 교내 캡스톤 대상)으로 교체. 전화번호·이메일은 하단 Contact 영역에 그대로 있음
- 확인: typecheck / lint / build 통과, 단위 18건 · DB 8건 통과, 1440×900 · 390×844 콘솔 오류 · 가로 스크롤 없음

## 12. Vercel 배포 검증 (2026-11-11)

- 대상: https://parkjinuk-portfolio.vercel.app (프로덕션, `main` @ `8cd55d1`, PR #8)
- 연결 방식: Vercel 프로젝트를 GitHub 저장소에 연결했습니다. `main` 머지는 프로덕션, 그 외 브랜치 푸시는 Preview로 자동 배포됩니다.
  - PR #7(`dev`)과 PR #8(`main`) 머지 후 각각 Preview와 프로덕션 배포가 자동으로 생성된 것을 확인했습니다.
- 빌드: Vercel 빌드 26초 통과 (Next.js 16.4.6, Cache Components · Partial Prefetching 활성)
- 환경 변수: Supabase 프로젝트가 아직 없어 설정하지 않았습니다(`supabaseConfigured: false`).

### API · 페이지

| 요청 | 기대 | 결과 |
| --- | --- | --- |
| `GET /` | 200, 표지 대표 수상 포함 | 200 ✅ |
| `GET /projects/capteam` · `/projects/focuson` | 200 | 200 ✅ |
| `GET /projects/nope` | 404 | 404 ✅ (첫 요청부터 404) |
| `GET /api/health` | 200, `supabaseConfigured: false` | 200 ✅ |
| `GET /images/*.webp`, `/_next/image` 4건 | 200 | 200 ✅ |
| `POST /api/contact` (유효) | 503 `SERVICE_UNAVAILABLE` | 503 ✅ |
| `POST /api/contact` (`text/plain`) | 415 | 415 ✅ |
| `POST /api/contact` (깨진 JSON) | 400 `INVALID_JSON` | 400 ✅ |
| `POST /api/contact` (필드 오류) | 503 (아래 참고) | 503 ✅ |
| `GET /api/contact` | 405 | 405 ✅ |

- 필드 오류가 400이 아니라 503인 이유: 입력 검증은 저장 서비스(`submitContactMessage`)에서 수행합니다. 그래서 저장소가 미설정이면 검증 전에 503으로 응답합니다. 415 · 413 · 깨진 JSON은 저장소 설정과 무관하게 먼저 거절합니다. 의도된 순서이므로 코드는 바꾸지 않았습니다.
- 모바일 390×844에서 `/`, `/projects/capteam`, `/projects/focuson` 모두 가로 스크롤이 없습니다. 콘솔 오류는 위 테스트 요청의 4xx/5xx 응답 로그뿐입니다.

### 동시성

- 배포 환경은 Supabase 미설정이라 저장 경로 동시성은 배포 URL에서 재현할 수 없습니다. DB 제약 기반 판정은 4번(`pnpm test:db`, 같은 키 50건 동시 → 1건 저장)으로 검증되어 있습니다. Supabase 연결 후 배포 URL에서 다시 확인합니다.

### 참고

- 함수 리전이 기본값 `iad1`(미국 동부)이고, 정적 응답은 서울 엣지(`icn1`)에서 나갑니다. Supabase를 연결할 때 DB 리전과 함수 리전을 맞추는 것을 권장합니다(예: 둘 다 서울).
