import { NextResponse } from "next/server";
import { seedEvaluations } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: seedEvaluations,
    total: seedEvaluations.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const total = (body.technicalFeasibility ?? 0) + (body.cybersecurityDataIsolation ?? 0) + (body.costRealism ?? 0);
  const evaluation = {
    id: `ev_${Date.now()}`,
    ...body,
    totalScore: total,
    qualifiedForSandbox: total >= 80,
    evaluatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: "completed",
  };
  return NextResponse.json({ status: "success", data: evaluation }, { status: 201 });
}
