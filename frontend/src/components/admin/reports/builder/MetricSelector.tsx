import type { MetricOption } from '@/services/api/reports';

interface MetricSelectorProps {
  metrics: MetricOption[];
  selectedMetrics: string[];
  onSelectMetric: (metricId: string) => void;
}

export default function MetricSelector({
  metrics,
  selectedMetrics,
  onSelectMetric
}: MetricSelectorProps) {
  // Group metrics by category
  const categories = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, MetricOption[]>);

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([category, categoryMetrics]) => (
        <div key={category}>
          <h4 className="font-medium text-gray-700 mb-2 capitalize">{category}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryMetrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => onSelectMetric(metric.id)}
                disabled={selectedMetrics.includes(metric.id)}
                className={`text-left p-3 rounded-md border ${
                  selectedMetrics.includes(metric.id)
                    ? 'border-primary bg-primary/10 cursor-not-allowed'
                    : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                }`}
              >
                <div className="font-medium">{metric.name}</div>
                <div className="text-xs text-gray-500 mt-1 capitalize">{metric.dataType}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
