import { useState, useEffect, useRef, useCallback } from 'react';
import { QuoteItem, HealthFactItem } from '@/types';

interface UseFiveMinuteBoostOptions {
  quotes: QuoteItem[];
  healthFacts: HealthFactItem[];
  intervalMs?: number; // default 300,000 ms (5 mins)
}

export function useFiveMinuteBoost({
  quotes,
  healthFacts,
  intervalMs = 300000,
}: UseFiveMinuteBoostOptions) {
  const [currentQuote, setCurrentQuote] = useState<QuoteItem | null>(null);
  const [currentFact, setCurrentFact] = useState<HealthFactItem | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(Math.floor(intervalMs / 1000));

  // Ref to hold the target timestamp (epoch ms) to prevent drift and survive re-renders
  const targetTimeRef = useRef<number>(Date.now() + intervalMs);
  const timerIdRef = useRef<number | null>(null);

  // Pick random item avoiding repeat
  const getRandomDifferent = useCallback(<T extends { id: string }>(
    list: T[],
    current: T | null
  ): T | null => {
    if (!list || list.length === 0) return null;
    if (list.length === 1) return list[0];
    const pool = current ? list.filter((item) => item.id !== current.id) : list;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }, []);

  const rotateItems = useCallback(() => {
    setCurrentQuote((prevQuote) => getRandomDifferent(quotes, prevQuote));
    setCurrentFact((prevFact) => getRandomDifferent(healthFacts, prevFact));
    targetTimeRef.current = Date.now() + intervalMs;
  }, [quotes, healthFacts, intervalMs, getRandomDifferent]);

  // Initial load: pick immediate items
  useEffect(() => {
    if (quotes.length > 0 && !currentQuote) {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [quotes, currentQuote]);

  useEffect(() => {
    if (healthFacts.length > 0 && !currentFact) {
      setCurrentFact(healthFacts[Math.floor(Math.random() * healthFacts.length)]);
    }
  }, [healthFacts, currentFact]);

  // Managed interval ticker that derives remaining time from targetTimeRef
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetTimeRef.current - now;

      if (diff <= 0) {
        rotateItems();
        setSecondsRemaining(Math.floor(intervalMs / 1000));
      } else {
        setSecondsRemaining(Math.ceil(diff / 1000));
      }
    };

    // Immediate check
    updateCountdown();

    const interval = window.setInterval(updateCountdown, 1000);
    timerIdRef.current = interval;

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [rotateItems, intervalMs]);

  const manualRefresh = useCallback(() => {
    rotateItems();
  }, [rotateItems]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    currentQuote,
    currentFact,
    secondsRemaining,
    formattedTime,
    manualRefresh,
  };
}
