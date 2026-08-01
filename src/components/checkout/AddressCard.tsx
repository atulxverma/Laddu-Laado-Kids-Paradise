"use client";

import {
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Home,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

type Address = {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  houseDetails: string;
  label: string;
  isDefault: boolean;
};

type AddressCardProps = {
  addresses: Address[];
  selectedAddressId: string | null;
  loading?: boolean;

  onSelect: (address: Address) => void;
  onAddNew: () => void;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
};

export default function AddressCard({
  addresses,
  selectedAddressId,
  loading = false,
  onSelect,
  onAddNew,
  onEdit,
  onDelete,
}: AddressCardProps) {
  if (loading) {
    return (
      <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.035)] md:rounded-[26px]">
        <div className="border-b border-neutral-100 px-4 py-3 md:px-5 md:py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-200" />

            <div className="space-y-2">
              <div className="h-3.5 w-28 animate-pulse rounded bg-neutral-200" />
              <div className="h-2.5 w-40 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4 md:p-5">
          <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
        </div>
      </section>
    );
  }

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
      {/* HEADER */}

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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-white">
            <MapPin size={15} strokeWidth={2} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-semibold text-neutral-950">
                Delivery address
              </h2>

              {selectedAddressId && (
                <CheckCircle2
                  size={14}
                  className="text-emerald-600"
                />
              )}
            </div>

            <p className="mt-0.5 text-[11px] text-neutral-400">
              {addresses.length > 0
                ? "Choose where you want your order delivered"
                : "Required to continue checkout"}
            </p>
          </div>
        </div>

        {addresses.length > 0 && (
          <button
            type="button"
            onClick={onAddNew}
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-1
              rounded-full
              border
              border-neutral-200
              px-2.5
              text-[11px]
              font-semibold
              text-neutral-700
              transition
              hover:border-neutral-300
              hover:bg-neutral-50
              active:scale-95
            "
          >
            <Plus size={13} />
            Add
          </button>
        )}
      </div>

      {/* NO ADDRESS */}

      {addresses.length === 0 ? (
        <button
          type="button"
          onClick={onAddNew}
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
            <Plus size={18} className="text-neutral-600" />
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
        /* SAVED ADDRESSES */

        <div className="space-y-2.5 p-3 md:p-4">
          {addresses.map((address) => {
            const selected =
              selectedAddressId === address.id;

            return (
              <div
                key={address.id}
                onClick={() => onSelect(address)}
                className={`
                  group
                  relative
                  cursor-pointer
                  rounded-[16px]
                  border
                  p-3.5
                  transition-all
                  duration-200

                  ${selected
                    ? "border-black bg-neutral-50 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/60"
                  }
                `}
              >
                <div className="flex items-start gap-3">

                  {/* RADIO */}

                  <div
                    className={`
                      mt-0.5
                      flex
                      h-[18px]
                      w-[18px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all

                      ${selected
                        ? "border-black bg-black"
                        : "border-neutral-300 bg-white"
                      }
                    `}
                  >
                    {selected && (
                      <Check
                        size={11}
                        strokeWidth={3}
                        className="text-white"
                      />
                    )}
                  </div>

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">

                      <p className="text-[13px] font-semibold text-neutral-950">
                        {address.name}
                      </p>

                      {address.label && (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-full
                            bg-neutral-100
                            px-2
                            py-0.5
                            text-[9px]
                            font-semibold
                            text-neutral-600
                          "
                        >
                          {address.label === "Office" ? (
                            <BriefcaseBusiness size={9} />
                          ) : address.label === "Other" ? (
                            <MapPin size={9} />
                          ) : (
                            <Home size={9} />
                          )}

                          {address.label}
                        </span>
                      )}

                      {address.isDefault && (
                        <span
                          className="
                            rounded-full
                            bg-emerald-50
                            px-2
                            py-0.5
                            text-[9px]
                            font-bold
                            text-emerald-700
                          "
                        >
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-[11px] text-neutral-500">
                      +91 {address.phone}
                    </p>

                    <p
                      className="
                        mt-2
                        text-[12px]
                        leading-[18px]
                        text-neutral-600
                        md:text-[13px]
                      "
                    >
                      {address.houseDetails}
                    </p>

                    <p className="mt-1 text-[11px] font-medium text-neutral-600">
                      {address.city}, {address.state} — {address.pincode}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(address);
                      }}
                      className="
      flex
      h-8
      w-8
      items-center
      justify-center
      rounded-full
      text-neutral-400
      transition
      hover:bg-white
      hover:text-black
      active:scale-90
    "
                      aria-label="Edit address"
                    >
                      <Pencil size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(address);
                      }}
                      className="
      flex
      h-8
      w-8
      items-center
      justify-center
      rounded-full
      text-neutral-400
      transition
      hover:bg-red-50
      hover:text-red-600
      active:scale-90
    "
                      aria-label="Delete address"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* SELECTED MESSAGE */}

                {selected && (
                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      gap-1.5
                      border-t
                      border-neutral-200
                      pt-2.5
                      text-[10px]
                      font-semibold
                      text-emerald-700
                    "
                  >
                    <CheckCircle2 size={12} />

                    Delivering to this address
                  </div>
                )}
              </div>
            );
          })}

          {/* ADD ANOTHER */}

          <button
            type="button"
            onClick={onAddNew}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-[14px]
              border
              border-dashed
              border-neutral-300
              py-3
              text-[11px]
              font-semibold
              text-neutral-600
              transition
              hover:border-neutral-400
              hover:bg-neutral-50
              hover:text-black
              active:scale-[0.99]
            "
          >
            <Plus size={14} />
            Add another address
          </button>
        </div>
      )}
    </section>
  );
}