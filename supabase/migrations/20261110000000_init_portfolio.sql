-- 포트폴리오 초기 스키마: 수상/활동 목록(공개 조회)과 연락 메시지(공개 작성 전용).

create table public.awards (
  id bigint generated always as identity primary key,
  display_order integer not null unique check (display_order > 0),
  period_label text not null check (char_length(period_label) between 1 and 30),
  title text not null check (char_length(title) between 1 and 120),
  project text not null check (char_length(project) between 1 and 60),
  created_at timestamptz not null default now()
);

create table public.activities (
  id bigint generated always as identity primary key,
  display_order integer not null unique check (display_order > 0),
  period_label text not null check (char_length(period_label) between 1 and 30),
  category text not null check (char_length(category) between 1 and 30),
  title text not null check (char_length(title) between 1 and 120),
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  -- 클라이언트가 폼 렌더링마다 발급하는 키. 더블 클릭·재시도로 같은 요청이 여러 번 와도 한 건만 저장한다.
  idempotency_key uuid not null unique,
  name text not null check (char_length(btrim(name)) between 1 and 50),
  email text not null check (
    char_length(email) <= 254
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ),
  message text not null check (char_length(btrim(message)) between 10 and 2000),
  created_at timestamptz not null default now()
);

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.awards enable row level security;
alter table public.activities enable row level security;
alter table public.contact_messages enable row level security;

-- 수상/활동은 누구나 읽을 수 있고, 쓰기 정책은 두지 않아 service_role(대시보드)에서만 관리한다.
create policy "awards are publicly readable"
  on public.awards for select
  to anon, authenticated
  using (true);

create policy "activities are publicly readable"
  on public.activities for select
  to anon, authenticated
  using (true);

-- 연락 메시지는 작성만 허용한다. 조회 정책이 없으므로 다른 방문자의 메시지는 읽을 수 없다.
create policy "anyone can submit a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- 테이블 권한도 정책과 같은 범위로 좁혀 RLS가 꺼지는 실수에 대비한다.
revoke all on public.awards, public.activities, public.contact_messages from anon, authenticated;
grant select on public.awards, public.activities to anon, authenticated;
grant insert (idempotency_key, name, email, message) on public.contact_messages to anon, authenticated;
