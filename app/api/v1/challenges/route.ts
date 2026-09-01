import { NextResponse } from "next/server";
import { seedChallenges } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: seedChallenges,
    total: seedChallenges.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newChallenge = {
    id: `ch_${Date.now()}`,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applicationsCount: 0,
    publishedAt: null,
  };
  return NextResponse.json({ status: "success", data: newChallenge }, { status: 201 });
}
