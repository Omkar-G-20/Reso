import { NextResponse } from "next/server";
import { seedPilots } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: seedPilots,
    total: seedPilots.length,
    timestamp: new Date().toISOString(),
  });
}
