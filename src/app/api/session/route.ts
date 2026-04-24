import { NextResponse } from "next/server";
import { EMPLOYEES } from "@/lib/data";
import { getSession, hashCpf } from "@/lib/security";
import { hasVoted, storageMode } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ authenticated: false, storageMode: storageMode() });
  const employee = EMPLOYEES.find((person) => hashCpf(person.cpf) === session.cpfHash);
  if (!employee) return NextResponse.json({ authenticated: false, storageMode: storageMode() });
  return NextResponse.json({ authenticated: true, name: employee.name, email: employee.email, voted: await hasVoted(session.cpfHash), storageMode: storageMode() });
}
