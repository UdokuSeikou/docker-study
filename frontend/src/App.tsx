import { useState, useEffect } from "react";

interface ApiData {
  message: string;
  time: string;
}

function App() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((d: ApiData) => {
        setData(d);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Frontend + Backend + DB (TypeScript)</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <>
          <p>{data.message}</p>
          <p>Server Time: {new Date(data.time).toISOString()}</p>
        </>
      )}
    </>
  );
}

export default App;