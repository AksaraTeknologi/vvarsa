import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { type SharedData } from "@/types"
import { usePage } from "@inertiajs/react"
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
  theme?: "owner" | "owner-green" | "admin" | "staff-pink";
}

export function DatePicker({ value, onChange, placeholder = "Pilih tanggal", disabled = false, className, theme = "owner" }: DatePickerProps) {
  const isOwnerGreen = theme === "owner-green"
  const isStaff = usePage<SharedData>().props.auth.user?.roles?.includes("staff")
  const resolvedTheme = isStaff ? "staff-pink" : theme
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
            resolvedTheme === "admin"
              ? "text-[#5E4BF2] hover:bg-[#F1EFFD] hover:text-[#4938D9] focus-visible:ring-[#5E4BF2]/30"
              : resolvedTheme === "staff-pink"
                ? "staff-date-picker !border-[#f3b7cc] text-[#d94f83] hover:bg-[#fff0f5] hover:text-[#b83268] focus-visible:!border-[#d94f83] focus-visible:ring-[#d94f83]/30"
                : "text-[#315d45] hover:bg-[#edf8f1] hover:text-[#2f7d51] focus-visible:ring-[#5aa67a]/30",
            !dateValue && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {dateValue ? format(dateValue, "dd MMMM yyyy", { locale: id }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("staff-date-picker-popover w-auto p-0", resolvedTheme === "admin" && "admin-date-picker-popover")} align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          captionLayout="label"
          classNames={resolvedTheme === "admin" ? {
            months: "flex flex-col",
            month: "relative space-y-3",
            month_caption: "relative flex h-9 items-center justify-center px-10",
            nav: "absolute inset-x-2 top-0.5 z-10 flex h-8 items-center justify-between pointer-events-none",
            caption_label: "text-sm font-semibold text-[#c4b5fd]",
            button_previous: "pointer-events-auto h-7 w-7 rounded-md border-[#8b5cf6] bg-[#24194a] p-0 text-[#e9d5ff] shadow-sm hover:bg-[#7c3aed] hover:text-white",
            button_next: "pointer-events-auto h-7 w-7 rounded-md border-[#8b5cf6] bg-[#24194a] p-0 text-[#e9d5ff] shadow-sm hover:bg-[#7c3aed] hover:text-white",
            month_grid: "w-[252px] table-fixed border-collapse",
            weekdays: "flex w-full",
            weekday: "flex h-7 flex-1 items-center justify-center text-xs font-medium text-[#a79fbd]",
            week: "mt-1 flex w-full",
            day: "flex h-8 flex-1 items-center justify-center p-0 text-center",
            day_button: "h-7 w-7 rounded-full bg-transparent p-0 font-normal text-[#e9d5ff] hover:bg-[#6d28d9] hover:text-white focus-visible:ring-2 focus-visible:ring-[#a78bfa]/40 aria-selected:!bg-[#8b5cf6] aria-selected:!text-white aria-selected:hover:!bg-[#a855f7]",
            today: "!bg-[#6d28d9] !text-white",
          } : resolvedTheme === "staff-pink" ? {
            caption_label: "text-sm font-semibold text-[#d94f83]",
            button_previous: "h-8 w-8 rounded-full border-[#f3b7cc] bg-white p-0 text-[#d94f83] shadow-sm hover:bg-[#fff0f5] hover:text-[#b83268]",
            button_next: "h-8 w-8 rounded-full border-[#f3b7cc] bg-white p-0 text-[#d94f83] shadow-sm hover:bg-[#fff0f5] hover:text-[#b83268]",
            day_button: "h-8 w-8 rounded-full bg-transparent p-0 font-normal hover:bg-[#fff0f5] hover:text-[#b83268] focus-visible:ring-2 focus-visible:ring-[#d94f83]/30 aria-selected:!bg-[#d94f83] aria-selected:!text-white aria-selected:hover:!bg-[#b83268] aria-selected:opacity-100",
            today: "!bg-[#fff0f5] !text-[#d94f83]",
          } : isOwnerGreen ? {
            caption_label: "text-sm font-semibold text-[#3f9567]",
            button_previous: "h-8 w-8 rounded-full border-[#d9e5dd] bg-white p-0 text-[#3f9567] shadow-sm hover:bg-[#edf8f1] hover:text-[#2f7d51]",
            button_next: "h-8 w-8 rounded-full border-[#d9e5dd] bg-white p-0 text-[#3f9567] shadow-sm hover:bg-[#edf8f1] hover:text-[#2f7d51]",
            day_button: "h-8 w-8 rounded-full bg-transparent p-0 font-normal hover:bg-[#edf8f1] hover:text-[#2f7d51] focus-visible:ring-2 focus-visible:ring-[#5aa67a]/30 aria-selected:!bg-[#3f9567] aria-selected:!text-white aria-selected:hover:!bg-[#2f7d51] aria-selected:opacity-100",
            today: "!bg-[#edf8f1] !text-[#3f9567]",
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
