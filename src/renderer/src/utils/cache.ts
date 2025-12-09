import type { Script } from "@/components/home/feed/types";

const CACHE_PREFIX = "dione_cache_";
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7d

interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

export class FeedCache {
	private static getKey(endpoint: string): string {
		return `${CACHE_PREFIX}${endpoint.replace(/\//g, "_")}`;
	}

	static set(endpoint: string, data: Script[]): void {
		try {
			const entry: CacheEntry<Script[]> = {
				data,
				timestamp: Date.now(),
			};
			localStorage.setItem(this.getKey(endpoint), JSON.stringify(entry));
		} catch (error) {
			console.error("Failed to cache data:", error);
		}
	}

	static get(endpoint: string): Script[] | null {
		try {
			const cached = localStorage.getItem(this.getKey(endpoint));
			if (!cached) return null;

			const entry: CacheEntry<Script[]> = JSON.parse(cached);

			if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
				this.clear(endpoint);
				return null;
			}

			return entry.data;
		} catch (error) {
			console.error("Failed to read cache:", error);
			return null;
		}
	}

	static clear(endpoint: string): void {
		try {
			localStorage.removeItem(this.getKey(endpoint));
		} catch (error) {
			console.error("Failed to clear cache:", error);
		}
	}

	static clearAll(): void {
		try {
			const keys = Object.keys(localStorage);
			for (const key of keys) {
				if (key.startsWith(CACHE_PREFIX)) {
					localStorage.removeItem(key);
				}
			}
		} catch (error) {
			console.error("Failed to clear all cache:", error);
		}
	}

	static getCacheAge(endpoint: string): number | null {
		try {
			const cached = localStorage.getItem(this.getKey(endpoint));
			if (!cached) return null;

			const entry: CacheEntry<Script[]> = JSON.parse(cached);
			return Date.now() - entry.timestamp;
		} catch (error) {
			console.error("Failed to get cache age:", error);
			return null;
		}
	}
}
