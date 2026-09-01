import { NextResponse } from "next/server";
import { seedStartups } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: seedStartups,
    total: seedStartups.length,
    timestamp: new Date().toISOString(),
  });
}
