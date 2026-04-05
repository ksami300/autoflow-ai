"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    goal: "",
    weight: "",
    height: "",
    activity: "",
  });

  const [result, setResult] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [chat, setChat] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const loadPlans = async () => {
    const res = await fetch("/api/plans");
    const data = await res.json();
    setPlans(data);
  };

  useEffect(() => {
    if (session) loadPlans();
  }, [session]);

  const generate = async () => {
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

    const data = await res.json();
    setResult(data.result);
    loadPlans();
  };

  const sendMessage = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setChat([
      ...chat,
      { role: "user", content: message },
      { role: "assistant", content: data.reply },
    ]);

    setMessage("");
  };

  if (!session) {
    return (
      <div className="p-10">
        <button onClick={() => signIn("google")}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 bg-black text-white min-h-screen">
      <button onClick={() => signOut()}>Logout</button>

      <h1 className="text-2xl mb-4">AI Nutricionista</h1>

      <input placeholder="Goal" onChange={(e) => setForm({ ...form, goal: e.target.value })} />
      <input placeholder="Weight" onChange={(e) => setForm({ ...form, weight: e.target.value })} />
      <input placeholder="Height" onChange={(e) => setForm({ ...form, height: e.target.value })} />
      <input placeholder="Activity" onChange={(e) => setForm({ ...form, activity: e.target.value })} />

      <button onClick={generate}>Generate</button>

      <div>{result}</div>

      <h2>History</h2>
      {plans.map((p, i) => (
        <div key={i}>{p.result}</div>
      ))}

      <h2>Chat</h2>
      {chat.map((c, i) => (
        <div key={i}>
          {c.role}: {c.content}
        </div>
      ))}

      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}