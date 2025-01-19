"use client";
import React, { createContext, useContext, useReducer } from "react";
import Stripe from "stripe";

type CheckoutState = {
  loading: boolean;
  errorMessage: string | undefined;
  paymentIntent:
    | {
        status: Stripe.PaymentIntent.Status | null;
        clientSecret: string | null;
        invoice: string | null;
        id: string;
      }
    | undefined;
};

type CheckoutAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PAYMENT_INTENT"; payload: CheckoutState["paymentIntent"] }
  | { type: "SET_ERROR_MESSAGE"; payload?: string }
  | { type: "RESET" };

const initialState: CheckoutState = {
  loading: false,
  errorMessage: "",
  paymentIntent: {
    status: null,
    clientSecret: null,
    invoice: null,
    id: "",
  },
};

function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction,
): CheckoutState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR_MESSAGE":
      return { ...state, errorMessage: action.payload };
    case "SET_PAYMENT_INTENT":
      return { ...state, paymentIntent: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const CheckoutContext = createContext<
  | {
      state: CheckoutState;
      dispatch: React.Dispatch<CheckoutAction>;
    }
  | undefined
>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  return (
    <CheckoutContext.Provider value={{ state, dispatch }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return context;
}
