import { useReducer, useEffect, useRef } from "react";
import "./styles.css";

const initialState = {
  balance: 0,
  amount: "",
  loan: 0,
  isActive: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setAmount":
      return { ...state, amount: action.payload };
    case "setBalance":
      if (!action.payload) return state; // we can not simply return null
      return {
        ...state,
        balance: state.balance + action.payload,
        amount: "",
      };
    case "setLoan":
      if (!action.payload) return state;
      // if (state.loan > 0 && state.loan >= action.payload && state.balance > 0)
      return {
        ...state,
        loan: state.loan + action.payload,
        balance: state.balance + action.payload,
        amount: "",
      };
    case "setIsActive":
      return { ...state, isActive: action.payload };
    case "resetAccount":
      return initialState;
    default:
      return "Unknown Action";
  }
}
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { balance, loan, amount, isActive } = state;
  const inputRef = useRef(null);

  useEffect(() => inputRef.current.focus(), [isActive]);

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <h2>Balance: {balance}</h2>
      <h2>Loan: {loan}</h2>
      <div className="row">
        <input
          ref={inputRef}
          id="input-amount"
          type="number"
          disabled={!isActive}
          value={amount}
          onChange={(e) =>
            dispatch({ type: "setAmount", payload: e.target.value })
          }
        />

        <button
          onClick={
            () =>
              dispatch({
                type: "setBalance",
                payload: Math.abs(Number(amount)),
              })
            // in case you enter negative values by mistake, so we just take the positive values by Math.asb()
          }
          disabled={!isActive}
        >
          Deposit
        </button>

        <button
          onClick={() =>
            balance >= amount &&
            dispatch({ type: "setBalance", payload: -Math.abs(Number(amount)) })
          }
          disabled={!isActive}
        >
          Withdraw
        </button>

        <button
          onClick={() =>
            dispatch({ type: "setLoan", payload: Math.abs(Number(amount)) })
          }
          disabled={!isActive}
        >
          Request loan
        </button>

        <button
          onClick={() => {
            if (balance >= amount && loan >= amount)
              dispatch({ type: "setLoan", payload: -Math.abs(Number(amount)) });
          }}
          disabled={!isActive}
        >
          Pay loan
        </button>

        <button
          onClick={() => {
            if (!isActive) dispatch({ type: "setIsActive", payload: true });

            if (isActive && balance === 0 && loan === 0)
              dispatch({ type: "resetAccount" });
          }}
        >
          {!isActive ? "Open Account" : "Close account"}
        </button>
      </div>
    </div>
  );
}
