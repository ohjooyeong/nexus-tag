import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { chartConfig } from '../configs/chart-configs';

interface DailyProgressProps {
  data: any[];
}

export const DailyProgress = ({ data }: DailyProgressProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="new"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="in_progress"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="to_review"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="done"
              stackId="1"
              stroke="#ff7300"
              fill="#ff7300"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
