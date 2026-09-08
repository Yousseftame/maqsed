"use client";

import { useEffect } from "react";

const LOCK_MS = 4000;
const locks = new Map<string, number>();

function canRecord(key: string) {
  const now = Date.now();
  const last = locks.get(key) || 0;
  if (now - last < LOCK_MS) return false;
  locks.set(key, now);
  return true;
}

export function useRecordPublicView(
  kind: "property" | "unit",
  id: string | undefined,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled || !id) return;
    const key = `${kind}:${id}`;
    if (!canRecord(key)) return;

    void fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, id }),
      keepalive: true,
    }).then((response) => {
      if (!response.ok) locks.delete(key);
    }).catch(() => {
      locks.delete(key);
    });
  }, [kind, id, enabled]);
}
