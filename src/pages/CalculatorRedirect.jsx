import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LoggedInCalculatorPage from "./LoggedInCalculatorPage/LoggedInCalculatorPage";
import CalculatorPage from "./CalculatorPage/CalculatorPage";

export default function CalculatorRedirect() {
  const { user } = useContext(AuthContext);

  return user ? <LoggedInCalculatorPage /> : <CalculatorPage />;
}
