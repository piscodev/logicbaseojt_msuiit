// store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  user_id?: number | null;
  user_admin_id?: number;
  user_cashier_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  contact_number: number;
  age: number;
  

  loginData?: {
    time_in: string;
    time_in_image: string;
    time_out: string;
    time_out_image: string;
  };
} | null;

interface UserState {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
