"use client";
import { useState, useEffect } from "react";

export default function ResponseRateCard() {
  const [responseRate, setResponseRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchResponseRate() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockRate = parseFloat((Math.random() * 100).toFixed(2)); 
      setResponseRate(mockRate);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError("Failed to load response rate");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResponseRate();
  }, []); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-4 w-64">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Response Rate
      </h3>
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        {responseRate}%
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Last updated: {lastUpdated}
      </p>
    </div>
  );
}
