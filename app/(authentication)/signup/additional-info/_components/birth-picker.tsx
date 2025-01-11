import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import Picker, { PickerValue } from 'react-mobile-picker';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { SignUpFormData } from './additional-info-form';
import { UseFormSetValue } from 'react-hook-form';

function getDayArray(year: number, month: number) {
  const dayCount = new Date(year, month, 0).getDate();
  return Array.from({ length: dayCount }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  );
}

type BirthPickerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  birth: string;
  setValue: UseFormSetValue<SignUpFormData>;
};

export function BirthPicker({
  open,
  setOpen,
  birth,
  setValue,
}: BirthPickerProps) {
  const [pickerValue, setPickerValue] = useState<PickerValue>({
    year: '2000',
    month: '08',
    day: '12',
  });

  const handlePickerChange = useCallback(
    (newValue: PickerValue, key: string) => {
      if (key === 'day') {
        setPickerValue(newValue);
        return;
      }

      const { year, month } = newValue;
      const newDayArray = getDayArray(Number(year), Number(month));
      const newDay = newDayArray.includes(newValue.day as string)
        ? newValue.day
        : newDayArray[newDayArray.length - 1];
      setPickerValue({ ...newValue, day: newDay });
    },
    [],
  );

  const handleOnClose = () => {
    const birth = dayjs(
      `${pickerValue.year}-${pickerValue.month}-${pickerValue.day}`,
    ).format('YYYY-MM-DD');
    setValue('birthdate', birth);
    setOpen(false);
  };

  useEffect(() => {
    const year = dayjs(birth).year();
    const month =
      dayjs(birth).month() < 10
        ? `0${dayjs(birth).month()}`
        : dayjs(birth).month();
    const date = dayjs(birth).date();

    setPickerValue({ year: `${year}`, month: `${month}`, day: `${date}` });
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOnClose}>
      <DialogContent className="sm:max-w-[428px]" aria-describedby="">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg text-center font-medium">
            Birthdate
          </DialogTitle>
        </DialogHeader>

        <div className="flex min-h-full items-center justify-center text-center w-full cursor-row-resize">
          <Picker
            value={pickerValue}
            onChange={handlePickerChange}
            wheelMode="natural"
            className="w-full"
          >
            <Picker.Column name="year">
              {Array.from({ length: 100 }, (_, i) => `${1923 + i}`).map(
                (year) => (
                  <Picker.Item key={year} value={year} className="w-full">
                    {({ selected }) => (
                      <div
                        className={cn(
                          'text-base w-full',
                          selected
                            ? 'font-semibold text-neutral-900'
                            : 'text-neutral-400',
                        )}
                      >
                        {year}
                      </div>
                    )}
                  </Picker.Item>
                ),
              )}
            </Picker.Column>
            <Picker.Column name="month">
              {Array.from({ length: 12 }, (_, i) =>
                String(i + 1).padStart(2, '0'),
              ).map((month) => (
                <Picker.Item key={month} value={month}>
                  {({ selected }) => (
                    <div
                      className={cn(
                        'text-base w-full',
                        selected
                          ? 'font-semibold text-neutral-900'
                          : 'text-neutral-400',
                      )}
                    >
                      {month}
                    </div>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
            <Picker.Column name="day">
              {getDayArray(
                Number(pickerValue.year),
                Number(pickerValue.month),
              ).map((day) => (
                <Picker.Item key={day} value={day}>
                  {({ selected }) => (
                    <div
                      className={cn(
                        'text-base w-full',
                        selected
                          ? 'font-semibold text-neutral-900'
                          : 'text-neutral-400',
                      )}
                    >
                      {day}
                    </div>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
          </Picker>
        </div>

        <Button
          className="relative w-full font-semibold bg-gradient-to-br from-blue-500 to-purple-600
            text-white disabled:text-customGray-1 disabled:bg-customWhite-3"
          onClick={handleOnClose}
        >
          Select
        </Button>
      </DialogContent>
    </Dialog>
  );
}
