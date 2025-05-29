import { useState, useCallback } from "react";
import { createPublicClient, createWalletClient, http, custom, defineChain } from "viem";
import counterAbi from "../abi/Counter.json";

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
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

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
      setLoading(true);
      setError(null);
      setTxHash(null);
      if (!window.ethereum) throw new Error("MetaMask no está disponible");
      const walletClient = createWalletClient({
        chain: hardhatChain,
        transport: custom(window.ethereum),
      });
      const [account] = await walletClient.getAddresses();
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "increment",
        account,
      });
      setTxHash(hash as string);
      // Espera a que la transacción sea minada antes de actualizar el contador
      await client.waitForTransactionReceipt({ hash });
      const value = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "count",
      });
      console.log("Valor del contador:", value); // <-- ¿Qué imprime esto?
      setCount(value as bigint);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Error al incrementar");
    } finally {
      setLoading(false);
    }
  }, [client]);

  const decrement = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setTxHash(null);
      if (!window.ethereum) throw new Error("MetaMask no está disponible");
      const walletClient = createWalletClient({
        chain: hardhatChain,
        transport: custom(window.ethereum),
      });
      const [account] = await walletClient.getAddresses();
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "decrement",
        account,
      });
      setTxHash(hash as string);
      await client.waitForTransactionReceipt({ hash });
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
    } finally {
      setLoading(false);
    }
  }, [client]);

  return { count, fetchCount, increment, decrement, error, loading, txHash };
}