# 박진욱 | Backend Developer Portfolio

Spring Boot 백엔드 개발자 박진욱의 포트폴리오 사이트입니다.

- **내용**: Notion 「박진욱 (Backend · Software Engineer)」 페이지의 문구와 구성(소개 → Main Projects → Closing → Awards & Activities)을 따릅니다.
- **디자인**: 다크 차콜 배경, 굵은 영문 대제목, 화면 전체 폭 레이아웃, 좌측 고정 + 우측 콘텐츠, 프로젝트 카드 슬라이더 구성입니다.
- **프로젝트 상세**: 카드를 누르면 `/projects/[slug]`에서 Figma 포트폴리오 형식(개요 → 시스템 구성 → 인증 흐름 → 설계 결정 → API 정책 → 트러블슈팅)으로 보여줍니다.

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프론트엔드 | Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4 |
| 데이터 | Supabase (PostgreSQL + RLS) |
| 검증 | zod (클라이언트·서버 공용 스키마), PostgreSQL check / unique 제약 |
| 테스트 | Vitest (단위), 격리 PostgreSQL 16 (RLS·동시성) |

## 폴더 구조

```text
src/
  app/                    # 라우트 (page, layout, api/*)
  components/
    layout/               # 상단 내비게이션, 맨 위로 버튼
    motion/               # 스크롤 등장 애니메이션
    sections/             # 메인 화면 섹션 (표지, About, Main Projects, Closing, 수상·활동, Contact)
    case-study/           # 프로젝트 상세(Figma 형식) 블록
    ui/                   # 공통 표시 컴포넌트
  content/                # 프로필·프로젝트 카드(Notion 기준), 프로젝트 상세(case-studies.ts, Figma 기준)
  features/
    achievements/         # 수상·활동 조회 (Supabase) + seed 기준 데이터
    contact/              # 연락 메시지 검증·저장·API 처리
  lib/                    # Supabase 클라이언트, API 응답 형식
supabase/
  migrations/             # 스키마·RLS 마이그레이션
  seed.sql                # pnpm db:seed 로 생성 (직접 수정 금지)
tests/db/                 # 실제 PostgreSQL 대상 RLS·동시성 테스트
docs/TESTING.md           # 테스트·검증 기록
```

### 이미지 추가

서비스 화면 이미지는 `public/projects/`에 넣고 `src/content/case-studies.ts`의 `screenshotSrc`에 경로(예: `/projects/capteam.png`)를 지정하면 프로젝트 상세에 표시됩니다. 경로가 없으면 이미지 영역을 그리지 않습니다.

### 데이터를 어디에 두는가

- **코드(`src/content`)**: 프로젝트 설명·트러블슈팅처럼 레이아웃과 함께 바뀌는 서술형 콘텐츠
- **Supabase**: 계속 추가되는 목록형 데이터(수상·활동)와 방문자가 남기는 연락 메시지

## 로컬 실행

```bash
pnpm install
cp .env.example .env.local   # Supabase 값 입력 (없어도 실행 가능)
pnpm dev
```

Supabase 값이 없으면 수상·활동은 `seed-data.ts` 기준 데이터로 표시되고, 연락 폼은 `503`을 반환합니다.

## Supabase 설정

1. Supabase 프로젝트를 만든 뒤 SQL Editor에서 순서대로 실행합니다.
   1. `supabase/migrations/20261110000000_init_portfolio.sql`
   2. `supabase/seed.sql`
2. Project Settings → API에서 URL과 `anon` 키를 `.env.local`(배포 환경에서는 환경 변수)에 넣습니다.
3. 수상·활동을 바꿀 때는 `src/features/achievements/seed-data.ts`를 수정하고 `pnpm db:seed`로 `seed.sql`을 다시 만든 뒤 적용합니다.

`service_role` 키는 사용하지 않습니다. 앱은 `anon` 키로만 접근하고 권한은 RLS로 제한합니다.

## API

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `GET` | `/api/health` | 프로세스 상태와 Supabase 설정 여부 |
| `POST` | `/api/contact` | 연락 메시지 저장 |

`POST /api/contact` 요청 본문:

```json
{
  "idempotencyKey": "UUID (같은 메시지 재전송 시 동일 값)",
  "name": "1~50자",
  "email": "이메일 형식, 254자 이하",
  "message": "10~2000자",
  "website": "봇 방지용 함정 필드, 항상 빈 값"
}
```

| 상태 코드 | 의미 |
| --- | --- |
| `201` | 저장됨 |
| `200` | 같은 `idempotencyKey`로 이미 저장됨 (중복 저장하지 않음) |
| `400` | `VALIDATION_FAILED`(필드별 오류 포함) 또는 `INVALID_JSON` |
| `413` | 본문 16KB 초과 |
| `415` | `Content-Type`이 JSON이 아님 |
| `503` | Supabase 미설정 |
| `500` | 저장 실패 (내부 정보는 응답하지 않음) |

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | 개발 서버 / 프로덕션 빌드 / 프로덕션 실행 |
| `pnpm lint` / `pnpm typecheck` | ESLint / 타입 검사 |
| `pnpm test` | 단위 테스트 |
| `pnpm test:db` | RLS·동시성 테스트 (`TEST_DATABASE_URL`에 **테스트 전용** PostgreSQL 관리자 URL 필요, DB를 새로 만들고 지웁니다) |
| `pnpm db:seed` | `seed-data.ts`로 `supabase/seed.sql` 생성 |
