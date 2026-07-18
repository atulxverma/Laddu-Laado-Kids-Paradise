"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactUs() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-pink-600">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about an
            order, products, or anything else, our team is ready to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Send us a Message
            </h2>

            <form className="space-y-5">

              <div>
                <label className="block mb-2 font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Message
                </label>

                <textarea
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
              >
                Send Message
              </button>

            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">

            <div className="bg-pink-50 rounded-2xl p-6 shadow">

              <div className="flex items-center gap-4">
                <Mail className="text-pink-600" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">
                    support@laddoolaado.com
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
                    +91 98765 43210
                  </p>
                </div>
              </div>

            </div>

            <div className="bg-pink-50 rounded-2xl p-6 shadow">

              <div className="flex items-center gap-4">
                <MapPin className="text-pink-600" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">
                    Moradabad, Uttar Pradesh, India
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
                    9:00 AM - 7:00 PM
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}