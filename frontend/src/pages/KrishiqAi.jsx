import { Link } from "react-router-dom";
import PublicPage, { ContentSection, PageHero } from "../components/common/PublicPage.jsx";
import { breadcrumbJsonLd } from "../seo/site.js";

const jsonLd = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Krishiq AI", path: "/krishiq-ai" },
]);

export default function KrishiqAi() {
  return (
    <PublicPage jsonLd={jsonLd}>
      <PageHero
        eyebrow="AI-Powered Agricultural Technology"
        title="Krishiq AI"
        text="Krishiq AI is the intelligent technology layer built into the Krishiq platform, turning agricultural data into practical decisions for farmers, FPOs, and buyers through crop demand forecasts, fair price insights, and lot matching."
      />
      <ContentSection title="Crop Demand Forecasting for Farmers">
        <p>
          One of the biggest challenges in Indian agriculture is timing produce sales to match market demand. Inside the farmer workspace at <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/for-farmers">Krishiq for Farmers</Link>, Krishiq AI analyzes seasonal patterns, regional demand spikes, and market supply volume to provide demand forecasts for major crops like wheat, mustard, tomatoes, and onions.
        </p>
        <p>
          Farmers can view demand trends across key agricultural hubs (including Jaipur, Kota, and Alwar) to understand whether demand for their crop is rising, stable, or declining, helping them decide the best time to harvest and list their harvest on the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/marketplace">Krishiq Marketplace</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Agricultural Price Insights & Fair Valuation">
        <p>
          Krishiq AI provides automated price insights for agricultural listings. By evaluating current market listings, historical price points, and prevailing mandi benchmarks, the system calculates suggested fair prices for both sellers and buyers.
        </p>
        <p>
          This protects farmers from distress sales and gives buyers confidence that they are paying a fair, transparent price directly to the grower without intermediaries inflating the cost.
        </p>
      </ContentSection>

      <ContentSection title="Buyer Recommendations & Match Scoring">
        <p>
          For wholesale buyers, procurement teams, and retail businesses sourcing through the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/marketplace">Krishiq Marketplace</Link>, Krishiq AI calculates compatibility match scores between buyer purchase requirements and available farmer or FPO lots.
        </p>
        <p>
          The recommendation algorithm evaluates crop specifications, quality grades (such as A Grade or Organic), volume requirements, and delivery distances to surface the most suitable produce lots quickly.
        </p>
      </ContentSection>

      <ContentSection title="Part of the Krishiq Agritech Ecosystem">
        <p>
          Krishiq AI operates hand-in-hand with our broader agritech infrastructure. Discover how our technology powers agricultural commerce on <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/agritech">Krishiq Agritech</Link>, explore direct grower tools on <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/for-farmers">Krishiq for Farmers</Link>, read our background on <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/about">About Krishiq</Link>, or return to the <Link className="font-semibold text-leaf underline-offset-2 hover:underline" to="/">Krishiq homepage</Link>.
        </p>
      </ContentSection>
    </PublicPage>
  );
}
