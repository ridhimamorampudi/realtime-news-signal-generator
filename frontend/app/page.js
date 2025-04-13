"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  async function fetchSignals() {
    try {
      const res = await fetch("http://localhost:8000/fetch-signals");
      const data = await res.json();
      setSignals(data.signals || []);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching signals:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 60000); // refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">🚨 Real-Time News Signals</h1>

      <div className="text-center text-sm text-gray-600 mb-6">
        {loading ? "Loading signals..." : `Last updated: ${lastUpdated}`}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {signals.length === 0 && !loading && (
          <div className="text-center text-gray-500">No market-moving signals found.</div>
        )}

        {signals.map((signal, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{signal.title}</h2>
            <p className="text-gray-600 mb-2">Source: {signal.source.toUpperCase()}</p>
            <p className="text-gray-600 mb-2">Detected Events: {signal.detected_events.join(", ")}</p>
            <a
              href={signal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Full Article
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
