"use client";

import { Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { useRef } from "react";

type ProductType = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    variants: true;
  };
}>;

export default function AddToCartButton({ product }: { product: ProductType }) {
  const cart = useCart();
  const { toggleItem, items: wishlistItems } = useWishlist();

  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const router = useRouter();
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"cart" | "buy" | null>(null);
  const [drawerSize, setDrawerSize] = useState("");
  const actionButtonsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;

        // Buttons screen ke niche hain -> sticky dikhao
        if (rect.top > window.innerHeight) {
          setShowSticky(true);
        }
        // Buttons screen me aa gaye -> sticky hide
        else {
          setShowSticky(false);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (actionButtonsRef.current) {
      observer.observe(actionButtonsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!mounted || !product) return null;

  const variants = product.variants;

  const selectedVariant = variants.find((v: any) => v.size === selectedSize);

  const stock = selectedVariant?.stock ?? 0;

  const isOutOfStock = variants.every((v: any) => v.stock === 0);

  const isLowStock = stock > 0 && stock <= 5;

  const currentItem = cart.items.find(
    (item: any) => item.id === product.id && item.size === selectedSize,
  );

  const currentQty = currentItem?.quantity ?? 0;

  const isLiked = wishlistItems.some((item: any) => item.id === product.id);

  const addToCart = (size: string) => {
    const variant = variants.find((v: any) => v.size === size);

    if (!variant) return;

    const stock = variant.stock;

    const currentItem = cart.items.find(
      (item: any) =>
        item.id === product.id &&
        item.size === size
    );

    const currentQty = currentItem?.quantity ?? 0;

    if (currentQty >= stock) {
      alert(`Only ${stock} item(s) available.`);
      return;
    }

    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "",
      size,
      color: product.color || "",
      category: product.category?.name || "",
      stock,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const buyNow = (size: string) => {
    const variant = variants.find((v: any) => v.size === size);

    if (!variant) return;

    const stock = variant.stock;

    const alreadyItem = cart.items.find(
      (item: any) =>
        item.id === product.id &&
        item.size === size
    );

    if (alreadyItem && alreadyItem.quantity >= stock) {
      alert(`Only ${stock} item(s) available.`);
      return;
    }

    if (!alreadyItem) {
      cart.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "",
        size,
        color: product.color || "",
        category: product.category?.name || "",
        stock,
      });
    }

    router.push("/checkout");
  };

  const handleAdd = () => {
    if (added) return;

    if (!selectedSize) {
      setPendingAction("cart");
      setDrawerSize(selectedSize);
      setIsSizeDrawerOpen(true);
      return;
    }

    if (isOutOfStock) {
      alert("This product is currently out of stock.");
      return;
    }

    addToCart(selectedSize);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setPendingAction("buy");
      setDrawerSize(selectedSize);
      setIsSizeDrawerOpen(true);
      return;
    }

    if (isOutOfStock) {
      alert("This product is currently out of stock.");
      return;
    }

    buyNow(selectedSize);
  };

  const handleSizeSelect = (size: string) => {
    setDrawerSize(size);
  };

  const handleDrawerContinue = () => {
    if (!drawerSize) return;

    setSelectedSize(drawerSize);

    setIsSizeDrawerOpen(false);

    if (pendingAction === "cart") {
      addToCart(drawerSize);
    }

    if (pendingAction === "buy") {
      buyNow(drawerSize);
    }

    setDrawerSize("");
    setPendingAction(null);
  };



  return (
    <div className="flex flex-col gap-5">
      {/* Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Select Size
          </p>



          {isOutOfStock ? (
            <span className="text-[10px] font-bold uppercase text-red-500">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-bold uppercase text-amber-600">
              Only {stock} Left
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase text-emerald-600">
              In Stock
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
          {variants.map((variant: any) => (
            <button
              key={variant.size}
              type="button"
              disabled={variant.stock === 0}
              onClick={() => setSelectedSize(variant.size)}
              className={`h-12 md:h-11 rounded-xl border-2 text-[13px] md:text-sm font-medium transition-all
              ${selectedSize === variant.size
                  ? "bg-black text-white border-black"
                  : "bg-white border-gray-200 hover:border-black"
                }
              ${variant.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}
              `}
            >
              {variant.size}
            </button>
          ))}
        </div>

        {isLowStock && (
          <p className="mt-2 text-[11px] text-amber-600 font-semibold">
            Hurry! Only {stock} piece{stock > 1 ? "s" : ""} left.
          </p>
        )}
      </div>

      <div
        ref={actionButtonsRef}
        className="flex flex-col gap-3"
      >
        <div
          className="grid grid-cols-[1fr_1fr_48px]
sm:grid-cols-[1fr_1fr_56px]
md:grid-cols-[1fr_1fr_60px] gap-3"
        >
          {/* Add To Cart */}

          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock || added}
            className="
      h-11
      rounded-full
      border
      border-neutral-900
      bg-white
      text-neutral-900
      text-[11px]
sm:text-[13px]
md:text-sm
font-semibold
tracking-[0.12em]
uppercase
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:shadow-lg
      active:translate-y-0
      disabled:border-neutral-300
      disabled:bg-neutral-100
      disabled:text-neutral-400
      disabled:shadow-none
      disabled:cursor-not-allowed
      "
          >
            {isOutOfStock ? "OUT OF STOCK" : added ? "✓ ADDED" : "ADD TO CART"}
          </button>

          {/* Buy Now */}

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="
      h-11
      rounded-full
      bg-neutral-900
      text-white
      text-[11px]
sm:text-[13px]
md:text-sm
font-semibold
tracking-[0.12em]
uppercase
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:bg-neutral-800
      hover:shadow-xl
      active:translate-y-0
      disabled:bg-neutral-300
      disabled:text-neutral-100
      disabled:shadow-none
      disabled:cursor-not-allowed
      "
          >
            BUY NOW
          </button>

          {/* Wishlist */}

          <button
            type="button"
            onClick={() => toggleItem(product)}
            className={`
      h-12
      w-12
      sm:h-11 sm:w-14
      rounded-full
      border
      flex
      items-center
      justify-center
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:shadow-lg
      ${isLiked ? "border-red-200 bg-red-50" : "border-neutral-300 bg-white"}
      `}
          >
            <Heart
              size={20}
              className={
                isLiked ? "fill-red-500 text-red-500" : "text-neutral-700"
              }
            />
          </button>
        </div>
      </div>
      {/* Mobile Sticky Actions */}

      <div
        className={`
md:hidden
fixed
bottom-0
left-0
right-0
z-[100]
transition-all
duration-300
${showSticky
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
          }
`}
      >
        <div
          className="
border-t
bg-white/95
backdrop-blur-xl
px-3
pt-2
pb-[calc(.75rem+env(safe-area-inset-bottom))]
shadow-2xl
"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1" />

            {selectedSize && (
              <span className="text-xs font-medium bg-black text-white rounded-full px-3 py-1">
                {selectedSize}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 items-start">
            <button
              onClick={handleAdd}
              disabled={isOutOfStock || added}
              className="h-10 rounded-full border border-black text-xs font-medium uppercase"
            >
              {isOutOfStock
                ? "Out of Stock"
                : added
                  ? "✓ Added"
                  : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="h-10 rounded-full bg-black text-white text-xs font-medium uppercase"
            >
              Buy Now
            </button>

            <p className="mt-1 text-center text-[10px] font-bold text-neutral-900">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="text-center text-[8px] uppercase tracking-wider text-gray-400">
              Inclusive of all taxes
            </p>
          </div>
        </div>
      </div>
      <>
        {/* Backdrop */}
        <div
          onClick={() => {
            setDrawerSize("");
            setPendingAction(null);
            setIsSizeDrawerOpen(false);
          }}
          className={`
fixed inset-0 z-[110]
bg-black/40
backdrop-blur-[2px]
transition-opacity duration-300
${isSizeDrawerOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
            }
`}
        />

        {/* Drawer */}
        <div
          className={`
fixed
left-0
right-0
bottom-0
z-[111]
rounded-t-[24px]
bg-white
transition-transform
duration-300
ease-[cubic-bezier(.22,1,.36,1)]
${isSizeDrawerOpen
              ? "translate-y-0"
              : "translate-y-full"
            }
`}
        >
          <div className="pb-[calc(16px+env(safe-area-inset-bottom))]">

            {/* Handle */}

            <div className="flex justify-center pt-2">
              <div className="h-1.5 w-12 rounded-full bg-neutral-300" />
            </div>

            {/* Header */}

            <div className="flex items-center justify-between px-5 mt-3">

              <div>

                <h2 className="text-lg font-semibold">
                  Select Size
                </h2>

                <p className="mt-1 text-xs text-neutral-500">
                  Choose your preferred size
                </p>

              </div>

              <button
                onClick={() => {
                  setDrawerSize("");
                  setPendingAction(null);
                  setIsSizeDrawerOpen(false);
                }}
                className="text-3xl leading-none text-neutral-500"
              >
                ×
              </button>

            </div>

            {/* Product */}

            <div className="flex gap-4 px-5 mt-4">

              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div className="flex-1">

                <p className="text-sm font-medium line-clamp-2">
                  {product.name}
                </p>

                <p className="mt-1 text-lg font-semibold">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

              </div>

            </div>

            {/* Sizes */}

            <div className="grid grid-cols-4 gap-3 px-5 mt-5">

              {variants.map((variant: any) => {

                const active = drawerSize === variant.size;

                return (
                  <button
                    key={variant.size}
                    disabled={variant.stock === 0}
                    onClick={() => handleSizeSelect(variant.size)}
                    className={`
h-11
rounded-xl
border-2
font-medium
transition-all
duration-200

${active
                        ? "bg-black text-white border-black scale-95"
                        : "bg-white border-neutral-200"
                      }

${variant.stock === 0
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-black"
                      }
`}
                  >
                    {variant.size}
                  </button>
                );

              })}

            </div>

            {/* Continue */}

            <div className="px-5 mt-5">

              <button
                disabled={!drawerSize}
                onClick={handleDrawerContinue}
                className={`
h-11
w-full
rounded-full
font-medium
uppercase
transition-all
duration-300

${drawerSize
                    ? "bg-black text-white"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  }
`}
              >
                Continue
              </button>

            </div>

          </div>
        </div>
      </>
    </div>
  );
}
