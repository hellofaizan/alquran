// POST req to update profile on prisma

import { NextResponse } from "next/server";
import { env } from "process";
import {
  surahDataCache,
  getSurahDataCacheKey,
  logCacheStats,
} from "@/app/utils/cache";

export async function GET(
  req: Request,
  params: { params: Promise<{ surahnum: number }> }
) {
  const BASEURL = env.BASEAPIURL;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const suraId = (await params.params).surahnum;

  // Check cache first
  const cacheKey = getSurahDataCacheKey(
    suraId,
    parseInt(page),
    parseInt(limit)
  );
  const cachedData = surahDataCache.get(cacheKey);

  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  let fetchApi = `${BASEURL}/surah/${suraId}`;
  const query: string[] = [];
  if (page) query.push(`page=${page}`);
  if (limit) query.push(`limit=${limit}`);
  if (query.length) fetchApi += `?${query.join("&")}`;

  const response = await fetch(fetchApi, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.APITOKEN}`,
    },
  });
  const data = await response.json();

  // Store in cache
  surahDataCache.set(cacheKey, data);

  return NextResponse.json(data);
}
