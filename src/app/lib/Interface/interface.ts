export interface other {
    payment: string;
    payment_amount: string
}

export interface TransactionFormValues {
    cashier_name: string;
    shift: string;
    _payment: string;
    _payment_amount: number;
    other_payments?: other[];
    _expense?: string;
    _expense_amount?: number;
    other_expenses?: other[];
  }

export interface TransactionValuesState {
    addTransaction: (values:TransactionFormValues) => void;
    logFinalValues: () => void;
    cashier_name: string;
    shift: string;
    _payment: string;
    _payment_amount: number;
    other_payments?: other[];
    _expense?: string;
    _expense_amount?: number;
    other_expenses?: other[];
    cash: number
    /* POS Sales Transactions */
    check?: number
    bpi_cc?: number
    bpi_dc?: number
    metro_cc?: number
    metro_dc?: number
    pay_maya?: number
    aub_cc?: number
    gcash?: number
    foodpanda?: number
    streetby?: number
    grabfood?: number
    gc_claimed_oth?: number
    gc_claimed_own?: number
    /* Non POS Sales Transactions */
    mm_head?: number
    mm_commisary?: number
    mm_?: number
    mm_rm?: number
    mm_dm?: number
    mm_km?: number
    food_charge?: number
    /* Transaction Total */
    sub_total_trade_POS?: number
    grand_total_trade_POS?: number
    z_reading_POS?: number
    short_over_POS?: number
}

export interface User {
    id: number
    name: string
    email: string
    hashed_password: string
}

export interface Cashier {
    id: number
    rate: number
    name: string
}

export interface CashiersTransaction
{
    id: number
    cashier_id: number
    shift_id: number
    particular_id: number
    transaction_id: number
    particular: string
    date: string
    am: number
    mid: number
    pm: number
}

export interface ParticularDefinition {
    id: number;
    name: string;
    type: 'Trade' | 'Non-Trade';
    fee_percent: number;
  }