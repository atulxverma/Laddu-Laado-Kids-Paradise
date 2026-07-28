"use client";

import { MapPin, Plus, Pencil } from "lucide-react";

type Address = {
  name: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  houseDetails: string;
};

type AddressCardProps = {
  form: Address;
  onOpen: () => void;
};

export default function AddressCard({
  form,
  onOpen,
}: AddressCardProps) {
  const hasAddress =
  form.name.trim() !== "" &&
  form.phone.length === 10 &&
  form.pincode.length === 6 &&
  form.houseDetails.trim() !== "" &&
  form.city.trim() !== "" &&
  form.state.trim() !== "";

  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div className="flex gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
            <MapPin size={22} />
          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Delivery Address
            </p>

            {!hasAddress ? (
              <>
                <h3 className="mt-2 text-lg font-semibold text-black">
                  No Address Added
                </h3>

                <p className="mt-1 text-sm text-neutral-500">
                  Add your delivery address to continue checkout.
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-2 text-base font-semibold text-black">
                  {form.name}
                </h3>

                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  {form.houseDetails}
                  <br />
                  {form.city}, {form.state} - {form.pincode}
                </p>

                <p className="mt-2 text-sm text-neutral-500">
                  +91 {form.phone}
                </p>
              </>
            )}

          </div>

        </div>

      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-black bg-black text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        {hasAddress ? (
          <>
            <Pencil size={17} />
            Change Address
          </>
        ) : (
          <>
            <Plus size={18} />
            Add Address
          </>
        )}
      </button>

    </div>
  );
}