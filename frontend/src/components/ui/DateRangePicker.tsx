import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/Calendar';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Dialog } from '@/components/ui/Dialog';

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  onChange: (range: DateRange | undefined) => void;
  initialRange?: DateRange;
}

export function DateRangePicker({ onChange, initialRange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  const [tempRange, setTempRange] = useState<{
    from?: Date;
    to?: Date;
  }>(initialRange || { from: undefined, to: undefined });

  const handleSelect = (date: Date) => {
    if (!tempRange.from) {
      setTempRange({ from: date, to: undefined });
    } else if (!tempRange.to && date >= tempRange.from) {
      setTempRange({ ...tempRange, to: date });
    } else {
      setTempRange({ from: date, to: undefined });
    }
  };

  const handleApply = () => {
    if (tempRange.from && tempRange.to) {
      const newRange = { from: tempRange.from, to: tempRange.to };
      setRange(newRange);
      onChange(newRange);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setRange(undefined);
    setTempRange({ from: undefined, to: undefined });
    onChange(undefined);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(range || { from: undefined, to: undefined });
    setIsOpen(false);
  };

  // Predefined date ranges
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);
  
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 29);
  
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  const handleSetPredefined = (from: Date, to: Date) => {
    const newRange = { from, to };
    setRange(newRange);
    setTempRange(newRange);
    onChange(newRange);
    setIsOpen(false);
  };

  return (
    <div>
      <FormInput
        readOnly
        placeholder="Select date range"
        value={
          range
            ? `${format(range.from, 'MMM dd, yyyy')} - ${format(range.to, 'MMM dd, yyyy')}`
            : ''
        }
        onClick={() => setIsOpen(true)}
      />

      <Dialog
        title="Select Date Range"
        isOpen={isOpen}
        onClose={handleCancel}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2">
            <h3 className="font-medium mb-2">Predefined Ranges</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSetPredefined(today, today)}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSetPredefined(yesterday, yesterday)}
              >
                Yesterday
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSetPredefined(last7Days, today)}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSetPredefined(last30Days, today)}
              >
                Last 30 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSetPredefined(thisMonth, today)}
              >
                This Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSetPredefined(lastMonth, lastMonthEnd)}
              >
                Last Month
              </Button>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="text-center mb-2">
              {tempRange.from ? (
                tempRange.to ? (
                  <span>
                    {format(tempRange.from, 'MMM dd, yyyy')} - {format(tempRange.to, 'MMM dd, yyyy')}
                  </span>
                ) : (
                  <span>From: {format(tempRange.from, 'MMM dd, yyyy')}</span>
                )
              ) : (
                <span>Select start date</span>
              )}
            </div>
            <Calendar
              mode="range"
              selected={{
                from: tempRange.from,
                to: tempRange.to,
              }}
              onSelect={(range) => {
                if (range?.from) {
                  setTempRange({
                    from: range.from,
                    to: range.to,
                  });
                }
              }}
              numberOfMonths={1}
              disabled={{ after: new Date() }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!tempRange.from || !tempRange.to}
          >
            Apply
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
