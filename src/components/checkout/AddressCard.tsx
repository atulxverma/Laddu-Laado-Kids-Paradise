"use client";

import {
  CheckCircle2,
  ChevronRight,
  MapPin,
  Pencil,
  Plus,
} from "lucide-react";

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
    <section
      className="
        overflow-hidden
        rounded-[20px]
        border
        border-neutral-200
        bg-white
        shadow-[0_4px_20px_rgba(0,0,0,0.035)]

        md:rounded-[26px]
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-neutral-100
          px-4
          py-3

          md:px-5
          md:py-4
        "
      >
        <div className="flex items-center gap-2.5">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-neutral-950
              text-white
            "
          >
            <MapPin size={15} strokeWidth={2} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-semibold text-neutral-950">
                Delivery address
              </h2>

              {hasAddress && (
                <CheckCircle2
                  size={14}
                  className="text-emerald-600"
                />
              )}
            </div>

            <p className="mt-0.5 text-[11px] text-neutral-400">
              {hasAddress
                ? "Your order will be delivered here"
                : "Required to continue checkout"}
            </p>
          </div>
        </div>

        {hasAddress && (
          <button
            type="button"
            onClick={onOpen}
            className="
              flex
              h-8
              items-center
              gap-1.5
              rounded-full
              border
              border-neutral-200
              px-3
              text-[11px]
              font-semibold
              text-neutral-700
              transition
              hover:border-neutral-300
              hover:bg-neutral-50
              active:scale-95
            "
          >
            <Pencil size={12} />
            Edit
          </button>
        )}
      </div>

      {/* BODY */}

      {!hasAddress ? (
        <button
          type="button"
          onClick={onOpen}
          className="
            group
            flex
            w-full
            items-center
            gap-3
            px-4
            py-4
            text-left
            transition
            hover:bg-neutral-50
            active:bg-neutral-100

            md:px-5
            md:py-5
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-[13px]
              border
              border-dashed
              border-neutral-300
              bg-neutral-50
            "
          >
            <Plus
              size={18}
              className="text-neutral-600"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-neutral-900">
              Add delivery address
            </p>

            <p className="mt-0.5 text-[11px] leading-4 text-neutral-500">
              Add your contact and delivery details.
            </p>
          </div>

          <ChevronRight
            size={18}
            className="
              shrink-0
              text-neutral-300
              transition-transform
              group-hover:translate-x-0.5
              group-hover:text-neutral-500
            "
          />
        </button>
      ) : (
        <div className="px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-start gap-3">

            {/* Initial */}

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-neutral-100
                text-[13px]
                font-bold
                uppercase
                text-neutral-800
              "
            >
              {form.name.trim().charAt(0) || "U"}
            </div>

            {/* Details */}

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-[13px] font-semibold text-neutral-950">
                  {form.name}
                </p>

                <span className="text-neutral-300">
                  •
                </span>

                <p className="text-[12px] text-neutral-500">
                  +91 {form.phone}
                </p>
              </div>

              <p
                className="
                  mt-1.5
                  text-[12px]
                  leading-[19px]
                  text-neutral-600

                  md:text-[13px]
                "
              >
                {form.houseDetails}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-1 text-[12px] font-medium text-neutral-700">
                <span>{form.city},</span>

                <span>{form.state}</span>

                <span className="text-neutral-400">
                  — {form.pincode}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}