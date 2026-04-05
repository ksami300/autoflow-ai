"use client";

import AIForm from "@/components/AIForm";
import UpgradeButton from "@/components/UpgradeButton";

export default function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <UpgradeButton />
      <AIForm />
    </div>
  );
}