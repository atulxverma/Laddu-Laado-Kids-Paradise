"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import { createNimbusShipment } from "@/lib/actions";

interface CreateShipmentButtonProps {
  orderId: string;
}

export default function CreateShipmentButton({
  orderId,
}: CreateShipmentButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleCreateShipment = () => {
    startTransition(async () => {
      const res = await createNimbusShipment(orderId);

      if (res?.error) {
        alert(res.error);
        return;
      }

      alert("Shipment created successfully.");

      router.refresh();
    });
  };

  return (
    <button
      onClick={handleCreateShipment}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Truck size={15} />

      {isPending ? "Creating..." : "Create Shipment"}
    </button>
  );
}