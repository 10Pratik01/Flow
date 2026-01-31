import { NextResponse } from "next/server";

export async function GET() {
  console.log("🔵 [TEST] Test endpoint hit!");
  return NextResponse.json({ message: "Test endpoint works!" });
}

export async function POST() {
  console.log("🔵 [TEST] Test POST endpoint hit!");
  return NextResponse.json({ message: "Test POST works!" });
}
