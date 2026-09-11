import { useEffect, useMemo, useState } from 'react';

import type { Update } from '@/constants/mock-data';

export function useGreeting() {
  const [greeting, setGreeting] = useState(() => getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return greeting;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';

  return 'Good evening';
}

export function useUpdatesState(initialUpdates: Update[] = []) {
  const [updates, setUpdates] = useState<Update[]>(initialUpdates);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  const unreadCount = useMemo(
    () => updates.filter((item) => item.unread).length,
    [updates],
  );

  const markRead = (id: number) => {
    setUpdates((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              unread: false,
            }
          : item,
      ),
    );

    setHighlightId(id);

    setTimeout(() => {
      setHighlightId(null);
    }, 2200);
  };

  const addUpdate = (
    message: string,
    kind: string,
    from = 'Tour Jamaica',
  ) => {
    setUpdates((current) => [
      {
        id: Date.now(),
        from,
        message,
        time: 'Just now',
        kind,
        unread: true,
      },
      ...current,
    ]);
  };

  return {
    updates,
    unreadCount,
    highlightId,
    markRead,
    addUpdate,
    setUpdates,
  };
}