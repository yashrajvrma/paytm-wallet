"use client";

import { useBalance } from "@repo/store/useBalance";

export default function BalanceDisplay() {
  const balance = useBalance();
  return <div>hii there {balance}</div>;
}
