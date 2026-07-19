"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { cancelOrder } from "@/lib/actions";

export default function CancelOrderButton({
  orderId,
}: {
  orderId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCancel = () => {
    const ok = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!ok) return;

    startTransition(async () => {
      const res = await cancelOrder(orderId);

      if (res?.success) {
        router.refresh();
      } else {
        alert(res?.error || "Failed to cancel order.");
      }
    });
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
    >
      <XCircle size={14} />

      {isPending ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}