"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [plan, setPlan] = useState("");
  const [plans, setPlans] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("plans");
    if (saved) setPlans(JSON.parse(saved));
  }, []);

  const generatePlan = () => {
    const fakePlan = `
🔥 PLAN ZA: ${goal}

📊 Težina: ${weight}kg | Visina: ${height}cm

🥚 Doručak:
- 3 jaja
- ovsene pahuljice

🍗 Ručak:
- piletina
- pirinač

🥗 Večera:
- tunjevina
- salata
`;
    setPlan(fakePlan);
  };

  const savePlan = () => {
    if (!plan) return;
    const updated = [plan, ...plans];
    setPlans(updated);
    localStorage.setItem("plans", JSON.stringify(updated));
  };

  const deletePlan = (index: number) => {
    const updated = plans.filter((_, i) => i !== index);
    setPlans(updated);
    localStorage.setItem("plans", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-6 gap-6">
      <h1 className="text-3xl font-bold">💪 AI Plan Ishrane</h1>

      <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <input
          className="w-full p-2 rounded bg-zinc-800"
          placeholder="Cilj (masa / mršavljenje)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-zinc-800"
          placeholder="Težina (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-zinc-800"
          placeholder="Visina (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={generatePlan}
            className="flex-1 bg-green-500 hover:bg-green-600 p-2 rounded font-semibold"
          >
            Generiši
          </button>

          <button
            onClick={savePlan}
            className="flex-1 bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold"
          >
            Sačuvaj
          </button>
        </div>
      </div>

      {plan && (
        <div className="bg-zinc-900 p-4 rounded-xl w-full max-w-md">
          <h2 className="text-xl mb-2">📋 Rezultat</h2>
          <pre className="whitespace-pre-wrap text-green-400">{plan}</pre>
        </div>
      )}

      <div className="w-full max-w-md space-y-3">
        <h2 className="text-xl">💾 Sačuvani planovi</h2>

        {plans.map((p, i) => (
          <div
            key={i}
            className="bg-zinc-900 p-3 rounded-xl border border-zinc-700"
          >
            <pre className="whitespace-pre-wrap text-sm">{p}</pre>

            <button
              onClick={() => deletePlan(i)}
              className="mt-2 text-red-400 hover:text-red-600"
            >
              Obriši
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}