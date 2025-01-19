"use client";
import React, { createContext, useContext, useReducer } from "react";

type CheckoutState = {
  loading: boolean;
};

type CheckoutAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };

const initialState: CheckoutState = {
  loading: false,
};

function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction,
): CheckoutState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
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
