"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToProducts() {
  const params = useSearchParams();

  useEffect(() => {
    const el = document.getElementById("products");

    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

  }, [params]);

  return null;
}