import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>

        <p className="mt-5 text-neutral-600 leading-8">
          At <strong>Laddoo Laado</strong>, your privacy is important to us.
          This Privacy Policy explains how we collect, use, protect, and
          disclose your personal information when you visit our website or
          purchase products from us.
        </p>

        <div className="mt-14 space-y-12">

          <section>
            <h2 className="text-2xl font-black">
              Information We Collect
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              We may collect personal information including your name,
              email address, phone number, shipping address,
              billing address, and payment related information whenever
              you place an order, create an account, contact us,
              or subscribe to our updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              How We Use Your Information
            </h2>

            <ul className="mt-5 list-disc space-y-2 pl-6 text-neutral-600">
              <li>Process and deliver your orders.</li>
              <li>Provide customer support.</li>
              <li>Improve our products and website.</li>
              <li>Send order confirmations and updates.</li>
              <li>Share promotional offers only if you choose to receive them.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              Cookies
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              Laddoo Laado uses cookies to improve your browsing experience,
              remember your preferences, and understand how visitors interact
              with our website. You may disable cookies from your browser,
              although some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              Sharing Your Information
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              We never sell your personal information.
              Your information may only be shared with trusted partners such as
              payment gateways, shipping providers, or service providers
              required to complete your order and operate our business.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              Data Security
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              We implement reasonable security measures to protect your
              information from unauthorized access, disclosure,
              or misuse. However, no internet transmission or storage
              system can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              Your Rights
            </h2>

            <ul className="mt-5 list-disc space-y-2 pl-6 text-neutral-600">
              <li>Access your personal information.</li>
              <li>Request corrections to inaccurate information.</li>
              <li>Request deletion of your data where applicable.</li>
              <li>Withdraw marketing consent at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              Children's Privacy
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              Our products are designed for children, but purchases must
              be made by parents or guardians. We do not knowingly collect
              personal information directly from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              Third-Party Services
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              Our website may use trusted third-party services such as
              payment providers, shipping partners, analytics,
              and cloud hosting services. These providers process data only
              as necessary to perform their services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              Changes to This Policy
            </h2>

            <p className="mt-4 text-neutral-600 leading-8">
              We may update this Privacy Policy from time to time.
              Any changes will be published on this page with the
              revised effective date.
            </p>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8">
            <h2 className="text-2xl font-black">
              Contact Us
            </h2>

            <p className="mt-4 text-neutral-600">
              If you have any questions regarding this Privacy Policy,
              feel free to contact us.
            </p>

            <div className="mt-6 space-y-3 text-sm">
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
  )
}