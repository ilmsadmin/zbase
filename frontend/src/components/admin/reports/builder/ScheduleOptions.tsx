import { useState } from 'react';

interface ScheduleOptions {
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
}

interface ScheduleOptionsProps {
  onUpdate: (options: ScheduleOptions) => void;
}

export default function ScheduleOptions({ onUpdate }: ScheduleOptionsProps) {
  const [schedule, setSchedule] = useState<ScheduleOptions>({
    frequency: 'weekly',
    dayOfWeek: 1, // Monday
    time: '08:00',
    recipients: [],
  });

  const [recipient, setRecipient] = useState('');

  const handleChange = (key: keyof ScheduleOptions, value: any) => {
    const newSchedule = {
      ...schedule,
      [key]: value,
    };
    
    setSchedule(newSchedule);
    onUpdate(newSchedule);
  };

  const addRecipient = () => {
    if (!recipient || !recipient.includes('@')) return;
    
    const newRecipients = [...schedule.recipients, recipient];
    handleChange('recipients', newRecipients);
    setRecipient('');
  };

  const removeRecipient = (index: number) => {
    const newRecipients = [...schedule.recipients];
    newRecipients.splice(index, 1);
    handleChange('recipients', newRecipients);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={schedule.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {schedule.frequency === 'weekly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={schedule.dayOfWeek}
              onChange={(e) => handleChange('dayOfWeek', parseInt(e.target.value))}
            >
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
              <option value={0}>Sunday</option>
            </select>
          </div>
        )}

        {schedule.frequency === 'monthly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day of Month</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={schedule.dayOfMonth}
              onChange={(e) => handleChange('dayOfMonth', parseInt(e.target.value))}
            >
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <input
            type="time"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={schedule.time}
            onChange={(e) => handleChange('time', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
        <div className="flex">
          <input
            type="email"
            className="flex-grow p-2 border border-gray-300 rounded-l-md"
            placeholder="Enter email address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addRecipient();
              }
            }}
          />
          <button
            type="button"
            className="bg-primary text-white px-4 py-2 rounded-r-md"
            onClick={addRecipient}
          >
            Add
          </button>
        </div>

        <div className="mt-2">
          {schedule.recipients.length === 0 ? (
            <div className="text-gray-500 italic text-sm">No recipients added yet</div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {schedule.recipients.map((email, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                  <span className="text-sm">{email}</span>
                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-red-500"
                    onClick={() => removeRecipient(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
