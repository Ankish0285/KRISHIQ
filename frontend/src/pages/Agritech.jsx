import { Link } from "react-router-dom";
import PublicPage, { ContentSection, PageHero } from "../components/common/PublicPage.jsx";
import { breadcrumbJsonLd } from "../seo/site.js";

const jsonLd = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Krishiq Agritech", path: "/agritech" },
]);

export default function Agritech() {
  return (
    <PublicPage jsonLd={jsonLd}>
      <PageHero
        eyebrow="Technology for Modern Farming"
        title="Krishiq Agritech"
        text="Krishiq Agritech combines modern software architecture with agricultural supply chains, providing digital produce listings, role-based workflows, transparent order fulfillment, and AI decision intelligence for farmers, FPOs, and buyers."
      />
      <ContentSection title="Bridging Technology and Modern Agriculture">
        <p>
          Traditional agricultural commerce in India has long suffered from fragmented supply chains, information asymmetry, and heavy reliance on intermediaries. Krishiq Agritech was developed to address these systemic friction points by delivering accessible, cloud-powered digital tools directly into the hands of farmers and agricultural collectives.
        </p>
        <p>
          From mobile-responsive listing creation to live shipment handoffs, our platform turns agricultural trade into a transparent, predictable digital process.
        </p>
      </ContentSection>

      <ContentSection title="Full-Stack Technical Architecture">
        <p>
          The Krishiq platform is engineered as a production-grade full-stack web application. The frontend leverages React and Vite for rapid, lightweight client interactions, while the backend is powered by Node.js, Express, and MongoDB for scalable order and inventory data management.
        </p>
        <p>
          Media management is integrated directly with Cloudinary, allowing farmers to upload high-fidelity produce photographs from their fields to prove grade quality, freshness, and packaging condition before a transaction takes place.
        </p>
      </ContentSection>

      <ContentSection title="Intelligent Signals with Krishiq AI">
        <p>
          Unlike static directory sites, Krishiq integrates <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/krishiq-ai">Krishiq AI</Link> natively into its workflows. The system surfaces crop demand forecasts, fair price insights based on historical mandi trends, and buyer-seller match scoring directly in user dashboards.
        </p>
        <p>
          This ensures that technology solves real operational needs—helping farmers time their listings for maximum return and helping buyers source consistently high-grade produce.
        </p>
      </ContentSection>

      <ContentSection title="Role-Based Portals & Logistics Visibility">
        <p>
          Krishiq features four specialized workspaces designed for agricultural stakeholders:
        </p>
        <ul className="list-inside list-disc space-y-2 text-[#A7B8B0]">
          <li><strong>Farmer Dashboard:</strong> For adding lots, tracking orders, and viewing earnings.</li>
          <li><strong>FPO Portal:</strong> For aggregating member harvests, managing inventory, and fulfilling bulk orders.</li>
          <li><strong>Buyer Dashboard:</strong> For browsing listings on the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/marketplace">Krishiq Marketplace</Link>, reviewing AI match recommendations, and tracking live orders.</li>
          <li><strong>Admin Workspace:</strong> For catalogue verification, user governance, and platform analytics.</li>
        </ul>
      </ContentSection>

      <ContentSection title="Explore More of Krishiq">
        <p>
          Learn how growers benefit on <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/for-farmers">Krishiq for Farmers</Link>, explore the public <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/marketplace">Krishiq Marketplace</Link>, read about developer Ankish on <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/about">About Krishiq</Link>, or return to the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/">Krishiq homepage</Link>.
        </p>
      </ContentSection>
    </PublicPage>
  );
}
