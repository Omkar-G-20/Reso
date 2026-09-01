import { NextResponse } from "next/server";
import { seedProcurements } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: seedProcurements,
    total: seedProcurements.length,
    timestamp: new Date().toISOString(),
  });
}
