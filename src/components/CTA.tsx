import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { CTASection } from "@/types/content";
import { useState } from "react";

interface CTAProps {
  previewData?: CTASection | null;
}

const CTA = ({ previewData }: CTAProps) => {
  const { data } = useContent();
  const ctaData = (previewData || data?.cta || {}) as Partial<CTASection>;
  
  const whatsappLink = ctaData.cta_whatsapp?.link || "https://wa.me/6285646420488?text=Halo,%20saya%20tertarik%20dengan%20layanan%20Praktisi%20Mengajar";
  const primaryCta = ctaData.cta_primary || { text: "Ajukan Praktisi Mengajar", link: "#form" };
  const contactInfo = ctaData.contact_info || {
    phone: "+62 856-4642-0488",
    email: "info@praktisimengajar.id",
    address: "Jakarta, Indonesia",
    location: "Jakarta, Indonesia"
  };

  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    institusi: "",
    email: "",
    noHp: "",
    layanan: "",
    deskripsi: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi field wajib
    if (!formData.nama || !formData.jabatan || !formData.institusi || !formData.email || !formData.noHp || !formData.layanan) {
      alert("Mohon lengkapi semua field yang bertanda *");
      return;
    }

    const message = `Formulir Pengajuan

Nama Lengkap : ${formData.nama}
Jabatan : ${formData.jabatan}
Institusi : ${formData.institusi}
Email : ${formData.email}
No. WhatsApp : ${formData.noHp}
Jenis Layanan : ${formData.layanan}

Deskripsi Kebutuhan:
${formData.deskripsi}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "6285646420488";
    
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  return (
    <section id="kontak" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              {ctaData.section_title || "Mulai Sekarang"}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {ctaData.title || "Siap Menghadirkan Praktisi ke Institusi Anda?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {ctaData.description || "Hubungi kami sekarang untuk konsultasi gratis. Tim kami siap membantu menemukan praktisi yang tepat untuk kebutuhan institusi Anda."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="accent" size="xl" asChild>
                <a href={primaryCta.link}>
                  {primaryCta.text}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="whatsapp" size="xl" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  {ctaData.cta_whatsapp?.text || "Konsultasi via WhatsApp"}
                </a>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telepon / WhatsApp</p>
                  <p className="font-medium text-foreground">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{contactInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lokasi</p>
                  <p className="font-medium text-foreground">{contactInfo.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            id="form"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 shadow-card border border-border"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Formulir Pengajuan
            </h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="Kepala Sekolah / Dosen"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Institusi *
                </label>
                <input
                  type="text"
                  required
                  name="institusi"
                  value={formData.institusi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="Nama sekolah atau universitas"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="email@institusi.ac.id"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    No. WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    name="noHp"
                    value={formData.noHp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Jenis Layanan *
                </label>
                <select
                  required
                  name="layanan"
                  value={formData.layanan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  <option value="">Pilih layanan</option>
                  <option value="Guru Tamu">Guru Tamu</option>
                  <option value="Dosen Tamu">Dosen Tamu</option>
                  <option value="Pembicara Seminar">Pembicara Seminar</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Deskripsi Kebutuhan
                </label>
                <textarea
                  rows={4}
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                  placeholder="Jelaskan topik, jumlah peserta, tanggal yang diinginkan, dll."
                />
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full">
                Kirim Pengajuan
                <ArrowRight className="w-5 h-5" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Dengan mengirim form ini, Anda menyetujui untuk dihubungi oleh tim kami.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;