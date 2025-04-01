import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageSquare,
  QrCode,
} from "lucide-react";

export default function Contact() {
  const [showQR, setShowQR] = useState(false);
  const address = "Mustafa Kemal Mah. 2157. Sk. No: 13/11 Çankaya / ANKARA";
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  const socialLinks = [
    {
      icon: Facebook,
      url: "https://facebook.com/ihale360",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      url: "https://twitter.com/ihale360",
      color: "hover:text-blue-400",
    },
    {
      icon: Instagram,
      url: "https://instagram.com/ihale360",
      color: "hover:text-pink-600",
    },
    {
      icon: Linkedin,
      url: "https://linkedin.com/company/ihale360",
      color: "hover:text-blue-700",
    },
    {
      icon: Youtube,
      url: "https://youtube.com/ihale360",
      color: "hover:text-red-600",
    },
  ];

  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="container px-6 mx-auto">
        <h1 className="mb-16 text-4xl font-bold text-center text-primary">
          İletişim
        </h1>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="p-8 bg-white border-4 shadow-lg rounded-xl border-primary">
            <h2 className="mb-6 text-2xl font-semibold text-primary">
              İletişim Bilgileri
            </h2>

            <div className="space-y-6">
              {/* Telephone */}
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-primary-light" />
                <div>
                  <p className="font-medium">Telefon</p>
                  <a
                    href="tel:+903122194980"
                    className="text-gray-600 transition hover:text-primary-light"
                  >
                    +90 312 219 49 80
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-primary-light" />
                <div>
                  <p className="font-medium">E-posta</p>
                  <a
                    href="mailto:mcoskuncelebi@gmail.com"
                    className="text-gray-600 transition hover:text-primary-light"
                  >
                    mcoskuncelebi@gmail.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <MapPin className="flex-shrink-0 w-6 h-6 text-primary-light" />
                <div>
                  <p className="font-medium">Adres</p>
                  <p className="text-gray-600">{address}</p>
                  <div className="flex mt-2 space-x-4">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center transition text-primary-light hover:text-primary"
                    >
                      Google Maps'te Aç
                    </a>
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="flex items-center transition text-primary-light hover:text-primary"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      QR Kod
                    </button>
                  </div>
                  {showQR && (
                    <div className="inline-block p-4 mt-4 bg-white rounded-lg shadow-md">
                      <QRCodeSVG value={mapUrl} size={128} />
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6">
                <p className="mb-4 font-medium">Sosyal Medya</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} transition`}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Additional Mobile QR Code */}
              <div className="block pt-6 md:hidden">
                <p className="mb-2 font-medium text-primary">
                  Haritaya Git için Mobil QR Kod
                </p>
                <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                  <QRCodeSVG value={mapUrl} size={128} />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 bg-white border-4 shadow-lg rounded-xl border-primary">
            <h2 className="mb-6 text-2xl font-semibold text-primary">
              Bize Ulaşın
            </h2>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                ></textarea>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex items-center justify-center flex-1 px-6 py-2 text-white transition rounded-lg bg-primary hover:bg-opacity-90"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Mesaj Gönder
                </button>
                <a
                  href="https://wa.me/903122194980"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center flex-1 px-6 py-2 text-white transition bg-green-500 rounded-lg hover:bg-opacity-90"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  WhatsApp
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 rounded-xl overflow-hidden shadow-lg h-[400px] border-4 border-primary w-[90%] mx-auto">
          <iframe
            src="https://www.google.com/maps?q=Mustafa%20Kemal%20Mah.%202157.%20Sk.%20No:%2013/11%20%C3%87ankaya%20/%20ANKARA&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
