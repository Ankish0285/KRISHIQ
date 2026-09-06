import { useState } from "react";
import { aiApi } from "../../api/aiApi.js";
import useFetch from "../../hooks/useFetch.js";
import DemandForecastChart from "../../components/common/DemandForecastChart.jsx";
import PricePredictionCard from "../../components/common/PricePredictionCard.jsx";
import AIInsightCard from "../../components/common/AIInsightCard.jsx";
import { Card, Loader, PageHeader, Select, StatCard } from "../../components/common/ui.jsx";
import { CROPS, LOCATIONS } from "../../utils/mockData.js";
import { TrendingUp, Activity, Percent, Shield } from "lucide-react";

export default function DemandForecast() {
  const [crop, setCrop] = useState("Tomato");
  const [period, setPeriod] = useState("8 weeks");
  const [location, setLocation] = useState("Jaipur");
  const { data, loading } = useFetch(() => aiApi.demandForecast({ crop, location }), [crop, location]);
  const price = useFetch(() => aiApi.pricePrediction(crop), [crop]);
  if (loading || !data) return <Loader />;
  return (
    <div>
      <PageHeader title="Demand Forecast" subtitle="AI outlook for crop demand, price and recommended acreage response." />
      <Card className="mb-6 grid gap-3 md:grid-cols-3">
        <Select id="crop" label="Crop" value={crop} onChange={(e) => setCrop(e.target.value)}>
          {CROPS.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select id="period" label="Time period" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option>8 weeks</option>
          <option>4 weeks</option>
          <option>12 weeks</option>
        </Select>
        <Select id="location" label="Location" value={location} onChange={(e) => setLocation(e.target.value)}>
          {LOCATIONS.map((c) => <option key={c}>{c}</option>)}
        </Select>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} label="Current Demand" value={data.current} />
        <StatCard icon={TrendingUp} label="Predicted Demand" value={data.predicted} tone="blue" />
        <StatCard icon={Percent} label="Demand Change" value={`${data.change}%`} />
        <StatCard icon={Shield} label="Confidence" value={`${data.confidence}%`} tone="blue" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-3 font-bold">{crop} demand · {location} · {period}</h3>
          <DemandForecastChart weeks={data.weeks} series={data.series} />
        </Card>
        <div className="space-y-4">
          {price.data && <PricePredictionCard crop={crop} current={price.data.current} predicted={price.data.predicted} />}
          <AIInsightCard
            title="AI recommendation"
            text={data.recommendation}
            crop={crop}
            current={data.current}
            forecast={data.predicted}
            action="Increase listing volume while prices stay inside the predicted band."
          />
        </div>
      </div>
    </div>
  );
}
