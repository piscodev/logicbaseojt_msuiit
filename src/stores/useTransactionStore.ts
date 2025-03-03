import { create } from "zustand";
interface other {
    payment: string;
    payment_amount: string
}
interface TransactionFormValues {
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
    finalValues: () => TransactionFormValues;
    clearItems: () => void;
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
const useTransactionStore = create<TransactionValuesState>((set, get)=>({
    cashier_name: '',
    shift: '',
    _payment: '',
    _payment_amount: 0,
    other_payments: [{ payment: '', payment_amount: '' }] as other[],
    _expense: '',
    _expense_amount: 0,
    other_expenses: [{ payment: '', payment_amount: '' }] as other[],
    /* POS Sales Transactions */
    cash: 0,
    check: 0,
    bpi_cc: 0,
    bpi_dc: 0,
    metro_cc: 0,
    metro_dc: 0,
    pay_maya: 0,
    aub_cc: 0,
    gcash: 0,
    foodpanda: 0,
    streetby: 0,
    grabfood: 0,
    gc_claimed_oth: 0,
    gc_claimed_own: 0,
    /* Non POS Sales Transactions */
    mm_head: 0,
    mm_commisary: 0,
    mm_: 0,
    mm_rm: 0,
    mm_dm: 0,
    mm_km: 0,
    food_charge: 0,
    /* Transaction Total */
    sub_total_trade_POS: 0,
    grand_total_trade_POS: 0,
    z_reading_POS: 0,
    short_over_POS: 0,

    // setAmount: () 
    addTransaction: (values) => set((state) => {

      const payment_method = values._payment;
      const expenses_method = values._expense;
      const amount = values._payment_amount;
      const expense_amount = values._expense_amount;

      if(payment_method === 'CASH')state.cash = amount;
      else if(payment_method === 'CHECK') state.check = amount;
      else if(payment_method === 'BPI CREDIT CARD') state.bpi_cc = amount;
      else if(payment_method === 'BPI DEBIT CARD') state.bpi_dc = amount;
      else if(payment_method === 'METRO CREDIT CARD') state.metro_cc = amount;
      else if(payment_method === 'METRO DEBIT CARD') state.metro_dc = amount;
      else if(payment_method === 'PAY MAYA') state.pay_maya = amount;
      else if(payment_method === 'AUB CREDIT CARD') state.aub_cc = amount;
      else if(payment_method === 'GCASH') state.gcash = amount;
      else if(payment_method === 'FOOD PANDA') state.foodpanda = amount;
      else if(payment_method === 'STREETBY') state.streetby = amount;
      else if(payment_method === 'GRAB FOOD') state.grabfood = amount;
      
      if (expenses_method === 'MM-HEAD OFFICE') state.mm_head = expense_amount
      else if (expenses_method === 'MM-COMMISARY') state.mm_commisary = expense_amount
      else if (expenses_method === 'MM-___') state.mm_ = expense_amount
      else if (expenses_method === 'MM-RM') state.mm_rm = expense_amount
      else if (expenses_method === 'MM-DM') state.mm_dm = expense_amount
      else if (expenses_method === 'MM-KM') state.mm_km = expense_amount
      else if (expenses_method === 'FOOD CHARGES') state.food_charge = expense_amount

      values.other_payments?.reduce((acc: Record<string, number>, payment) => {
          const amount : number = parseFloat(payment.payment_amount)
          if (payment.payment === 'CASH') state.cash =  amount;
          else if (payment.payment === 'CHECK') state.check = amount;
          else if (payment.payment === 'BPI CREDIT CARD') state.bpi_cc = amount;
          else if (payment.payment === 'BPI DEBIT CARD') state.bpi_dc = amount;
          else if (payment.payment === 'METRO CREDIT CARD') state.metro_cc = amount;
          else if (payment.payment === 'METRO DEBIT CARD') state.metro_dc = amount;
          else if (payment.payment === 'PAY MAYA') state.pay_maya = amount;
          else if (payment.payment === 'AUB CREDIT CARD') state.aub_cc = amount;
          else if (payment.payment === 'GCASH') state.gcash = amount;
          else if (payment.payment === 'FOOD PANDA') state.foodpanda = amount;
          else if (payment.payment === 'STREETBY') state.streetby = amount;
          else if (payment.payment === 'GRAB FOOD') state.grabfood = amount;
          return acc;
        }, {});
        
          values.other_expenses?.reduce((acc: Record<string, number>, payment) => {
          const expenses : number = parseFloat(payment.payment_amount)
          if (payment.payment === 'MM-HEAD OFFICE') state.mm_head = expenses;
          else if (payment.payment === 'MM-COMMISARY') state.mm_commisary = expenses;
          else if (payment.payment === 'MM-___') state.mm_ = expenses;
          else if (payment.payment === 'MM-RM') state.mm_rm = expenses;
          else if (payment.payment === 'MM-DM') state.mm_dm = expenses;
          else if (payment.payment === 'MM-KM') state.mm_km = expenses;
          else if (payment.payment === 'FOOD CHARGES') state.food_charge = expenses;
          return acc;
        }, {});
      
        return {
          ...state,
          cashier_name: values.cashier_name,
          shift: values.shift,
        };
      }),
      finalValues: (): TransactionValuesState => {
        set((state) => {
          console.log('Final Transaction Values:', {
            cashier_name: state.cashier_name,
            shift: state.shift,
            cash: state.cash,
            check: state.check,
            bpi_cc: state.bpi_cc,
            bpi_dc: state.bpi_dc,
            metro_cc: state.metro_cc,
            metro_dc: state.metro_dc,
            pay_maya: state.pay_maya,
            aub_cc: state.aub_cc,
            gcash: state.gcash,
            foodpanda: state.foodpanda,
            streetby: state.streetby,
            grabfood: state.grabfood,
            mm_head: state.mm_head,
            mm_commisary: state.mm_commisary,
            mm_: state.mm_,
            mm_rm: state.mm_rm,
            mm_dm: state.mm_dm,
            mm_km: state.mm_km,
            food_charge: state.food_charge,
            sub_total_trade_POS: state.sub_total_trade_POS,
            grand_total_trade_POS: state.grand_total_trade_POS,
            z_reading_POS: state.z_reading_POS,
            short_over_POS: state.short_over_POS,
          });
          
          return state;
        });
        const state = get();
        const data: TransactionValuesState = {
          cashier_name: state.cashier_name,
          shift: state.shift,
          cash: state.cash,
          check: state.check,
          bpi_cc: state.bpi_cc,
          bpi_dc: state.bpi_dc,
          metro_cc: state.metro_cc,
          metro_dc: state.metro_dc,
          pay_maya: state.pay_maya,
          aub_cc: state.aub_cc,
          gcash: state.gcash,
          foodpanda: state.foodpanda,
          streetby: state.streetby,
          grabfood: state.grabfood,
          mm_head: state.mm_head,
          mm_commisary: state.mm_commisary,
          mm_: state.mm_,
          mm_rm: state.mm_rm,
          mm_dm: state.mm_dm,
          mm_km: state.mm_km,
          food_charge: state.food_charge,
          sub_total_trade_POS: state.sub_total_trade_POS,
          grand_total_trade_POS: state.grand_total_trade_POS,
          z_reading_POS: state.z_reading_POS,
          short_over_POS: state.short_over_POS,
        } as TransactionValuesState;
        return data;
      },
      clearItems: () =>
        set(() => ({
          cashier_name: '',
          shift: '',
          _payment: '',
          _payment_amount: 0,
          other_payments: [{ payment: '', payment_amount: '' }] as other[],
          _expense: '',
          _expense_amount: 0,
          other_expenses: [{ payment: '', payment_amount: '' }] as other[],
          /* POS Sales Transactions */
          cash: 0,
          check: 0,
          bpi_cc: 0,
          bpi_dc: 0,
          metro_cc: 0,
          metro_dc: 0,
          pay_maya: 0,
          aub_cc: 0,
          gcash: 0,
          foodpanda: 0,
          streetby: 0,
          grabfood: 0,
          gc_claimed_oth: 0,
          gc_claimed_own: 0,
          /* Non POS Sales Transactions */
          mm_head: 0,
          mm_commisary: 0,
          mm_: 0,
          mm_rm: 0,
          mm_dm: 0,
          mm_km: 0,
          food_charge: 0,
          /* Transaction Total */
          sub_total_trade_POS: 0,
          grand_total_trade_POS: 0,
          z_reading_POS: 0,
          short_over_POS: 0,
        })),
      
}))    
export default useTransactionStore;