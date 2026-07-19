import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function RefundPolicy() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
<Link
  href="/"
  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:-translate-x-1 hover:border-black hover:text-black"
>
  <ArrowLeft size={16} />
  Back to Home
</Link>
        <p className="pt-4 text-[11px] font-black uppercase tracking-[0.25em] text-neutral-400">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Refund Policy
        </h1>

        <p className="mt-5 text-neutral-600 leading-8">
          At <strong>Laddoo Laado</strong>, customer satisfaction is our
          priority. If you receive a damaged, defective or incorrect product,
          we're here to help. Please read our refund policy carefully before
          requesting a return.
        </p>

        <div className="mt-14 space-y-12">

          {/* Return Eligibility */}

          <section>
            <h2 className="text-2xl font-black">
              Return Eligibility
            </h2>

            <ul className="mt-5 list-disc pl-6 space-y-3 text-neutral-600 leading-7">
              <li>Return requests must be raised within <strong>7 days</strong> of delivery.</li>
              <li>The product must be unused, unwashed and in its original condition.</li>
              <li>All original tags, labels and packaging should be intact.</li>
              <li>Products that are damaged due to customer misuse are not eligible for refund.</li>
            </ul>
          </section>

          {/* Return Process */}

          <section>
            <h2 className="text-2xl font-black">
              Return Process
            </h2>

            <div className="mt-6 space-y-4">

              <div className="rounded-2xl border border-neutral-200 p-5">
                <strong>Step 1</strong>
                <p className="mt-2 text-neutral-600">
                  Contact our customer support team and share your order details.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-5">
                <strong>Step 2</strong>
                <p className="mt-2 text-neutral-600">
                  Pack the product securely in its original packaging.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-5">
                <strong>Step 3</strong>
                <p className="mt-2 text-neutral-600">
                  Ship the parcel to our return address mentioned below.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-5">
                <strong>Step 4</strong>
                <p className="mt-2 text-neutral-600">
                  Once we receive and inspect the product, your refund will be processed.
                </p>
              </div>

            </div>
          </section>

          {/* Refund Timeline */}

          <section>
            <h2 className="text-2xl font-black">
              Refund Timeline
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              After the returned product is received and successfully inspected,
              refunds are generally processed within <strong>2–5 business days</strong>.
              The refund will be credited through the original payment method
              or any other approved refund method.
            </p>
          </section>

          {/* Exchange */}

          <section>
            <h2 className="text-2xl font-black">
              Exchange Policy
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              Currently, Laddoo Laado does not provide product exchange services.
              Customers may request a refund if their order satisfies our return eligibility criteria.
            </p>
          </section>

          {/* Non Refundable */}

          <section>
            <h2 className="text-2xl font-black">
              Non-Refundable Items
            </h2>

            <ul className="mt-5 list-disc pl-6 space-y-3 text-neutral-600">
              <li>Products purchased during special sale or clearance events.</li>
              <li>Personalized or customised products.</li>
              <li>Products returned without original packaging or tags.</li>
              <li>Used, washed or damaged products.</li>
            </ul>
          </section>

          {/* Damaged Products */}

          <section>
            <h2 className="text-2xl font-black">
              Damaged or Incorrect Products
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              If you receive a damaged, defective or incorrect item,
              please contact us immediately with clear product images and a
              parcel opening video. This helps us investigate and resolve
              your issue as quickly as possible.
            </p>
          </section>

          {/* Cancellation */}

          <section>
            <h2 className="text-2xl font-black">
              Order Cancellation
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              Orders may only be cancelled before they have been dispatched.
              Once shipped, cancellation requests cannot be guaranteed.
            </p>
          </section>

          {/* Return Address */}

          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8">

            <h2 className="text-2xl font-black">
              Return Address
            </h2>

            <div className="mt-5 space-y-2 text-neutral-600">

              <p><strong>Laddoo Laado</strong></p>

              <p>{siteConfig.address}</p>

            </div>

          </section>

          {/* Contact */}

          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8">

            <h2 className="text-2xl font-black">
              Need Help?
            </h2>

            <p className="mt-4 text-neutral-600">
              If you have any questions regarding returns or refunds,
              feel free to contact our support team.
            </p>

            <div className="mt-6 space-y-3">

              <p>
                <strong>Email:</strong> {siteConfig.email}
              </p>

              <p>
                <strong>Phone:</strong> {siteConfig.phone}
              </p>

              <p>
                <strong>Support Hours:</strong> {siteConfig.businessHours}
              </p>

            </div>

          </section>

        </div>

      </section>
    </main>
  );
}