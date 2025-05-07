// POST req to update profile on prisma

import { NextResponse } from "next/server";
import { env } from "process";
import { surahListCache, getSurahListCacheKey, logCacheStats } from "@/app/utils/cache";

export async function GET(
  req: Request,
) {
  const BASEURL = env.BASEAPIURL as string;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const sort = searchParams.get('sort') || 'default';
  
  // Check cache first
  const cacheKey = getSurahListCacheKey(parseInt(page), sort);
  const cachedData = surahListCache.get(cacheKey);
  
  if (cachedData) {
    return NextResponse.json(cachedData);
  }
  
  // If not in cache, fetch from API
  const response = await fetch(`${BASEURL}/surah?page=${page}&limit=114`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.APITOKEN}`
    }
  });
  const data = await response.json();
  
  // Store in cache
  surahListCache.set(cacheKey, data);
  
  return NextResponse.json(data);
}