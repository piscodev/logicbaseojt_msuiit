/*import { create } from 'zustand'

type CounterStore =
{
    count: number
    incrementAsync: () => void
    decrementAsync: () => void
}

export const useCounterStore = create<CounterStore>((set) => (
{
    count: 0,
    incrementAsync: () => {
        set((state) => ({count: state.count + 1}))
    },
    decrementAsync: () => {
        set((state) => ({count: state.count - 1}))
    }
}))*/


import { create } from "zustand";

interface PosState {
  posData: {
    cashierName: string;
    shift: string;
  };
  setPosData: (data: Partial<PosState["posData"]>) => void;
}

export const usePosStore = create<PosState>((set) => ({
  posData: {
    cashierName: "",
    shift: "",
  },
  setPosData: (data) =>
    set((state) => ({
      posData: { ...state.posData, ...data },
    })),
}));
