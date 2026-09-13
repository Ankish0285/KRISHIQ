import { Link } from "react-router-dom";
import PublicPage, { ContentSection, PageHero } from "../components/common/PublicPage.jsx";
import { breadcrumbJsonLd } from "../seo/site.js";

const jsonLd = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "About Krishiq", path: "/about" },
]);

export default function About() {
  return (
    <PublicPage jsonLd={jsonLd}>
      <PageHero
        eyebrow="Agritech Platform"
        title="About Krishiq"
        text="About Krishiq – an AI-powered agritech platform developed by Ankish to connect farmers, FPOs, and buyers through transparent agricultural marketplace tools, real-time logistics tracking, and practical crop intelligence."
      />
      <ContentSection title="What is Krishiq?">
        <p>
          Krishiq is a digital farm-to-market platform engineered to bring efficiency and transparency to agricultural trade. Traditional agricultural trade often leaves growers disconnected from true market prices while buyers struggle with consistent quality sourcing and delivery coordination.
        </p>
        <p>
          Through Krishiq, farmers and Farmer Producer Organizations (FPOs) can publish structured produce listings, manage incoming purchase requests, and monitor delivery milestones. Wholesale and commercial buyers can discover fresh lots on the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/marketplace">Krishiq Marketplace</Link>, compare prices per unit, and place verified orders.
        </p>
      </ContentSection>

      <ContentSection title="Developer Attribution">
        <p>
          Krishiq is developed by Ankish.
        </p>
        <p>
          Ankish is the developer behind Krishiq, engineering the platform as a complete full-stack web application rather than a static brochure. The system integrates modern web technologies, role-based access for farmers, buyers, and FPOs, a Cloudinary media pipeline for produce quality verification, and an intelligent data layer known as <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/krishiq-ai">Krishiq AI</Link>.
        </p>
        <p>
          The technical mission behind Krishiq is to empower agricultural producers with modern digital tools that eliminate redundant intermediaries and deliver fair market value directly to the growers.
        </p>
      </ContentSection>

      <ContentSection title="The Krishiq Ecosystem">
        <p>
          Explore each component of the Krishiq platform:
        </p>
        <ul className="list-inside list-disc space-y-2 text-[#A7B8B0]">
          <li>
            <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/krishiq-ai">Krishiq AI</Link>: Crop demand forecasting, price insights, and lot match scoring.
          </li>
          <li>
            <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/for-farmers">Krishiq for Farmers</Link>: Direct listing tools, order workflows, and earnings visibility.
          </li>
          <li>
            <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/marketplace">Krishiq Marketplace</Link>: Direct farm produce sourcing for buyers.
          </li>
          <li>
            <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/agritech">Krishiq Agritech</Link>: Full-stack modern software architecture powering digital farming.
          </li>
        </ul>
        <p className="mt-4">
          Return to the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/">Krishiq homepage</Link> to get started.
        </p>
      </ContentSection>
    </PublicPage>
  );
}
