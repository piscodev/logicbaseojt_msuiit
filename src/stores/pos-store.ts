import { create } from "zustand";

interface POSState
{
    shift: string
    cname: string
    cash: number
    check: number
    bpi_cCard: number
    bpi_dCard: number
    metro_cCard: number
    metro_dCard: number
    paymaya: number
    aub_cCard: number
    gcash: number
    foodpanda: number
    streetby: number
    grabfood: number
    gc_claimedOth: boolean
    gc_claimedOwn: boolean
    subTotalTradePOS: number
    mm_head: number
    mm_commi: number
    mm_: number
    mm_rm: number
    mm_dm: number
    mm_km: number
    food_charge: number
    grandTotalPOS: number
    updateField: (field: string, value: number) => Promise<void>
    calculateTotals: (field: string, value: number) => Promise<void>
}

export const usePOSStore = create<POSState>((set) => (
{
    shift: "AM",
    cname: "",
    cash: 0,
    check: 0,
    bpi_cCard: 0,
    bpi_dCard: 0,
    metro_cCard: 0,
    metro_dCard: 0,
    paymaya: 0,
    aub_cCard: 0,
    gcash: 0,
    foodpanda: 0,
    streetby: 0,
    grabfood: 0,
    gc_claimedOth: false,
    gc_claimedOwn: false,

    subTotalTradePOS: 0,

    mm_head: 0,
    mm_commi: 0,
    mm_: 0,
    mm_rm: 0,
    mm_dm: 0,
    mm_km: 0,
    food_charge: 0,

    grandTotalPOS: 0,

    updateField: async (field, value) =>
    set((state) =>
    {
        const newState = { ...state, [field]: value }

        // calc total trade POS
        newState.subTotalTradePOS =
            newState.cash +
            newState.check +
            newState.bpi_cCard +
            newState.bpi_dCard +
            newState.metro_cCard +
            newState.metro_dCard +
            newState.paymaya +
            newState.aub_cCard +
            newState.gcash +
            newState.foodpanda +
            newState.streetby +
            newState.grabfood

        // grand total
        newState.grandTotalPOS =
            newState.mm_head +
            newState.mm_commi +
            newState.mm_rm +
            newState.mm_dm +
            newState.mm_km +
            newState.food_charge +
            newState.subTotalTradePOS

        return newState
    }),

    calculateTotals: async (field, value) =>
    set((state) => {
        const newState = { ...state, [field]: value }
        return newState
    }),

}))