import { NextResponse } from "next/server";
import { getSearchData } from "@/lib/actions";

export async function GET() {
  const categories = await getSearchData();

  return NextResponse.json(categories);
}