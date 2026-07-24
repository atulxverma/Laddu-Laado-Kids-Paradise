"use client";

import { useState } from "react";
import { Truck, X } from "lucide-react";

export default function PreparingShipmentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full border border-neutral-300 bg-neutral-100 px-2 text-[11px] font-semibold text-neutral-500 transition hover:bg-neutral-200 xl:h-11 xl:w-auto xl:px-7 xl:text-sm cursor-not-allowed"
      >
        <Truck size={14} className="mr-1.5 shrink-0" />
        Preparing Shipment
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">

            <div className="flex items-start justify-between">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                <Truck className="text-blue-600" size={28} />
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-neutral-100"
              >
                <X size={18} />
              </button>

            </div>

            <h2 className="mt-5 text-2xl font-black text-neutral-900">
              Preparing Your Shipment
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Your order has been successfully confirmed.
              <br />
              <br />
              Our team is currently verifying your order,
              securely packing your items, and preparing the shipment.
              <br />
              <br />
              Live tracking will become available automatically as soon as
              your package is handed over to our delivery partner.
            </p>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-full bg-black py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Got it
            </button>

          </div>

        </div>
      )}
    </>
  );
}