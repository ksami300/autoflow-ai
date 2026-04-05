"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

type Plan = {
  id?: number;
  goal: string;
  weight: number;
  height: number;
  activity: string;
  result: string;
};

export default function Home() {
  const [form, setForm] = useState({
    goal: "",
    weight: "",
    height: "",
    activity: "",
  });

  const [result, setResult] = useState<string>("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔄 Load plans
  const loadPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data);
    } catch {
      setError("Greška pri učitavanju planova");
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  // 🚀 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          weight: Number(form.weight),
          height: Number(form.height),
        }),
      });

      if (!res.ok) throw new Error("API greška");

      const data = await res.json();
      setResult(data.result);

      await loadPlans();
    } catch {
      setError("Došlo je do greške. Pokušaj ponovo.");
    } finally {
      setLoading(false);
    }
  };

  // 📄 PDF (clean formatting)
  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(result, 180);

    doc.setFontSize(16);
    doc.text("AI Plan Ishrane", 10, 10);

    doc.setFontSize(10);
    doc.text(lines, 10, 20);

    doc.save("plan-ishrane.pdf");
  };

  return (
    <div className="bg-black text-white min-h-screen p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl mb-6 font-bold">AI Plan Ishrane</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Cilj (mršavljenje / masa)"
          className="p-2 text-black w-full rounded"
          required
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
        />
        <input
          placeholder="Težina (kg)"
          type="number"
          className="p-2 text-black w-full rounded"
          required
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
        />
        <input
          placeholder="Visina (cm)"
          type="number"
          className="p-2 text-black w-full rounded"
          required
          onChange={(e) => setForm({ ...form, height: e.target.value })}
        />
        <input
          placeholder="Aktivnost (npr. srednja)"
          className="p-2 text-black w-full rounded"
          required
          onChange={(e) => setForm({ ...form, activity: e.target.value })}
        />

        <button
          disabled={loading}
          className="bg-white text-black px-4 py-2 rounded w-full"
        >
          {loading ? "Generišem..." : "Generiši plan"}
        </button>
      </form>

      {/* ERROR */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* RESULT */}
      {result && (
        <div className="mt-10 whitespace-pre-wrap">
          <h2 className="text-xl mb-2 font-semibold">Rezultat:</h2>
          <p>{result}</p>

          <button
            onClick={downloadPDF}
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
          >
            Preuzmi PDF
          </button>
        </div>
      )}

      {/* HISTORY */}
      <div className="mt-10">
        <h2 className="text-xl mb-4 font-semibold">Istorija planova</h2>

        {plans.length === 0 && (
          <p className="text-gray-400">Nema planova još</p>
        )}

        {plans.map((p, i) => (
          <div key={i} className="border border-gray-700 p-4 mb-3 rounded">
            <p className="text-sm text-gray-400 mb-1">
              {p.goal} | {p.weight}kg | {p.height}cm
            </p>
            <p className="whitespace-pre-wrap text-sm">{p.result}</p>
          </div>
        ))}
      </div>
    </div>
  );
}