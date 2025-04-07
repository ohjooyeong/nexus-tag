import { ChartConfig } from '@/components/ui/chart';

export const datasetColors = [
  'hsl(221, 83%, 53%)',
  'hsl(142, 76%, 36%)',
  'hsl(48, 96%, 53%)',
  'hsl(261, 84%, 58%)',
  'hsl(334, 84%, 58%)',
  'hsl(187, 84%, 58%)',
  'hsl(142, 77%, 73%)',
];

export const chartConfig = {} satisfies ChartConfig;

export const statusChartConfig = {
  NEW: {
    label: 'New',
    color: 'hsl(221, 83%, 53%)',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'hsl(142, 76%, 36%)',
  },
  TO_REVIEW: {
    label: 'To Review',
    color: 'hsl(48, 96%, 53%)',
  },
  DONE: {
    label: 'Done',
    color: 'hsl(261, 84%, 58%)',
  },
  SKIPPED: {
    label: 'Skipped',
    color: 'hsl(0, 84%, 60%)',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'hsl(142, 77%, 73%)',
  },
} satisfies ChartConfig;
