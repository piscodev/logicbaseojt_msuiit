import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Cashier = { value: string }[];

interface CashierState {
  cashiers: Cashier | null;
  setCashiers: (cashiers: Cashier) => void;
  clearCashiers: () => void;
}

export const useCashierStore = create<CashierState>()(
  persist(
    (set) => ({
      cashiers: null,
      setCashiers: (cashiers) => set({ cashiers }),
      clearCashiers: () => set({ cashiers: null }),
    }),
    {
      name: "cashier-storage", // this key is used in localStorage
    }
  )
);
