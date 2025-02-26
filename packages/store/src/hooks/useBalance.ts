import { useSelector, UseSelector } from "react-redux";
import { RootState } from "../store";

export const useBalance = () => {
  const balance = useSelector((state: RootState) => state.balance.value);

  return balance;
};
