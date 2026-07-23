"use client";

import { siteConfig } from "@/lib/site";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendContactMessage } from "@/lib/actions";


export default function ContactUs() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const router = useRouter();
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setLoading(true);
  setStatus("");

  try {
    const res = await sendContactMessage({
      name,
      email,
      subject,
      message,
    });

    if (res.success) {
      setStatus("✅ Message sent successfully.");

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      setStatus(res.error || "Something went wrong.");
    }
  } catch {
    setStatus("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

    return (
        <form onSubmit={handleSubmit}>
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="relative mb-12">

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm hover:bg-pink-50"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="text-center px-12">
                            <h1 className="text-3xl md:text-4xl font-bold text-pink-600">
                                Contact Us
                            </h1>

                            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                                We'd love to hear from you. Whether you have a question about an
                                order, products, or anything else, our team is ready to help.
                            </p>
                        </div>

                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">

                        {/* Contact Form */}
                        <div className="bg-gray-50 rounded-2xl shadow-md p-8">

                            <h2 className="text-2xl font-semibold mb-6">
                                Send us a Message
                            </h2>

                            <div className="space-y-5">

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Subject
                                    </label>

                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Subject"
                                        required
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Message
                                    </label>

                                    <textarea
                                        rows={6}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your message..."
                                        required
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                                {status && (
                                    <p
                                        className={`mt-3 text-center text-sm ${status.includes("successfully")
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        {status}
                                    </p>
                                )}

                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">

                            <div className="bg-pink-50 rounded-2xl p-6 shadow">

                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center">
                                        <Mail className="h-6 w-6 text-pink-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <p className="text-gray-600">
                                            {siteConfig.email}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="bg-pink-50 rounded-2xl p-6 shadow">

                                <div className="flex items-center gap-4">
                                    <Phone className="text-pink-600" />
                                    <div>
                                        <h3 className="font-semibold">Phone</h3>
                                        <p className="text-gray-600">
                                            {siteConfig.phone}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="bg-pink-50 rounded-2xl p-6 shadow">

                                <div className="flex items-center gap-4">
                                    <MapPin size={24} className="text-pink-600 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold">Address</h3>
                                        <p className="text-gray-600">
                                            {siteConfig.address}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="bg-pink-50 rounded-2xl p-6 shadow">

                                <div className="flex items-center gap-4">
                                    <Clock className="text-pink-600" />
                                    <div>
                                        <h3 className="font-semibold">
                                            Business Hours
                                        </h3>
                                        <p className="text-gray-600">
                                            Monday - Saturday
                                        </p>
                                        <p className="text-gray-600">
                                            {siteConfig.businessHours}
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>
        </form>
    );
}