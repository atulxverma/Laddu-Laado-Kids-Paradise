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
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

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
      className="inline-flex h-10 w-full min-w-0 items-center justify-center whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60 xl:h-11 xl:w-auto xl:px-6 xl:text-sm"
    >
      <XCircle size={14} className="mr-1.5 shrink-0" />
      {isPending ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}