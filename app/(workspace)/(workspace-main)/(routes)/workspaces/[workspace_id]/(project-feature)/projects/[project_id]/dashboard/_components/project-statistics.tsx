'use client';

import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { DatasetDistribution } from './charts/dataset-distribution';
import { StatusDistribution } from './charts/status-distribution';
import { DailyProgress } from './charts/daily-progress';
import { datasetColors, statusChartConfig } from './configs/chart-configs';
import useProjectStatistics from '../_hooks/use-project-statistics';

const ProjectStatistics = () => {
  const { data: statistics, isLoading } = useProjectStatistics();

  const totalCount = useMemo(() => {
    return (
      statistics?.summary.statusDistribution.reduce(
        (acc: number, curr: { count: string }) => acc + parseInt(curr.count),
        0,
      ) || 0
    );
  }, [statistics]);

  const formattedStatusData = useMemo(() => {
    return (
      statistics?.summary.statusDistribution.map(
        (item: { status: string; count: string }) => ({
          status: item.status,
          count: parseInt(item.count),
          fill: statusChartConfig[item.status as keyof typeof statusChartConfig]
            ?.color,
        }),
      ) || []
    );
  }, [statistics]);

  const formattedDatasetStats = useMemo(() => {
    if (!statistics?.summary.datasetStats) return [];

    return statistics.summary.datasetStats
      .sort(
        (a: { totalItems: string }, b: { totalItems: string }) =>
          parseInt(b.totalItems) - parseInt(a.totalItems),
      )
      .slice(0, 7)
      .map(
        (item: { datasetName: string; totalItems: string }, index: number) => ({
          ...item,
          totalItems: parseInt(item.totalItems),
          fill: datasetColors[index],
          datasetName:
            item.datasetName.length > 10
              ? `${item.datasetName.slice(0, 10)}...`
              : item.datasetName,
        }),
      );
  }, [statistics]);

  const formatDailyProgress = (data: any[]) => {
    const groupedByDate = data.reduce((acc, curr) => {
      const formattedDate = dayjs(curr.date).format('YY-MM-DD');
      if (!acc[formattedDate]) {
        acc[formattedDate] = { date: formattedDate };
      }
      acc[formattedDate][curr.status.toLowerCase()] = parseInt(curr.count);
      return acc;
    }, {});

    return Object.values(groupedByDate);
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[500px]" />;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <DatasetDistribution data={formattedDatasetStats} />
      <StatusDistribution data={formattedStatusData} totalCount={totalCount} />
      <DailyProgress
        data={formatDailyProgress(statistics?.progress.dailyProgress)}
      />
    </div>
  );
};

export default ProjectStatistics;
