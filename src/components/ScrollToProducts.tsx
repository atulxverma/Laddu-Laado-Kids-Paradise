"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToProducts() {
  const params = useSearchParams();

  useEffect(() => {
    const el = document.getElementById("products");

    if (!el) return;

    requestAnimationFrame(() => {
      const y =
        el.getBoundingClientRect().top +
        window.scrollY -
        180; 

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    });
  }, [params]);

  return null;
}