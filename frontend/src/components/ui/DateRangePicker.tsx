import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/Calendar';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/DialogCustom';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  onChange: (range: DateRange | undefined) => void;
  initialRange?: DateRange;
  className?: string;
}

export function DateRangePicker({ onChange, initialRange, className }: DateRangePickerProps) {
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
    <div className="relative">
      <div 
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors cursor-pointer hover:bg-slate-50", 
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex-1">
          {range 
            ? `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}` 
            : <span className="text-muted-foreground">Chọn khoảng thời gian</span>
          }
        </div>
        <div className="flex items-center text-gray-400">
          📅
        </div>
      </div>

      <Dialog
        title="Chọn Khoảng Thời Gian"
        isOpen={isOpen}
        onClose={handleCancel}
        maxWidth="max-w-3xl"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <h3 className="font-medium mb-4">Khoảng thời gian</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left pl-3"
                onClick={() => handleSetPredefined(today, today)}
              >
                Hôm nay
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left pl-3"
                onClick={() => handleSetPredefined(yesterday, yesterday)}
              >
                Hôm qua
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left pl-3"
                onClick={() => handleSetPredefined(last7Days, today)}
              >
                7 ngày qua
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left pl-3"
                onClick={() => handleSetPredefined(last30Days, today)}
              >
                30 ngày qua
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left pl-3"
                onClick={() => handleSetPredefined(thisMonth, today)}
              >
                Tháng này
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left pl-3"
                onClick={() => handleSetPredefined(lastMonth, lastMonthEnd)}
              >
                Tháng trước
              </Button>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="text-center mb-4 p-2 bg-gray-50 rounded-md">
              {tempRange.from ? (
                tempRange.to ? (
                  <span className="font-medium">
                    {format(tempRange.from, 'dd MMM, yyyy')} - {format(tempRange.to, 'dd MMM, yyyy')}
                  </span>
                ) : (
                  <span className="font-medium">Từ: {format(tempRange.from, 'dd MMM, yyyy')}</span>
                )
              ) : (
                <span className="text-gray-500">Chọn ngày bắt đầu</span>
              )}
            </div>
            <div className="border rounded-md p-4 flex justify-center">
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
                className="mx-auto"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <Button variant="outline" onClick={handleClear} size="sm">
            Xóa
          </Button>
          <Button variant="outline" onClick={handleCancel} size="sm">
            Hủy
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!tempRange.from || !tempRange.to}
            size="sm"
          >
            Áp dụng
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
