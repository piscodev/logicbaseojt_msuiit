// statsStore.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs, { Dayjs } from "dayjs";
interface StatsState {
  net_total_trade: number;
  net_total_non_trade: number;
  grand_total_pos: number;
  fetching: boolean;
  selectedDate: Dayjs;
  setNetTotalTrade: (value: number) => void;
  setNetTotalNonTrade: (value: number) => void;
  setGrandTotalPos: (value: number) => void;
  setSelectedDate: (value: Dayjs) => void;
  setFetching: (value: boolean) => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      net_total_trade: 0,
      net_total_non_trade: 0,
      grand_total_pos: 0,
      fetching: false,
      selectedDate: dayjs(),
      setNetTotalTrade: (value: number) => set({ net_total_trade: value }),
      setNetTotalNonTrade: (value: number) => set({ net_total_non_trade: value }),
      setGrandTotalPos: (value: number) => set({ grand_total_pos: value }),
      setFetching: (value: boolean) => set({ fetching: value }),
      setSelectedDate: (value: Dayjs) => set({ selectedDate: value }),
    }),
    {
      name: "stats-store",
    //   skipHydration: true,
    }
  )
);
