"use client";

import {
    Building2,
    Home,
    Landmark,
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
    handlePincodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AddressForm({
    form,
    setForm,
    locating,
    detectLocation,
    pincodeLoading,
    handlePincodeChange,
}: AddressFormProps) {
    return (
        <div className="space-y-2.5">
            {/* Live Location Card */}
            <div className="rounded-[18px]
border
border-neutral-200
bg-neutral-50
p-3 from-sky-50 via-blue-50 to-indigo-50 p-3">
                <button
                    type="button"
                    onClick={detectLocation}
                    disabled={locating}
                    className="
h-12
w-full

flex
items-center
justify-center
gap-2

rounded-xl

border
border-neutral-200

bg-white

text-sm
font-medium
text-neutral-900

transition

hover:bg-neutral-50
hover:border-neutral-300

active:scale-[0.99]
"
                >
                    <Navigation
                        size={16}
                        className={locating ? "animate-spin" : ""}
                    />

                    {locating
                        ? "Detecting..."
                        : "Use Current Location"}
                </button>
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                    We'll auto-fill your city and state.
                </p>
            </div>

            {/* Contact Section */}
            <section className="rounded-[18px] border border-neutral-200 bg-white p-3.5 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-900">Contact Details</h3>

                <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-[11px]
tracking-wide
uppercase font-semibold text-neutral-600">
                            Full Name
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                value={form.name}
                                required
                                maxLength={60}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        name: e.target.value.replace(/\s+/g, " ").slice(0, 60),
                                    }))
                                }
                                placeholder="Enter your full name"
                                className="h-[42px] w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-3 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-neutral-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px]
tracking-wide
uppercase font-semibold text-neutral-600">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                value={form.phone}
                                type="tel"
                                inputMode="numeric"
                                required
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                                    }))
                                }
                                placeholder="Enter your phone number"
                                className="h-[42px] w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-3 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-neutral-200"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Address Section */}
            <section className="rounded-[18px] border border-neutral-200 bg-white p-3.5 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-900">Delivery Address</h3>

                <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-[11px]
tracking-wide
uppercase font-semibold text-neutral-600">
                            Pincode
                        </label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                value={form.pincode}
                                type="text"
                                inputMode="numeric"
                                required
                                maxLength={6}
                                onChange={handlePincodeChange}
                                placeholder="6 Digit PIN"
                                className="h-[42px] w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-10 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-neutral-200"
                            />
                            {pincodeLoading && (
                                <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px]
tracking-wide
uppercase font-semibold text-neutral-600">
                            City
                        </label>
                        <div className="relative">
                            <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                readOnly
                                required
                                value={form.city}
                                placeholder="City"
                                className="h-[42px] w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-3 text-sm text-neutral-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px]
tracking-wide
uppercase font-semibold text-neutral-600">
                            State
                        </label>
                        <div className="relative">
                            <Landmark size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                readOnly
                                value={form.state}
                                placeholder="State"
                                className="h-[42px] w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-3 text-sm text-neutral-700"
                            />
                        </div>
                    </div>

                    <div className="hidden sm:block" />
                </div>

                <div className="mt-2">
                    <label className="mb-1.5 block text-[11px]
tracking-wide
uppercase font-semibold text-neutral-600">
                        House / Flat / Building / Landmark
                    </label>
                    <div className="relative">
                        <Home size={16} className="absolute left-3 top-3.5 text-neutral-400" />
                        <textarea
                            rows={2}
                            required
                            value={form.houseDetails}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    houseDetails: e.target.value.slice(0, 250),
                                }))
                            }
                            placeholder="Flat No., Building Name, Street, Area, Landmark..."
                            className="w-full resize-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-neutral-200"
                        />
                        <div className="mt-1 flex justify-end text-[11px] text-neutral-400">
                            {form.houseDetails.length}/250
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}