import AIInsightCard from "../common/AIInsightCard.jsx";

export default function DemandAlert({ insight }) {
  if (!insight) return null;
  return (
    <AIInsightCard
      title="AI Demand Alert"
      text={insight.text}
      crop={insight.crop}
      current={insight.current}
      forecast={insight.forecast}
      action={insight.action}
    />
  );
}
