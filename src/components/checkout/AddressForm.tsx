"use client";

import {
  Check,
  Home,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  User,
} from "lucide-react";

type AddressFormProps = {
  form: {
    name: string;
    phone: string;
    pincode: string;
    city: string;
    state: string;
    houseDetails: string;
  };

  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phone: string;
      pincode: string;
      city: string;
      state: string;
      houseDetails: string;
    }>
  >;

  locating: boolean;
  detectLocation: () => void;

  pincodeLoading: boolean;

  handlePincodeChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function AddressForm({
  form,
  setForm,
  locating,
  detectLocation,
  pincodeLoading,
  handlePincodeChange,
}: AddressFormProps) {
  const nameValid = form.name.trim().length >= 2;
  const phoneValid = form.phone.length === 10;
  const pincodeValid =
    form.pincode.length === 6 &&
    !!form.city &&
    !!form.state;

  const inputClass = `
    h-12
    w-full
    rounded-[14px]
    border
    border-neutral-200
    bg-white
    text-[14px]
    text-neutral-900
    outline-none
    transition-all
    duration-200
    placeholder:text-neutral-400
    hover:border-neutral-300
    focus:border-black
    focus:ring-2
    focus:ring-black/5
  `;

  const labelClass =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500";

  return (
    <div className="space-y-5">

      {/* CONTACT INFORMATION */}

      <section>
        <div className="mb-3">
          <h3 className="text-[15px] font-semibold tracking-tight text-neutral-950">
            Contact information
          </h3>

          <p className="mt-0.5 text-[12px] text-neutral-500">
            Used only for delivery updates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          {/* NAME */}

          <div>
            <label className={labelClass}>
              Full name
            </label>

            <div className="relative">
              <User
                size={17}
                strokeWidth={1.8}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                value={form.name}
                required
                maxLength={60}
                autoComplete="name"
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    name: e.target.value
                      .replace(/\s+/g, " ")
                      .slice(0, 60),
                  }))
                }
                placeholder="Your full name"
                className={`${inputClass} pl-10 ${
                  nameValid ? "pr-10" : "pr-3"
                }`}
              />

              {nameValid && (
                <div className="pointer-events-none absolute right-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>

          {/* PHONE */}

          <div>
            <label className={labelClass}>
              Phone number
            </label>

            <div className="relative">
              <Phone
                size={16}
                strokeWidth={1.8}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 border-r border-neutral-200 pr-2.5 text-[13px] font-medium text-neutral-600">
                +91
              </div>

              <input
                value={form.phone}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                required
                maxLength={10}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    phone: e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10),
                  }))
                }
                placeholder="Enter 10 digit mobile number"
                className={`${inputClass} pl-[82px] ${
                  phoneValid ? "pr-10" : "pr-3"
                }`}
              />

              {phoneValid && (
                <div className="pointer-events-none absolute right-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}

      <div className="h-px bg-neutral-100" />

      {/* DELIVERY ADDRESS */}

      <section>
        <div className="mb-3">
          <h3 className="text-[15px] font-semibold tracking-tight text-neutral-950">
            Delivery address
          </h3>

          <p className="mt-0.5 text-[12px] text-neutral-500">
            Tell us where you&apos;d like your order delivered.
          </p>
        </div>

        {/* LOCATION ACTION */}

        <button
          type="button"
          onClick={detectLocation}
          disabled={locating}
          className="
            group
            mb-4
            flex
            w-full
            items-center
            gap-3
            rounded-[16px]
            border
            border-neutral-200
            bg-neutral-50
            px-3.5
            py-3
            text-left
            transition-all
            duration-200
            hover:border-neutral-300
            hover:bg-neutral-100/80
            active:scale-[0.995]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-sm">
            {locating ? (
              <Navigation
                size={16}
                className="animate-spin"
              />
            ) : (
              <LocateFixed size={17} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-neutral-900">
              {locating
                ? "Finding your location..."
                : "Use my current location"}
            </p>

            <p className="mt-0.5 text-[11px] text-neutral-500">
              We&apos;ll automatically detect your city and state.
            </p>
          </div>

          {!locating && (
            <span className="shrink-0 text-lg leading-none text-neutral-400 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          )}
        </button>

        {/* OR */}

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-100" />

          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            or enter manually
          </span>

          <div className="h-px flex-1 bg-neutral-100" />
        </div>

        {/* PINCODE */}

        <div>
          <label className={labelClass}>
            Pincode
          </label>

          <div className="relative">
            <MapPin
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              value={form.pincode}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              required
              maxLength={6}
              onChange={handlePincodeChange}
              placeholder="Enter 6 digit pincode"
              className={`${inputClass} pl-10 pr-11`}
            />

            {pincodeLoading ? (
              <div className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
            ) : pincodeValid ? (
              <div className="pointer-events-none absolute right-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white">
                <Check size={12} strokeWidth={3} />
              </div>
            ) : null}
          </div>
        </div>

        {/* DETECTED LOCATION */}

        {form.city && form.state && (
          <div
            className="
              mt-2.5
              flex
              items-center
              gap-3
              rounded-[14px]
              border
              border-emerald-100
              bg-emerald-50/60
              px-3.5
              py-2.5
            "
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check size={14} strokeWidth={2.5} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium text-emerald-700">
                Location detected
              </p>

              <p className="truncate text-[13px] font-semibold text-neutral-900">
                {form.city}, {form.state}
              </p>
            </div>
          </div>
        )}

        {/* ADDRESS DETAILS */}

        <div className="mt-4">
          <label className={labelClass}>
            Address details
          </label>

          <div className="relative">
            <Home
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3.5 top-3.5 text-neutral-400"
            />

            <textarea
              rows={3}
              required
              value={form.houseDetails}
              autoComplete="street-address"
              maxLength={250}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  houseDetails: e.target.value.slice(0, 250),
                }))
              }
              placeholder="House / Flat no., building, street, area, landmark"
              className="
                min-h-[86px]
                w-full
                resize-none
                rounded-[14px]
                border
                border-neutral-200
                bg-white
                py-3
                pl-10
                pr-3
                text-[14px]
                leading-5
                text-neutral-900
                outline-none
                transition-all
                duration-200
                placeholder:text-neutral-400
                hover:border-neutral-300
                focus:border-black
                focus:ring-2
                focus:ring-black/5
              "
            />
          </div>

          {form.houseDetails.length > 0 && (
            <div className="mt-1.5 flex items-center justify-between px-0.5">
              <p className="text-[10px] text-neutral-400">
                Include house number and nearby landmark if possible.
              </p>

              <span className="text-[10px] tabular-nums text-neutral-400">
                {form.houseDetails.length}/250
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}