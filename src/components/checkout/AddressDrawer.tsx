"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

type AddressDrawerProps = {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
};

export default function AddressDrawer({
    open,
    onClose,
    children,
    footer,
}: AddressDrawerProps) {
    useEffect(() => {
        if (!open) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="
fixed inset-0 z-[1000]
justify-center

lg:flex
lg:items-center
overflow-hidden
px-0 lg:px-6
pt-0 lg:py-0
pointer-events-none
"
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 pointer-events-auto"
            />

            {/* Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    paddingBottom: 0,
                }}
                className={`
pointer-events-auto
relative
flex flex-col
bg-white

w-full
sm:max-w-md
lg:max-w-lg

h-[calc(100dvh-16px)]
pb-4

lg:h-auto
lg:max-h-[82vh]

max-h-screen

fixed bottom-0
lg:rounded-[22px]
shadow-2xl
border border-neutral-200

transition-[transform,opacity]
duration-300
will-change-transform
ease-[cubic-bezier(.22,1,.36,1)]

${open ? "translate-y-0 opacity-100 scale-100" : "translate-y-full lg:translate-y-4 opacity-0 scale-[0.98]"}
`}
            >
                {/* Mobile Handle */}
                <div className="flex justify-center pt-2.5 pb-1.5 lg:hidden">
                    <div className="h-1.5 w-12 rounded-full bg-neutral-300" />
                </div>

                {/* Header */}
                <div
                    className="
sticky top-0 z-20
flex items-center justify-between

bg-white/95
supports-[backdrop-filter]:bg-white/80
backdrop-blur-xl

border-b border-neutral-100

px-4 sm:px-5
py-3.5

rounded-[24px]
lg:rounded-[22px]

fixed
bottom-0
left-0
right-0

lg:relative
"
                >
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Delivery Address
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Where should we deliver your order?
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="
group flex h-9 w-9 items-center justify-center
rounded-full bg-neutral-100
transition-all duration-200
hover:bg-neutral-900 hover:text-white
active:scale-95
"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 sm:px-4 py-3 scroll-smooth">
                    {children}
                </div>

                {/* Always-visible footer, outside the scroll area */}
                {footer && (
                    <div
                        className="
shrink-0

border-t
border-neutral-200

bg-white

rounded-b-[24px]
lg:rounded-b-[22px]

px-4
sm:px-5

pt-3
pb-3
">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}