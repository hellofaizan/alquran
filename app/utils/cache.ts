import { LRUCache } from 'lru-cache';

// Cache for surah list data
export const surahListCache = new LRUCache<string, any>({
  max: 500, // Maximum number of items to store
  ttl: 1000 * 60 * 60, // Time to live: 1 hour
  updateAgeOnGet: true, // Update the age of an item when it is retrieved
  updateAgeOnHas: true, // Update the age of an item when it is checked
  allowStale: false, // Don't return stale items
});

// Cache for individual surah data
export const surahDataCache = new LRUCache<string, any>({
  max: 114, // Maximum number of surahs
  ttl: 1000 * 60 * 60, // Time to live: 1 hour
  updateAgeOnGet: true,
  updateAgeOnHas: true,
  allowStale: false,
});

// Helper function to get cache key for surah list
export const getSurahListCacheKey = (page: number, sort?: string) => {
  return `surahList_${page}_${sort || 'default'}`;
};

// Helper function to get cache key for individual surah
export const getSurahDataCacheKey = (surahNum: number, page?: number, limit?: number) => {
  return `surah_${surahNum}_${page || 1}_${limit || 10}`;
};

// Debug function to log cache stats
export const logCacheStats = () => {
  console.log('Surah List Cache Stats:', {
    size: surahListCache.size,
    max: surahListCache.max,
    ttl: surahListCache.ttl,
  });
  console.log('Surah Data Cache Stats:', {
    size: surahDataCache.size,
    max: surahDataCache.max,
    ttl: surahDataCache.ttl,
  });
}; 