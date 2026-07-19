import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function TermsAndConditions() {
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
          Terms & Conditions
        </h1>

        <p className="mt-5 leading-8 text-neutral-600">
          Welcome to <strong>Laddoo Laado</strong>. By accessing or using our
          website, you agree to comply with and be bound by these Terms &
          Conditions. Please read them carefully before placing an order or
          using any of our services.
        </p>

        <div className="mt-14 space-y-12">

          {/* Eligibility */}

          <section>
            <h2 className="text-2xl font-black">
              Eligibility
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              By using this website, you confirm that you are at least 18 years
              old or are accessing the website under the supervision of a parent
              or legal guardian.
            </p>
          </section>

          {/* Orders */}

          <section>
            <h2 className="text-2xl font-black">
              Orders
            </h2>

            <ul className="mt-5 list-disc space-y-3 pl-6 text-neutral-600 leading-7">
              <li>All orders are subject to product availability.</li>
              <li>We reserve the right to cancel or refuse any order.</li>
              <li>Customers must provide accurate shipping information.</li>
              <li>Incorrect details may delay delivery.</li>
            </ul>
          </section>

          {/* Pricing */}

          <section>
            <h2 className="text-2xl font-black">
              Pricing & Payments
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              All prices displayed on our website are in Indian Rupees (INR).
              Prices may change without prior notice. Payments must be completed
              using one of our supported payment methods before order
              processing begins.
            </p>
          </section>

          {/* Shipping */}

          <section>
            <h2 className="text-2xl font-black">
              Shipping & Delivery
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              Estimated delivery timelines are provided for convenience only.
              Actual delivery may vary depending on location, courier service,
              weather conditions or other unforeseen circumstances.
            </p>
          </section>

          {/* Returns */}

          <section>
            <h2 className="text-2xl font-black">
              Returns & Refunds
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              Returns and refunds are governed by our Refund Policy. Please
              review that page before requesting a return or refund.
            </p>
          </section>

          {/* Product */}

          <section>
            <h2 className="text-2xl font-black">
              Product Information
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              We make every effort to display product images, colors and
              descriptions accurately. However, actual product colors may vary
              slightly due to lighting conditions or display settings.
            </p>
          </section>

          {/* Intellectual */}

          <section>
            <h2 className="text-2xl font-black">
              Intellectual Property
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              All content available on this website including logos, graphics,
              product images, text, icons and website design is the property of
              Laddoo Laado and may not be copied, reproduced or distributed
              without prior written permission.
            </p>
          </section>

          {/* User */}

          <section>
            <h2 className="text-2xl font-black">
              User Responsibilities
            </h2>

            <ul className="mt-5 list-disc space-y-3 pl-6 text-neutral-600 leading-7">
              <li>Provide accurate information.</li>
              <li>Do not misuse the website.</li>
              <li>Do not attempt unauthorized access.</li>
              <li>Comply with all applicable laws while using our services.</li>
            </ul>
          </section>

          {/* Liability */}

          <section>
            <h2 className="text-2xl font-black">
              Limitation of Liability
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              Laddoo Laado shall not be liable for indirect, incidental or
              consequential damages arising from the use of our website,
              products or services, except where required by applicable law.
            </p>
          </section>

          {/* Privacy */}

          <section>
            <h2 className="text-2xl font-black">
              Privacy
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              Your personal information is handled in accordance with our
              Privacy Policy. By using our website, you consent to the
              collection and use of information as described there.
            </p>
          </section>

          {/* Changes */}

          <section>
            <h2 className="text-2xl font-black">
              Changes to These Terms
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              We reserve the right to modify these Terms & Conditions at any
              time without prior notice. Continued use of the website after any
              updates constitutes your acceptance of the revised terms.
            </p>
          </section>

          {/* Governing */}

          <section>
            <h2 className="text-2xl font-black">
              Governing Law
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              These Terms & Conditions shall be governed by and interpreted in
              accordance with the laws of India. Any disputes shall be subject
              to the jurisdiction of the competent courts.
            </p>
          </section>

          {/* Contact */}

          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8">

            <h2 className="text-2xl font-black">
              Contact Us
            </h2>

            <p className="mt-4 text-neutral-600">
              If you have any questions regarding these Terms & Conditions,
              please feel free to contact us.
            </p>

            <div className="mt-6 space-y-3">

              <p>
                <strong>Email:</strong> {siteConfig.email}
              </p>

              <p>
                <strong>Phone:</strong> {siteConfig.phone}
              </p>

              <p>
                <strong>Address:</strong> {siteConfig.address}
              </p>

            </div>

          </section>

        </div>

      </section>
    </main>
  );
}