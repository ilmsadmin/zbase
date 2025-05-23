import type { VisualizationOption, MetricOption } from '@/services/api/reports';

interface VisualizationOptionsProps {
  visualization: VisualizationOption;
  metrics: MetricOption[];
  selectedMetrics: string[];
  onUpdate: (visualization: VisualizationOption) => void;
}

export default function VisualizationOptions({
  visualization,
  metrics,
  selectedMetrics,
  onUpdate
}: VisualizationOptionsProps) {
  const handleChange = (key: keyof VisualizationOption, value: any) => {
    onUpdate({
      ...visualization,
      [key]: value
    });
  };

  const visualizationTypes = [
    { id: 'bar', name: 'Bar Chart' },
    { id: 'line', name: 'Line Chart' },
    { id: 'pie', name: 'Pie Chart' },
    { id: 'table', name: 'Table' },
  ];

  const selectedMetricsData = metrics.filter(m => selectedMetrics.includes(m.id));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Select Visualization Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {visualizationTypes.map((type) => (
            <button
              key={type.id}
              className={`border p-4 rounded-md text-center ${
                visualization.type === type.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary hover:bg-primary/5'
              }`}
              onClick={() => handleChange('type', type.id)}
            >
              <div className="font-medium">{type.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter chart title"
            value={visualization.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {(visualization.type === 'bar' || visualization.type === 'line') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">X-Axis Field</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={visualization.xAxis || ''}
                onChange={(e) => handleChange('xAxis', e.target.value)}
              >
                <option value="">Select X-Axis field</option>
                {selectedMetricsData.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Y-Axis Field</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={visualization.yAxis || ''}
                onChange={(e) => handleChange('yAxis', e.target.value)}
              >
                <option value="">Select Y-Axis field</option>
                {selectedMetricsData.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {visualization.type === 'pie' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Labels Field</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={visualization.xAxis || ''}
                onChange={(e) => handleChange('xAxis', e.target.value)}
              >
                <option value="">Select Labels field</option>
                {selectedMetricsData.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Values Field</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={visualization.yAxis || ''}
                onChange={(e) => handleChange('yAxis', e.target.value)}
              >
                <option value="">Select Values field</option>
                {selectedMetricsData.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Colors and Display Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color Scheme</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={Array.isArray(visualization.colors) ? 'custom' : (visualization.colors || 'default')}
              onChange={(e) => {
                if (e.target.value === 'default') {
                  handleChange('colors', undefined);
                } else if (e.target.value === 'custom') {
                  handleChange('colors', ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']);
                } else {
                  handleChange('colors', e.target.value);
                }
              }}
            >
              <option value="default">Default Colors</option>
              <option value="blues">Blues</option>
              <option value="greens">Greens</option>
              <option value="purples">Purples</option>
              <option value="oranges">Oranges</option>
              <option value="custom">Custom Colors</option>
            </select>
          </div>

          {visualization.type !== 'table' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Legend Position</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={visualization.legendPosition || 'top'}
                onChange={(e) => handleChange('legendPosition', e.target.value)}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="none">No Legend</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 h-64 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="mb-2 font-medium">{visualization.title || 'Custom Report'}</p>
            <p>
              {visualization.type === 'bar' && 'Bar Chart'}
              {visualization.type === 'line' && 'Line Chart'}
              {visualization.type === 'pie' && 'Pie Chart'}
              {visualization.type === 'table' && 'Table View'}
            </p>
            <p className="text-sm mt-1">
              Run the report to see the visualization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
