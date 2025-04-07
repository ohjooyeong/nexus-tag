import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart, Bar, XAxis, CartesianGrid, Legend, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { chartConfig } from '../configs/chart-configs';

interface DatasetDistributionProps {
  data: Array<{
    datasetName: string;
    totalItems: number;
    fill: string;
  }>;
}

export const DatasetDistribution = ({ data }: DatasetDistributionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="datasetName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="totalItems"
              fill="fill"
              name="Total Items"
              radius={4}
            />
            <Legend />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing top 7 datasets by item count
        </div>
      </CardFooter>
    </Card>
  );
};
