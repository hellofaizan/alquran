// POST req to update profile on prisma

import { NextResponse } from "next/server";
import { env } from "process";

export async function GET(
  req: Request,
) {
  const BASEURL = env.BASEAPIURL;
  const response = await fetch(`https://api.alquran.cloud/v1/surah`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    });
    const data = await response.json();
    return NextResponse.json(data);
}