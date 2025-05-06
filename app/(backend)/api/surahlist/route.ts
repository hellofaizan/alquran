// POST req to update profile on prisma

import { NextResponse } from "next/server";
import { env } from "process";

export async function GET(
  req: Request,
) {
  const BASEURL = env.BASEAPIURL as string;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const response = await fetch(`${BASEURL}/surah?page=${page}&limit=114`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.APITOKEN}`
    }
  });
  const data = await response.json();
  return NextResponse.json(data);
}