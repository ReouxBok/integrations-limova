import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeedbackStats } from "@/hooks/useFeedbackStats";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = {
  critical: "#ef4444",
  medium: "#eab308",
  low: "#22c55e",
};

const LABELS = {
  critical: { fr: "Critique", en: "Critical" },
  medium: { fr: "Moyenne", en: "Medium" },
  low: { fr: "Basse", en: "Low" },
};

export const CriticalityPieChart = () => {
  const { t } = useLanguage();
  const { data, isLoading } = useFeedbackStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Répartition par criticité", "Distribution by Criticality")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(data?.byCriticality || {}).map(([key, value]) => ({
    name: t(LABELS[key as keyof typeof LABELS]?.fr || key, LABELS[key as keyof typeof LABELS]?.en || key),
    value,
    key,
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Répartition par criticité", "Distribution by Criticality")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">{t("Aucune donnée", "No data")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Répartition par criticité", "Distribution by Criticality")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.key as keyof typeof COLORS] || "#888"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CriticalityPieChart;
