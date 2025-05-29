import { useEffect } from "react";
import { useCounter } from "./hooks/useCounter";

function App() {
  const { count, fetchCount, error } = useCounter();

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return (
    <div>
      <h1>Smart Counter</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Valor actual: {count.toString()}</p>
    </div>
  );
}

export default App;

