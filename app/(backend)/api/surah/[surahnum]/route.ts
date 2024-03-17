// POST req to update profile on prisma

import { NextResponse } from "next/server";
import { env } from "process";

export async function GET(
  req: Request,
  params: { params: { surahnum: number } }
) {
  const BASEURL = env.BASEAPIURL;
  const suraId = params.params.surahnum
  const fetchApi = BASEURL+"surah/"+suraId

  const response = await fetch(`${fetchApi}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    });
    const data = await response.json();
    return NextResponse.json(data);
}