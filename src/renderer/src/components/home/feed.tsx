import { getCurrentPort } from "@renderer/utils/getPort";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "../../translations/translationContext";
import ScriptCard from "./feed/card";
import type { Script } from "./feed/types";
import Loading from "./loading-skeleton";

interface ScriptListProps {
  endpoint: string;
  type?: string;
  className?: string;
}

export default function List({
  endpoint,
  type,
  className = "",
}: ScriptListProps) {
  const { t } = useTranslation();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const limit = 10;
  const loadingRef = useRef(false);

  const fetchScripts = useCallback(
    async (pageNum: number) => {
      if (!hasMore || loadingRef.current) return;
      
      loadingRef.current = true;
      const port = await getCurrentPort();
      if (!port) return;

      try {
        const url = new URL(`http://localhost:${port}${endpoint}`);
        url.searchParams.append("page", pageNum.toString());
        url.searchParams.append("limit", limit.toString());

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

		if (data.status === 404) {
			setScripts([]);
			return;
		}
		
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format from API");
        }

        setScripts(prev => {
          const existingIds = new Set(prev.map(s => s.id));
          const newItems = data.filter(script => !existingIds.has(script.id));
          return [...prev, ...newItems];
        });

        setPage(pageNum + 1);
        setHasMore(data.length >= limit);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch scripts");
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [endpoint, hasMore, limit, t]
  );

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          fetchScripts(page);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchScripts, page]
  );

  useEffect(() => {
	// clear
	setScripts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setLoading(true);
    loadingRef.current = false;
  }, [endpoint]);

  useEffect(() => {
    if (loading) {
      fetchScripts(1);
    }
  }, [loading, fetchScripts]);

  if (loading && scripts.length === 0) {
    return <Loading />;
  }

  return (
    <div className={`w-full ${className} last:mb-4`}>
      <div className="grid grid-cols-2 gap-4">
        {scripts.map((script, index) => (
          <ScriptCard
            key={script.id}
            script={script}
            innerRef={index === scripts.length - 1 ? lastElementRef : null}
          />
        ))}
      </div>

      {loading && scripts.length > 0 && (
        <div className="text-center text-neutral-500 text-sm mt-4">Loading more...</div>
      )}

      {!loading && scripts.length === 0 && type !== "featured" && (
        <div className="text-center text-neutral-500 text-sm mt-4">
          {t("feed.noScripts")}
        </div>
      )}

      {error && (
        <div className="text-center text-red-400 text-sm mt-4">
          {error}
        </div>
      )}
    </div>
  );
}