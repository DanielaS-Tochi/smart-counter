
// import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { useState, useCallback } from "react";
import { createPublicClient, http } from "viem";
import counterAbi from "../abi/Counter.json";

const CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // Dirección real del contrato
const RPC_URL = "http://localhost:8545"; // O la URL de tu red (Hardhat, Sepolia, etc.)

export function useCounter() {
  const [count, setCount] = useState<bigint>(0n);
  const [error, setError] = useState<string | null>(null);

  const client = createPublicClient({
    transport: http(RPC_URL),
  });

  const fetchCount = useCallback(async () => {
    try {
      const value = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "count",
      });
      setCount(value as bigint);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error al leer el contrato");
    }
  }, [client]);

  return { count, fetchCount, error };
}