import { PAGE_GUTTER } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { getAchievements } from "@/features/achievements/queries";
import type { Activity, Award } from "@/features/achievements/types";

function AwardsTable({ awards }: { awards: Award[] }) {
  return (
    <table className="block w-full text-left text-sm md:table md:min-w-[560px]">
      <thead className="hidden md:table-header-group">
        <tr className="border-b border-zinc-50/20 text-xs text-zinc-500">
          <th scope="col" className="w-36 py-3 pr-4 font-normal">시기</th>
          <th scope="col" className="py-3 pr-4 font-normal">수상 내역</th>
          <th scope="col" className="w-36 py-3 font-normal">프로젝트 / 활동</th>
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {awards.map((award) => (
          <tr key={award.displayOrder} className="flex flex-col gap-1 border-b border-zinc-50/5 py-4 transition-colors duration-300 hover:bg-zinc-50/[0.03] md:table-row md:py-0">
            <td className="block text-xs text-zinc-500 md:table-cell md:py-4 md:pr-4">{award.periodLabel}</td>
            <th scope="row" className="block font-medium text-zinc-100 md:table-cell md:py-4 md:pr-4">{award.title}</th>
            <td className="block text-zinc-400 md:table-cell md:py-4">{award.project}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ActivitiesTable({ activities }: { activities: Activity[] }) {
  return (
    <table className="block w-full text-left text-sm md:table md:min-w-[560px]">
      <thead className="hidden md:table-header-group">
        <tr className="border-b border-zinc-50/20 text-xs text-zinc-500">
          <th scope="col" className="w-36 py-3 pr-4 font-normal">시기</th>
          <th scope="col" className="w-32 py-3 pr-4 font-normal">분류</th>
          <th scope="col" className="py-3 font-normal">활동</th>
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {activities.map((activity) => (
          <tr key={activity.displayOrder} className="flex flex-col gap-1 border-b border-zinc-50/5 py-4 transition-colors duration-300 hover:bg-zinc-50/[0.03] md:table-row md:py-0">
            <td className="block text-xs text-zinc-500 md:table-cell md:py-4 md:pr-4">{activity.periodLabel}</td>
            <td className="block text-xs text-zinc-400 md:table-cell md:py-4 md:pr-4 md:text-sm">{activity.category}</td>
            <th scope="row" className="block font-medium text-zinc-100 md:table-cell md:py-4">{activity.title}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EmptyRow({ message }: { message: string }) {
  return <p className="border-y border-zinc-50/10 py-8 text-center text-sm text-zinc-500">{message}</p>;
}

/** 수상·활동(P07). 휴대폰에서는 표를 행마다 세로로 쌓아 가로 스크롤 없이 읽히게 한다. Supabase에서 조회하며, 조회 실패와 빈 목록을 각각 다른 문구로 안내한다. */
export async function AchievementsSection() {
  const result = await getAchievements();

  return (
    <section id="awards">
      <div className={`${PAGE_GUTTER} py-20 md:py-21`}>
        <Reveal className="mb-16">
          <h2 className="mb-4 font-display text-3xl leading-relaxed font-semibold text-zinc-50">Awards &amp; Activities</h2>
          <p className="max-w-[600px] leading-relaxed text-zinc-400">교내 수상·활동과 해외 견학·교류를 한곳에 정리했습니다</p>
        </Reveal>

        {result.status === "error" ? (
          <Reveal>
            <p role="status" className="rounded-lg border border-zinc-50/10 px-6 py-10 text-center text-sm text-zinc-400">
              수상 · 활동 목록을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.
            </p>
          </Reveal>
        ) : (
          <div className="space-y-20">
            <div>
              <Reveal>
                <h3 className="mb-6 text-xl font-semibold text-zinc-100">수상</h3>
              </Reveal>
              <Reveal delay={80} className="overflow-x-auto">
                {result.data.awards.length > 0 ? (
                  <AwardsTable awards={result.data.awards} />
                ) : (
                  <EmptyRow message="등록된 수상 내역이 없습니다." />
                )}
              </Reveal>
            </div>
            <div>
              <Reveal>
                <h3 className="mb-6 text-xl font-semibold text-zinc-100">교내·대외 활동 및 해외 경험</h3>
              </Reveal>
              <Reveal delay={80} className="overflow-x-auto">
                {result.data.activities.length > 0 ? (
                  <ActivitiesTable activities={result.data.activities} />
                ) : (
                  <EmptyRow message="등록된 활동이 없습니다." />
                )}
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** 목록을 불러오는 동안 보여줄 자리 표시. 실제 표와 높이를 비슷하게 맞춰 화면이 튀지 않게 한다. */
export function AchievementsSectionSkeleton() {
  return (
    <section id="awards" aria-busy="true">
      <div className={`${PAGE_GUTTER} py-20 md:py-21`}>
        <div className="h-28 w-2/3 animate-pulse rounded bg-raised" />
        <div className="mt-16 space-y-3">
          {Array.from({ length: 6 }, (_, rowIndex) => (
            <div key={rowIndex} className="h-12 animate-pulse rounded bg-raised" />
          ))}
        </div>
      </div>
    </section>
  );
}
