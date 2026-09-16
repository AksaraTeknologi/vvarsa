import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    value?: Date | string;
    onChange?: (dateStr: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
  theme?: "owner" | "admin";
}

export function DatePicker({ value, onChange, placeholder = "Pilih tanggal", disabled = false, className, theme = "owner" }: DatePickerProps) {
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (!onChange) return;
    if (!date) {
      onChange("");
      return;
    }
    // Format as YYYY-MM-DD locally to avoid timezone shifts
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - (offset * 60 * 1000))
    const dateStr = localDate.toISOString().split('T')[0]
    onChange(dateStr);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start rounded-xl border-input bg-white px-3 py-1 text-left text-sm font-normal shadow-sm focus-visible:ring-2",
            theme === "admin"
              ? "text-[#5E4BF2] hover:bg-[#F1EFFD] hover:text-[#4938D9] focus-visible:ring-[#5E4BF2]/30"
              : "text-[#315d45] hover:bg-[#edf8f1] hover:text-[#2f7d51] focus-visible:ring-[#5aa67a]/30",
            !dateValue && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {dateValue ? format(dateValue, "dd MMMM yyyy", { locale: id }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          captionLayout="label"
          classNames={theme === "admin" ? {
            caption_label: "text-sm font-semibold text-[#5E4BF2]",
            button_previous: "h-8 w-8 rounded-full border-[#DCD8FF] bg-white p-0 text-[#5E4BF2] shadow-sm hover:bg-[#F1EFFD] hover:text-[#4938D9]",
            button_next: "h-8 w-8 rounded-full border-[#DCD8FF] bg-white p-0 text-[#5E4BF2] shadow-sm hover:bg-[#F1EFFD] hover:text-[#4938D9]",
            day_button: "h-8 w-8 rounded-full bg-transparent p-0 font-normal hover:bg-[#F1EFFD] hover:text-[#4938D9] focus-visible:ring-2 focus-visible:ring-[#5E4BF2]/30 aria-selected:!bg-[#5E4BF2] aria-selected:!text-white aria-selected:hover:!bg-[#4938D9]",
            today: "!bg-[#F1EFFD] !text-[#5E4BF2]",
          } : undefined}
        />
      </PopoverContent>
    </Popover>
  )
}

interface TimePickerProps {
    value?: string;
    onChange?: (time: string) => void;
    className?: string;
    theme?: "owner" | "admin";
}

export function TimePicker({ value = "", onChange, className, theme = "owner" }: TimePickerProps) {
  const [hour = "", minute = ""] = value.split(":")
  const isAdmin = theme === "admin"
  const selectedTimeClass = isAdmin ? "bg-[#F1EFFD] text-[#5E4BF2]" : "bg-[#edf8f1] text-[#2f7d51]"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 w-32 justify-start rounded-xl bg-white px-3 text-left text-sm font-normal shadow-sm",
            isAdmin
              ? "border-[#DCD8FF] text-[#5E4BF2] hover:bg-[#F1EFFD] hover:text-[#4938D9]"
              : "border-[#d9e5dd] text-[#315d45] hover:bg-[#edf8f1] hover:text-[#2f7d51]",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4 shrink-0 opacity-70" />
          {hour && minute ? `${hour}:${minute}` : <span className="text-muted-foreground">--:--</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className={cn("mb-2 grid grid-cols-2 gap-2 text-center text-xs font-semibold", isAdmin ? "text-[#5E4BF2]" : "text-[#315d45]")}>
          <span>Jam (00-23)</span>
          <span>Menit (00-59)</span>
        </div>
        <div className="flex gap-2">
          <div className={cn("flex max-h-56 w-16 flex-col gap-1 overflow-y-auto rounded-xl border p-1", isAdmin ? "border-[#DCD8FF]" : "border-[#d9e5dd]")}>
            {Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0")).map((item) => (
              <Button
                key={item}
                type="button"
                variant="ghost"
                className={cn("h-9 rounded-lg px-2 text-sm", item === hour && selectedTimeClass)}
                onClick={() => onChange?.(`${item}:${minute || "00"}`)}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className={cn("flex max-h-56 w-16 flex-col gap-1 overflow-y-auto rounded-xl border p-1", isAdmin ? "border-[#DCD8FF]" : "border-[#d9e5dd]")}>
            {Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0")).map((item) => (
              <Button
                key={item}
                type="button"
                variant="ghost"
                className={cn("h-9 rounded-lg px-2 text-sm", item === minute && selectedTimeClass)}
                onClick={() => onChange?.(`${hour || "00"}:${item}`)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
