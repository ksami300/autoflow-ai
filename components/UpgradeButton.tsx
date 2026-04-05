"use client";

export default function UpgradeButton() {
  const upgrade = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    const data = await res.json();

    window.location.href = data.data.url;
  };

  return (
    <button
      onClick={upgrade}
      className="bg-green-500 text-white px-4 py-2 mb-4"
    >
      Upgrade to PRO
    </button>
  );
}