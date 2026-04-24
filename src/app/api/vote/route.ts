import { NextResponse } from "next/server";
import { AWARD_CATEGORIES, EMPLOYEES } from "@/lib/data";
import { getSession, hashCpf } from "@/lib/security";
import { hasVoted, saveVote } from "@/lib/store";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, message: "Sessão expirada. Faça login novamente." }, { status: 401 });
  if (await hasVoted(session.cpfHash)) return NextResponse.json({ ok: false, alreadyVoted: true, message: "Os votos deste CPF já foram registrados." }, { status: 409 });
  const employee = EMPLOYEES.find((person) => hashCpf(person.cpf) === session.cpfHash);
  if (!employee) return NextResponse.json({ ok: false, message: "Colaborador não localizado." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const votes = body.votes as Record<string, string | null>;
  if (!votes || typeof votes !== "object") return NextResponse.json({ ok: false, message: "Votos inválidos." }, { status: 400 });
  for (const category of AWARD_CATEGORIES) {
    const value = votes[category.id];
    if (category.nominees.length === 0) continue;
    if (!value || !category.nominees.includes(value)) {
      return NextResponse.json({ ok: false, message: `Selecione uma opção para ${category.title}.` }, { status: 400 });
    }
  }
  const saved = await saveVote({
    cpfHash: session.cpfHash,
    voterName: employee.name,
    voterEmail: employee.email,
    votes,
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent")
  });
  if (!saved) return NextResponse.json({ ok: false, alreadyVoted: true, message: "Os votos deste CPF já foram registrados." }, { status: 409 });
  return NextResponse.json({ ok: true });
}
