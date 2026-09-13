import { Link } from "react-router-dom";
import PublicPage, { ContentSection, PageHero } from "../components/common/PublicPage.jsx";
import { breadcrumbJsonLd } from "../seo/site.js";

const jsonLd = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Krishiq for Farmers", path: "/for-farmers" },
]);

export default function ForFarmers() {
  return (
    <PublicPage jsonLd={jsonLd}>
      <PageHero
        eyebrow="Smart Agricultural Solutions"
        title="Krishiq for Farmers"
        text="Krishiq for Farmers is the dedicated grower and FPO interface of the Krishiq agritech platform, enabling agricultural producers to list harvest lots directly, bypass middlemen, receive fair market pricing, and leverage AI demand intelligence."
      />
      <ContentSection title="Direct Farm-to-Market Produce Listings">
        <p>
          Farmers and Farmer Producer Organizations (FPOs) no longer need to depend on complex layers of commission agents or informal intermediaries to reach buyers. Through the farmer dashboard, growers can publish produce lots with detailed specifications: crop variety, harvest date, location, available quantity, quality grade (such as Organic or Export Grade), and price per unit.
        </p>
        <p>
          High-resolution photos can be uploaded directly to verify produce quality. Once published, your lots appear immediately to verified wholesale and retail buyers on the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/marketplace">Krishiq Marketplace</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Order Management and Earnings Tracking">
        <p>
          Krishiq provides farmers with a clear operational workflow. When a buyer places an order, you receive instant notification with exact quantities, delivery instructions, and payment commitments.
        </p>
        <p>
          From your personal dashboard, you can track order fulfillment stages from preparation to pickup and dispatch. Comprehensive earnings reports give you real-time visibility into completed deliveries, pending settlements, and overall farm revenue.
        </p>
      </ContentSection>

      <ContentSection title="Krishiq AI for Farmers: Demand and Price Intelligence">
        <p>
          Timing is everything in farming. By integrating <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/krishiq-ai">Krishiq AI</Link> into daily farm operations, growers can access predictive demand forecasts before harvesting.
        </p>
        <p>
          Krishiq AI analyzes regional crop supply, mandi trends, and seasonal purchasing spikes to give farmers actionable price intelligence, helping you set competitive prices that protect your profit margins.
        </p>
      </ContentSection>

      <ContentSection title="FPO Collective Trade & Scaling">
        <p>
          For Farmer Producer Organizations (FPOs), Krishiq provides specialized aggregation tools to combine supply across hundreds of smallholder member farms. FPOs can manage collective inventories, fulfill large institutional orders, and secure volume contracts on the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/marketplace">Krishiq Marketplace</Link>.
        </p>
        <p>
          Discover more about our underlying technology on <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/agritech">Krishiq Agritech</Link>, read the platform background on <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/about">About Krishiq</Link>, or start from the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/">Krishiq homepage</Link>.
        </p>
      </ContentSection>
    </PublicPage>
  );
}
