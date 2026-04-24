import { NextResponse } from "next/server";
import { AWARD_CATEGORIES } from "@/lib/data";
import { getAllVotes, storageMode } from "@/lib/store";

function authorized(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const urlToken = new URL(request.url).searchParams.get("token");
  return auth === token || urlToken === token;
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false, message: "Acesso negado." }, { status: 401 });
  const votes = await getAllVotes();
  const totals = AWARD_CATEGORIES.map((category) => {
    const counts: Record<string, number> = {};
    for (const nominee of category.nominees) counts[nominee] = 0;
    for (const vote of votes) {
      const selected = vote.votes[category.id];
      if (selected) counts[selected] = (counts[selected] || 0) + 1;
    }
    return { category: category.title, area: category.area, total: Object.values(counts).reduce((a, b) => a + b, 0), counts };
  });
  return NextResponse.json({ ok: true, storageMode: storageMode(), totalVoters: votes.length, totals, raw: votes });
}
