import Link from "next/link"
import { ArrowRight, Baby, Backpack, Crown, Footprints, Gift, Heart, PartyPopper, Shirt, Sparkles, Star } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type AgeGroup = {
    age: string
    subtitle: string
    icon: LucideIcon
    iconClassName: string
}

const ageGroups: AgeGroup[] = [
    { age: "0-1Y", subtitle: "Newborn", icon: Baby, iconClassName: "bg-orange-100/70 text-orange-600" },
    { age: "1-2Y", subtitle: "Tiny Explorer", icon: Footprints, iconClassName: "bg-sky-50 text-sky-600" },
    { age: "2-3Y", subtitle: "Play Time", icon: PartyPopper, iconClassName: "bg-pink-50 text-pink-600" },
    { age: "3-4Y", subtitle: "Growing Kids", icon: Heart, iconClassName: "bg-emerald-50 text-emerald-600" },
    { age: "4-5Y", subtitle: "Little Champs", icon: Star, iconClassName: "bg-purple-50 text-purple-600" },
    { age: "5-6Y", subtitle: "Adventure Time", icon: Gift, iconClassName: "bg-amber-50 text-amber-600" },
    { age: "6-7Y", subtitle: "Active Kids", icon: Shirt, iconClassName: "bg-cyan-50 text-cyan-600" },
    { age: "7-8Y", subtitle: "Smart Choice", icon: Backpack, iconClassName: "bg-rose-50 text-rose-600" },
    { age: "8-9Y", subtitle: "Everyday Style", icon: Sparkles, iconClassName: "bg-lime-50 text-lime-700" },
    { age: "9-10Y", subtitle: "Junior Trend", icon: Crown, iconClassName: "bg-indigo-50 text-indigo-600" },
    { age: "10-11Y", subtitle: "Classic Wear", icon: Star, iconClassName: "bg-yellow-50 text-yellow-700" },
    { age: "11-12Y", subtitle: "Young Fashion", icon: Shirt, iconClassName: "bg-slate-100 text-slate-600" },
]

export default function ShopByAge() {
    return (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Explore</p>
                        <h2 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">Shop By Age</h2>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500 sm:text-base">Find the perfect outfits for every growing stage.</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 md:gap-4 lg:gap-5">
                    {ageGroups.map(({ age, subtitle, icon: Icon, iconClassName }) => (
                        <Link key={age} href={`/shop?age=${age}`} className="group flex h-full min-w-0 flex-col items-center justify-center text-center rounded-3xl border border-neutral-100 bg-white p-3 md:p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-neutral-300 hover:shadow-2xl">
                            <div
                                className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${iconClassName}`}
                            >
                                <Icon size={18} className="md:h-6 md:w-6" strokeWidth={1.8} />
                            </div>
                            <h3 className="mt-3 text-sm md:text-lg font-black tracking-tight text-neutral-950">{age}</h3>
                            <p className="mt-1 text-[10px] md:text-xs text-neutral-500">{subtitle}</p>
                            <span className="mt-3 inline-flex items-center gap-1 text-[9px] md:text-[11px] font-black uppercase tracking-wide text-neutral-900 transition-transform duration-300 group-hover:translate-x-1">
                                Shop Now
                                <ArrowRight size={13} />
                            </span>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    )
}