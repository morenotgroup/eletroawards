import { NextResponse } from "next/server";
import { EMPLOYEES } from "@/lib/data";
import { createSession, hashCpf, onlyDigits, setSessionCookie } from "@/lib/security";
import { hasVoted, storageMode } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const cpf = onlyDigits(String(body.cpf || ""));
  const employee = EMPLOYEES.find((person) => onlyDigits(person.cpf) === cpf);
  if (!employee) {
    return NextResponse.json({ ok: false, message: "CPF não localizado na base de votação." }, { status: 401 });
  }
  const cpfHash = hashCpf(cpf);
  await setSessionCookie(createSession(cpf));
  const voted = await hasVoted(cpfHash);
  return NextResponse.json({ ok: true, name: employee.name, voted, storageMode: storageMode() });
}
