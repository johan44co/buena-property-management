"use client";
import { createPaymentIntent, retrievePaymentIntent } from "@/util/checkout";
import StripeJS from "@stripe/stripe-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { createContext, Dispatch, useContext, useReducer } from "react";
import Stripe from "stripe";

type ThunkAction<ReturnType = void> = (
  dispatch: Dispatch<CheckoutAction>,
  getState: () => CheckoutState,
) => Promise<ReturnType>;

type DispatchFunction = {
  <ReturnType>(action: ThunkAction<ReturnType>): Promise<ReturnType>;
  (action: CheckoutAction): void;
};

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
  paymentMethod: StripeJS.PaymentMethod | undefined;
};

type CheckoutAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR_MESSAGE"; payload?: string }
  | { type: "SET_PAYMENT_INTENT"; payload: CheckoutState["paymentIntent"] }
  | { type: "SET_PAYMENT_METHOD"; payload: CheckoutState["paymentMethod"] }
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
  paymentMethod: undefined,
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
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const CheckoutContext = createContext<
  | {
      state: CheckoutState;
      dispatch: DispatchFunction;
    }
  | undefined
>(undefined);

export const createPaymentIntentAction = (
  id: string,
): ThunkAction<string | undefined> => {
  return async (dispatch, getState) => {
    const currentState = getState();
    if (!currentState.paymentIntent?.clientSecret) {
      const { clientSecret } = await createPaymentIntent({
        id,
      });
      dispatch({
        type: "SET_PAYMENT_INTENT",
        payload: {
          clientSecret: clientSecret || null,
          status: null,
          invoice: null,
          id: "",
        },
      });
      return clientSecret;
    }
    return currentState.paymentIntent.clientSecret;
  };
};

export const createPaymentMethodAction = (
  stripeInstance: StripeJS.Stripe,
  stripeElements: StripeJS.StripeElements,
  email?: string | null,
): ThunkAction<StripeJS.PaymentMethod | undefined> => {
  return async (dispatch) => {
    stripeElements.submit();
    const { paymentMethod } = await stripeInstance.createPaymentMethod({
      elements: stripeElements,
      params: {
        billing_details: { email },
      },
    });
    dispatch({ type: "SET_PAYMENT_METHOD", payload: paymentMethod });
    return paymentMethod;
  };
};

export const confirmPaymentAction = (
  stripeInstance: StripeJS.Stripe,
  router: AppRouterInstance,
  clientSecret: string | undefined,
  paymentMethod: StripeJS.PaymentMethod | undefined,
  returnUrl: URL,
): ThunkAction => {
  return async (dispatch) => {
    if (!clientSecret || !paymentMethod) {
      return;
    }
    const { paymentIntent, error } = await stripeInstance.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: returnUrl.href,
        payment_method: paymentMethod?.id,
        save_payment_method: true,
      },
      redirect: "if_required",
    });
    if (error) {
      dispatch({ type: "SET_ERROR_MESSAGE", payload: error.message });
    } else {
      returnUrl.searchParams.set("payment_intent", paymentIntent.id);
      router.replace(returnUrl.href);
      dispatch({
        type: "SET_PAYMENT_INTENT",
        payload: {
          ...paymentIntent,
          clientSecret,
          invoice: null,
        },
      });
    }
  };
};

export const retrievePaymentIntentAction = (id: string | null): ThunkAction => {
  return async (dispatch) => {
    if (!id) {
      return;
    }
    const { paymentIntent } = await retrievePaymentIntent(id);
    dispatch({ type: "SET_PAYMENT_INTENT", payload: paymentIntent });
    if (
      paymentIntent?.status !== "succeeded" &&
      paymentIntent?.status !== "processing"
    ) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: "Payment failed or requires action. Please try again",
      });
    }
  };
};

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, originalDispatch] = useReducer(checkoutReducer, initialState);

  const dispatch: DispatchFunction = async (
    action: CheckoutAction | ThunkAction,
  ) => {
    if (typeof action === "function") {
      return await action(originalDispatch, () => state);
    } else {
      originalDispatch(action);
    }
  };

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
