import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeedbacksByDate } from "@/hooks/useFeedbackStats";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedbackTimeChartProps {
  days?: number;
}

export const FeedbackTimeChart = ({ days = 30 }: FeedbackTimeChartProps) => {
  const { t, language } = useLanguage();
  const locale = language === "fr" ? fr : enUS;
  const { data, isLoading } = useFeedbacksByDate(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Évolution des feedbacks", "Feedback Evolution")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.map(d => ({
    ...d,
    displayDate: format(new Date(d.date), "dd MMM", { locale }),
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Évolution des feedbacks", "Feedback Evolution")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name={t("Feedbacks", "Feedbacks")}
              stroke="hsl(var(--accent))"
              fill="url(#colorCount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FeedbackTimeChart;
