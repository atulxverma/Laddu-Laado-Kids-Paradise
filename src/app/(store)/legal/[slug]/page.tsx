import { notFound } from "next/navigation"

const policies: any = {
  "privacy-policy": { title: "Privacy Policy", content: "Your privacy is our priority. We collect only necessary data to process your orders..." },
  "terms-conditions": { title: "Terms & Conditions", content: "By using our site, you agree to follow our store rules..." },
  "refund-policy": { title: "Refund & Cancellation", content: "7-day easy return policy for all unworn clothes..." }
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const policy = policies[slug]
  if (!policy) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-32">
      <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-10">{policy.title}</h1>
      <div className="prose prose-sm font-medium text-gray-600 leading-loose">
        {policy.content}
        <p className="mt-10 italic">Last updated: Oct 2024</p>
      </div>
    </main>
  )
}