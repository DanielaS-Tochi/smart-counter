/// <reference types="vite/client" />

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  // Puedes agregar más métodos si los necesitas
}

interface Window {
  ethereum?: EthereumProvider;
}