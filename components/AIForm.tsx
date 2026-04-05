"use client";

import { useState } from "react";

export default function AIForm() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div className="mt-6">
      <textarea
        className="border p-2 w-full"
        placeholder="Unesi prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        Generate
      </button>

      <pre className="mt-4 bg-gray-100 p-4">{result}</pre>
    </div>
  );
}