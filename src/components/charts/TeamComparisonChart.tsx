import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeedbackStats } from "@/hooks/useFeedbackStats";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = {
  sav: "hsl(var(--accent))",
  onboarding: "hsl(210 80% 55%)",
};

export const TeamComparisonChart = () => {
  const { t } = useLanguage();
  const { data, isLoading } = useFeedbackStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Répartition par équipe", "Distribution by Team")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: "SAV", value: data?.byTeam.sav || 0, key: "sav" },
    { name: "Onboarding", value: data?.byTeam.onboarding || 0, key: "onboarding" },
  ];

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Répartition par équipe", "Distribution by Team")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">{t("Aucune donnée", "No data")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Répartition par équipe", "Distribution by Team")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={150} height={150}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.key as keyof typeof COLORS]} />
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
          
          <div className="flex-1 space-y-4">
            {chartData.map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[item.key as keyof typeof COLORS] }}
                  />
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">{item.value}</span>
                  <span className="text-muted-foreground ml-2">
                    ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamComparisonChart;
