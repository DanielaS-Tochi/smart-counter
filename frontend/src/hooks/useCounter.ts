import { useState, useCallback } from "react";
import { createPublicClient, createWalletClient, http, custom, defineChain } from "viem";
import counterAbi from "../abi/Counter.json";

// Define la chain Hardhat con chainId 31337
const hardhatChain = defineChain({
  id: 31337,
  name: "Hardhat",
  network: "hardhat",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://localhost:8545"] },
    public: { http: ["http://localhost:8545"] },
  },
});

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
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Error al leer el contrato");
    }
  }, [client]);

  const increment = useCallback(async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask no está disponible");
      const walletClient = createWalletClient({
        chain: hardhatChain,
        transport: custom(window.ethereum),
      });
      const [account] = await walletClient.getAddresses();
      await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "increment",
        account,
      });
      setError(null);
      // Actualiza el contador después de la transacción
      const value = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "count",
      });
      setCount(value as bigint);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Error al incrementar");
    }
  }, [client]);

  const decrement = useCallback(async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask no está disponible");
      const walletClient = createWalletClient({
        chain: hardhatChain,
        transport: custom(window.ethereum),
      });
      const [account] = await walletClient.getAddresses();
      await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "decrement",
        account,
      });
      setError(null);
      // Actualiza el contador después de la transacción
      const value = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "count",
      });
      setCount(value as bigint);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Error al decrementar");
    }
  }, [client]);

  return { count, fetchCount, increment, decrement, error };
}