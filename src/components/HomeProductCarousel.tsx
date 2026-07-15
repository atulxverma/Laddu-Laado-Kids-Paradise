"use client"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import ProductCard from "./ProductCard"

export default function HomeProductCarousel({
  products,
}: {
  products: any[]
}) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 2.15,
      spacing: 16,
    },
    breakpoints: {
      "(min-width:768px)": {
        slides: {
          perView: 4,
          spacing: 24,
        },
      },
    },
  })

  return (
    <div ref={sliderRef} className="keen-slider">

      {products.map((product) => (
        <div
          key={product.id}
          className="keen-slider__slide"
        >
          <ProductCard product={product} />
        </div>
      ))}

    </div>
  )
}