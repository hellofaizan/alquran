// POST req to update profile on prisma

import { NextResponse } from "next/server";
import { env } from "process";

export async function GET(
  req: Request,
  params: { params: Promise<{ surahnum: number }> }
) {
  const BASEURL = env.BASEAPIURL;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const suraId = (await params.params).surahnum;

  let fetchApi = `${BASEURL}/surah/${suraId}`;
  const query: string[] = [];
  if (page) query.push(`page=${page}`);
  if (limit) query.push(`limit=${limit}`);
  if (query.length) fetchApi += `?${query.join('&')}`;

  const response = await fetch(fetchApi, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.APITOKEN}`,
    },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
