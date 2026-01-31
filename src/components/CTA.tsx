import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { CTASection } from "@/types/content";

interface CTAProps {
  previewData?: CTASection;
}

const CTA = ({ previewData }: CTAProps) => {
  const { data } = useContent();
  const ctaData = previewData || (data?.cta as CTASection);

  // ✅ WhatsApp CTA BUTTON (TIDAK DIHAPUS)
  const whatsappLink =
    ctaData?.cta_whatsapp?.link ||
    "https://wa.me/6285646420488?text=Halo,%20saya%20tertarik%20dengan%20layanan%20Praktisi%20Mengajar";

  const primaryCta = ctaData?.cta_primary || {
    text: "Ajukan Praktisi Mengajar",
    link: "#form",
  };

  const contactInfo = ctaData?.contact_info || {
    phone: "+62 856-4642-0488",
    email: "info@praktisimengajar.id",
    location: "Jakarta, Indonesia",
  };

  // ✅ HANDLE SUBMIT FORM → WHATSAPP
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const message = `
Halo, saya ingin mengajukan *Praktisi Mengajar*.

Nama: ${formData.get("nama")}
Jabatan: ${formData.get("jabatan")}
Institusi: ${formData.get("institusi")}
Email: ${formData.get("email")}
No. WhatsApp: ${formData.get("whatsapp")}
Jenis Layanan: ${formData.get("layanan")}

Deskripsi:
${formData.get("deskripsi")}
    `;

    const phoneNumber = "6285646420488"; // tujuan WA
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(waUrl, "_blank");
  };

  return (
    <section id="kontak" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-accent font-semibold text-sm uppercase mb-4">
              {ctaData?.section_title || "Mulai Sekarang"}
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {ctaData?.title ||
                "Siap Menghadirkan Praktisi ke Institusi Anda?"}
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              {ctaData?.description ||
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

              {/* ✅ WHATSAPP CTA TETAP ADA */}
              <Button variant="whatsapp" size="xl" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  {ctaData?.cta_whatsapp?.text ||
                    "Konsultasi via WhatsApp"}
                </a>
              </Button>
            </div>

            {/* CONTACT INFO */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{contactInfo.location}</span>
              </div>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            id="form"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 shadow-card border"
          >
            <h3 className="text-2xl font-bold mb-6">Formulir Pengajuan</h3>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-5">
                <input name="nama" required placeholder="Nama Lengkap" />
                <input name="jabatan" required placeholder="Jabatan" />
              </div>

              <input name="institusi" required placeholder="Institusi" />

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                />
                <input
                  name="whatsapp"
                  type="tel"
                  required
                  placeholder="No. WhatsApp"
                />
              </div>

              <select name="layanan" required>
                <option value="">Pilih layanan</option>
                <option value="Guru Tamu">Guru Tamu</option>
                <option value="Dosen Tamu">Dosen Tamu</option>
                <option value="Pembicara Seminar">Pembicara Seminar</option>
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
