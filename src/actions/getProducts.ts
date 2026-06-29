"use server"; // 👈 Yeh likhna bohot zaroori hai, taaki yeh code sirf server par chale

import { db } from "@/lib/db";

export async function getProducts() {
  const products = await db.product.findMany();
  return products;
}