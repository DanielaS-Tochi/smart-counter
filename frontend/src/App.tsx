import { useEffect } from "react";
import { useCounter } from "./hooks/useCounter";

function App() {
  const { count, fetchCount, increment, decrement, error } = useCounter();

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return (
    <div>
      <h1>Smart Counter</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Valor actual: {count.toString()}</p>
      <button onClick={increment}>Incrementar</button>
      <button onClick={decrement}>Decrementar</button>
    </div>
  );
}

export default App;

