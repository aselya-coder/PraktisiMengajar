import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useContent } from "../context/ContentContext";
import { CTASection } from "@/types/content";

interface CTAProps {
  previewData?: CTASection;
}

const CTA = ({ previewData }: CTAProps) => {
  const { data } = useContent();
  const ctaData = (previewData || data?.cta || {}) as CTASection;

  const whatsappLink =
    ctaData.cta_whatsapp?.link ||
    "https://wa.me/6285646420488?text=Halo,%20saya%20tertarik%20dengan%20layanan%20Praktisi%20Mengajar";

  const primaryCta = ctaData.cta_primary || {
    text: "Ajukan Praktisi Mengajar",
    link: "#form",
  };

  const contactInfo = ctaData.contact_info || {
    phone: "+62 856-4642-0488",
    email: "info@praktisimengajar.id",
    address: "Jakarta, Indonesia",
    location: "Jakarta, Indonesia",
  };

  /* ================= SUBMIT KE WHATSAPP ================= */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const nama = formData.get("nama");
    const jabatan = formData.get("jabatan");
    const institusi = formData.get("institusi");
    const email = formData.get("email");
    const whatsapp = formData.get("whatsapp");
    const layanan = formData.get("layanan");
    const deskripsi = formData.get("deskripsi");

    const message = `
Halo, saya ingin mengajukan Praktisi Mengajar.

Nama: ${nama}
Jabatan: ${jabatan}
Institusi: ${institusi}
Email: ${email}
WhatsApp: ${whatsapp}
Jenis Layanan: ${layanan}

Deskripsi Kebutuhan:
${deskripsi}
    `;

    const url = `https://wa.me/6285646420488?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <section id="kontak" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ================= LEFT CONTENT ================= */}
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
              {ctaData.title ||
                "Siap Menghadirkan Praktisi ke Institusi Anda?"}
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              {ctaData.description ||
                "Hubungi kami sekarang untuk konsultasi gratis."}
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="accent" size="xl" asChild>
                <a href={primaryCta.link}>
                  {primaryCta.text}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>

              <Button variant="whatsapp" size="xl" asChild>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5" />
                  {ctaData.cta_whatsapp?.text ||
                    "Konsultasi via WhatsApp"}
                </a>
              </Button>
            </div>

            {/* CONTACT INFO */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Telepon / WhatsApp
                  </p>
                  <p className="font-medium text-foreground">
                    {contactInfo.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">
                    {contactInfo.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lokasi</p>
                  <p className="font-medium text-foreground">
                    {contactInfo.location}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= FORM ================= */}
          <motion.div
            id="form"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 shadow-card border border-border"
          >
            <h3 className="text-2xl font-bold mb-6">
              Formulir Pengajuan
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input name="nama" required placeholder="Nama Anda" />
                <input name="jabatan" required placeholder="Jabatan" />
              </div>

              <input
                name="institusi"
                required
                placeholder="Nama institusi"
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <input name="email" type="email" required placeholder="Email" />
                <input
                  name="whatsapp"
                  required
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <select name="layanan" required>
                <option value="">Pilih layanan</option>
                <option value="Guru Tamu">Guru Tamu</option>
                <option value="Dosen Tamu">Dosen Tamu</option>
                <option value="Pembicara Seminar">Pembicara Seminar</option>
                <option value="Lainnya">Lainnya</option>
              </select>

              <textarea
                name="deskripsi"
                rows={4}
                placeholder="Deskripsi kebutuhan"
              />

              <Button type="submit" className="w-full">
                Kirim Pengajuan
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
