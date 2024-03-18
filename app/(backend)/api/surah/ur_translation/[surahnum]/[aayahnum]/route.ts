// POST req to update profile on prisma

import { NextResponse } from "next/server";
import { env } from "process";

export async function GET(
  req: Request,
  params: { params: { surahnum: number, aayahnum: number } }
) {
  const BASEURL = env.URDUBASEAPIURL || "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/urd-muhammadjunagar/";
  const suraId = params.params.surahnum
  const aayahId = params.params.aayahnum
  const fetchApi = BASEURL+suraId+"/"+aayahId+".json";

  const response = await fetch(`${fetchApi}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    });
    const data = await response.json();
    return NextResponse.json(data);
}