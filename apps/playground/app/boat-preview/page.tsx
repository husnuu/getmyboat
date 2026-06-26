import { BoatDetailView } from "@getyourboat/ui";
import type { BoatDetailViewModel } from "@getyourboat/shared";

// Public, no-auth demo of the customer-facing BoatDetailView (the same
// component the captain "Preview" step renders). Mock data only.
const mockModel: BoatDetailViewModel = {
  title: "Blue Horizon — Lüks Motoryat",
  subtitle: "Beneteau · Oceanis 31",
  boatTypeLabel: "Motoryacht",
  gallery: [
    { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80", alt: "Tekne 1" },
    { url: "https://images.unsplash.com/photo-1558642891-54be180ea339?w=800&q=80", alt: "Tekne 2" },
    { url: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80", alt: "Tekne 3" },
    { url: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80", alt: "Tekne 4" },
    { url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80", alt: "Tekne 5" },
  ],
  stats: [
    { label: "Kapasite", value: "8 kişi" },
    { label: "Kabin", value: "3 kabin" },
  ],
  specs: [
    { label: "Yıl", value: "2018" },
    { label: "Motor Sayısı", value: "2" },
  ],
  highlights: [
    { label: "Kapasite", value: "8 kişi" },
    { label: "Kabin", value: "3 kabin" },
    { label: "Yıl", value: "2018" },
  ],
  description:
    "Göcek koylarında konforlu bir gün için ideal motoryat. Geniş güneşlenme alanı, klimali kabinler ve deneyimli mürettebat ile unutulmaz bir deniz keyfi.",
  amenities: [
    { label: "Klima", isExtra: false, extraPrice: null, currency: null },
    { label: "Wi-Fi", isExtra: false, extraPrice: null, currency: null },
    { label: "Su kayağı", isExtra: true, extraPrice: 50, currency: "EUR" },
    { label: "Şnorkel seti", isExtra: false, extraPrice: null, currency: null },
    { label: "Jet ski", isExtra: true, extraPrice: 120, currency: "EUR" },
    { label: "Müzik sistemi", isExtra: false, extraPrice: null, currency: null },
  ],
  pricing: [
    { label: "Günlük Kiralama Ücreti", price: 1800, currency: "EUR" },
    { label: "Saatlik Kiralama Ücreti", price: 300, currency: "EUR" },
  ],
  rules: "Sigara yalnızca güvertede içilebilir. Evcil hayvan kabul edilmez.",
  policyLines: [
    { label: "Giriş Saati", value: "10:00" },
    { label: "Çıkış Saati", value: "18:00" },
  ],
  depositLabel: "%20 ön ödeme",
  cancellationLabel: "Esnek iptal",
  approvalLabel: "Anında rezervasyon",
  documentBadges: ["Sigorta belgesi mevcut"],
  location: {
    country: "Türkiye",
    region: "Muğla",
    city: "Göcek",
    marina: "D-Marin Göcek",
    summary: "Türkiye, Muğla, Göcek, D-Marin Göcek",
  },
  boatPlanUrl: null,
  contactForFuelCost: true,
  fuelCostNote: null,
};

export default function BoatPreviewDemoPage() {
  return (
    <main className="mx-auto max-w-content px-4 py-8 sm:px-6">
      <p className="mb-4 text-caption text-gray-500">
        Demo: müşteri-facing <code>BoatDetailView</code> (auth'suz, mock veri).
      </p>
      <BoatDetailView model={mockModel} bookingDisabled showPlaceholders />
    </main>
  );
}
