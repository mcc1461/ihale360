import React from "react";
import {
  Building2,
  GraduationCap,
  Bell,
  TrendingUp,
  Search,
  BookOpen,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import logo from "../assets/logo-i360.png";

function Header() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="text-white bg-primary">
        <nav className="fixed top-0 left-0 right-0 z-10 flex items-center text-white shadow-md bg-cyan-500">
          <div className="container flex items-center justify-between px-6 py-4 mx-auto">
            <div className="flex items-center space-x-2">
              <img
                src={logo}
                alt="İhale 360 logo"
                className="w-[41px] h-[41px] rounded-full"
              />
              <span className="text-2xl font-bold text-primary">İhale 360</span>
            </div>
            <div className="hidden space-x-8 font-semibold md:flex">
              <a
                href="#features"
                className="transition hover:text-primary-light"
              >
                Özellikler
              </a>
              <a
                href="#services"
                className="transition hover:text-primary-light"
              >
                Hizmetler
              </a>
              <a
                href="#contact"
                className="transition hover:text-primary-light"
              >
                İletişim
              </a>
            </div>
            <button className="px-6 py-2 font-bold transition rounded-full bg-primary-light hover:bg-opacity-90">
              <span className="px-3 py-1 bg-secondary text-primary rounded-xl">
                Giriş Yap
              </span>
            </button>
          </div>
        </nav>

        <div className="container px-6 py-24 mx-auto">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold">
              Türkiye'nin En Kapsamlı İhale Platformu
            </h1>
            <p className="mb-8 text-xl opacity-90">
              İhale süreçlerinizi profesyonelce yönetin, eğitimlerle gelişin ve
              ekonomik fırsatları yakalayın.
            </p>
            <div className="flex space-x-4">
              <button className="flex items-center px-8 py-3 font-semibold transition rounded-full bg-secondary hover:bg-opacity-90 text-primary">
                Hemen Başla <ArrowRight className="ml-2" />
              </button>
              <button className="px-8 py-3 font-semibold transition border-2 border-white rounded-full hover:bg-white hover:text-primary">
                Demo İste
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container px-6 py-20 mx-auto" id="features">
        <h2 className="mb-16 text-3xl font-bold text-center text-primary">
          Neden İhale 360?
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          <FeatureCard
            icon={<Bell className="w-8 h-8 text-primary-light" />}
            title="Anlık İhale Takibi"
            description="Türkiye genelindeki tüm ihaleleri anlık olarak takip edin ve fırsatları kaçırmayın."
          />
          <FeatureCard
            icon={<GraduationCap className="w-8 h-8 text-primary-light" />}
            title="Uzman Eğitimleri"
            description="Profesyonel eğitmenlerden ihale süreçleri hakkında detaylı eğitimler alın."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-primary-light" />}
            title="Ekonomik Analizler"
            description="Piyasa analizleri ve ekonomik göstergelerle doğru kararlar alın."
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white" id="services">
        <div className="container px-6 mx-auto">
          <h2 className="mb-16 text-3xl font-bold text-center text-primary">
            Hizmetlerimiz
          </h2>
          <div className="grid gap-12 md:grid-cols-2">
            <ServiceCard
              image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
              title="İhale Eğitimleri"
              features={[
                "Temel ihale mevzuatı",
                "İhale dosyası hazırlama",
                "Fiyat analizi ve teklif stratejileri",
                "Praktik uygulamalar",
              ]}
            />
            <ServiceCard
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              title="İhale Takip Sistemi"
              features={[
                "Kişiselleştirilmiş ihale bildirimleri",
                "Detaylı ihale analizi",
                "Rakip analizi",
                "Otomatik raporlama",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white bg-primary">
        <div className="container px-6 mx-auto text-center">
          <h2 className="mb-8 text-3xl font-bold">
            İhale süreçlerinizi profesyonelleştirin
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl opacity-90">
            Hemen üye olun ve Türkiye'nin en kapsamlı ihale platformunun
            avantajlarından yararlanmaya başlayın.
          </p>
          <button className="px-8 py-3 font-semibold transition rounded-full bg-secondary hover:bg-opacity-90 text-primary">
            Üye Ol
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white bg-primary">
        <div className="container px-6 mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex flex-col items-center mb-4 space-x-2">
                <img
                  src={logo}
                  alt="İhale 360 logo"
                  className="w-[41px] h-[41px] rounded-full"
                />
                <span className="text-2xl font-bold text-secondary">
                  İhale 360
                </span>
                <p className="text-sm opacity-80">
                  Türkiye'nin en kapsamlı ihale platformu
                </p>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-secondary">Hizmetler</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>İhale Takibi</li>
                <li>Online Eğitimler</li>
                <li>Danışmanlık</li>
                <li>Raporlama</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-secondary">Şirket</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Hakkımızda</li>
                <li>İletişim</li>
                <li>Blog</li>
                <li>Kariyer</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-secondary">İletişim</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>info@ihale360.site</li>
                <li>+90 (312) 555 00 00</li>
                <li>Ankara, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-12 text-sm text-center border-t border-white border-opacity-10 opacity-80">
            © 2024 İhale 360. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 transition bg-white shadow-lg rounded-xl hover:shadow-xl">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-4 text-xl font-semibold text-primary">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ServiceCard({ image, title, features }) {
  return (
    <div className="overflow-hidden transition shadow-lg bg-background rounded-xl hover:shadow-xl">
      <img src={image} alt={title} className="object-cover w-full h-48" />
      <div className="p-8">
        <h3 className="mb-4 text-xl font-semibold text-primary">{title}</h3>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-primary-light" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Header;
