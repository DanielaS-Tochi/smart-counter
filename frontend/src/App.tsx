import { useEffect } from "react";
import { useCounter } from "./hooks/useCounter";

function App() {
  const { count, fetchCount, increment, decrement, error, loading, txHash } = useCounter();

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Smart Counter</h1>
      <div style={styles.counterBox}>
        <p style={styles.counterValue}>
          Valor actual: <b style={{ color: "#1dafb" }}>{count.toString()}</b>
        </p>
        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={increment} disabled={loading}>
            Incrementar
          </button>
          <button style={styles.button} onClick={decrement} disabled={loading}>
            Decrementar
          </button>
        </div>
        {loading && <p style={styles.loading}>Procesando transacción...</p>}
        {txHash && (
          <p style={styles.txHash}>
            Tx Hash: <a href={`https://explorer.localhost/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash.slice(0, 10)}...</a>
          </p>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </div>
      <footer style={styles.footer}>
        <small>Conectado a Hardhat local · MetaMask</small>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
    padding: "2rem",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#1e293b",
    textAlign: "center",
  },
  counterBox: {
    background: "#fff",
    borderRadius: "1rem",
    boxShadow: "0 2px 16px #0001",
    padding: "2rem",
    minWidth: "300px",
    maxWidth: "90vw",
    textAlign: "center",
  },
  counterValue: {
    fontSize: "1.5rem",
    margin: "1rem 0",
    color: "#1e293b", // Color oscuro y visible
  },
  buttonRow: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    margin: "1rem 0",
    flexWrap: "wrap",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.2s",
    minWidth: "120px",
    fontWeight: 600,
    outline: "none",
    opacity: 1,
  },
  loading: {
    color: "#2563eb",
    margin: "1rem 0 0 0",
    fontWeight: 500,
  },
  txHash: {
    color: "#64748b",
    fontSize: "0.9rem",
    margin: "0.5rem 0",
    wordBreak: "break-all",
  },
  error: {
    color: "#dc2626",
    margin: "1rem 0 0 0",
    fontWeight: 500,
    whiteSpace: "pre-line",
  },
  footer: {
    marginTop: "2rem",
    color: "#64748b",
    fontSize: "0.9rem",
    textAlign: "center",
  },
};

export default App;

