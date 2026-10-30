// Business facts shared by layouts, components and schema. Change them here, not in pages.
export const site = {
  name: "Oahu Web Co.",
  tagline: "The online side, handled.",
  url: "https://oahuwebco.com",
  description:
    "Oahu Web Co. helps Oʻahu small businesses get found on Google, turn more calls into booked jobs and bring customers back. Based in Kāneʻohe.",
  email: "max@oahuwebco.com",
  phone: { display: "(808) 829-9840", href: "tel:+18088299840", e164: "+1-808-829-9840" },
  town: "Kāneʻohe",
  island: "Oʻahu",
  gaId: "G-2XGNZCVXTP",
  social: {
    instagram: "https://www.instagram.com/oahuwebco/",
    facebook: "https://www.facebook.com/profile.php?id=61594976416835",
    maps: "https://www.google.com/maps?cid=17207144462533879275",
    reviewLink:
      "https://g.page/r/CetlKai4DszuEBM/review?utm_source=gbp&utm_medium=reviews&utm_campaign=website",
  },
} as const;

/** The four outcome pages plus the two search-term pages, in navigation order. */
export const services = [
  { slug: "reach-more-customers", name: "Reach more customers" },
  { slug: "convert-more-inquiries", name: "Convert more inquiries" },
  { slug: "build-repeat-business", name: "Build repeat business" },
  { slug: "measure-and-improve", name: "Measure and improve" },
  { slug: "local-seo", name: "Local SEO" },
  { slug: "websites", name: "Websites" },
] as const;

/** Schema.org node for the business, referenced from every page's graph by @id. */
export const businessId = `${site.url}/#business`;
export const businessSchema = {
  "@type": "ProfessionalService",
  "@id": businessId,
  name: site.name,
  alternateName: ["Oahu Webco", "OahuWebCo", "oahuwebco"],
  slogan: site.tagline,
  description: site.description,
  url: `${site.url}/`,
  logo: `${site.url}/logo-240.png`,
  image: `${site.url}/og-image.jpg`,
  email: site.email,
  telephone: site.phone.e164,
  address: { "@type": "PostalAddress", addressLocality: site.town, addressRegion: "HI", addressCountry: "US" },
  areaServed: { "@type": "Place", name: "Oʻahu, Hawaii" },
  priceRange: "$$",
  sameAs: [site.social.maps, site.social.instagram, site.social.facebook],
};
