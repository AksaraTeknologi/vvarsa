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
  theme?: "owner" | "owner-green" | "admin" | "staff-pink" | "supervisor-blue";
}

export function DatePicker({ value, onChange, placeholder = "Pilih tanggal", disabled = false, className, theme = "owner" }: DatePickerProps) {
  const isOwnerTheme = theme === "owner" || theme === "owner-green"
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const roles = usePage<SharedData>().props.auth.user?.roles ?? []
  const isStaff = roles.includes("staff")
  const isSupervisor = roles.includes("supervisor")
  const resolvedTheme = isStaff ? "staff-pink" : isSupervisor && isDarkMode ? "supervisor-blue" : theme
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
                : isOwnerTheme
                  ? isDarkMode
                    ? "border-[#2d4f3d] bg-[#0f261e] text-[#ebfff4] hover:bg-[#123b2f] hover:text-[#dfffea] focus-visible:ring-[#5aa67a]/30"
                    : "border-[#3f9567] bg-[#edf9f1] text-[#1d6e4b] hover:bg-[#def2e4] hover:text-[#124d39] focus-visible:ring-[#5aa67a]/30"
                  : "border-[#2d4f3d] bg-[#0f261e] text-[#ebfff4] hover:bg-[#123b2f] hover:text-[#dfffea] focus-visible:ring-[#5aa67a]/30",
            !dateValue && (isDarkMode ? "text-[#b8f5d1]" : "text-[#1d6e4b]"),
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {dateValue ? format(dateValue, "dd MMMM yyyy", { locale: id }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "owner-date-picker-popover staff-date-picker-popover w-auto border-[#2d4f3d] p-0 shadow-[0_20px_45px_rgba(0,0,0,0.4)]",
          isDarkMode && "bg-[#07160e] text-[#ebfff4]",
          !isDarkMode && isOwnerTheme && "border-[#dfeee7] bg-white text-[#1d2a22] shadow-[0_16px_40px_rgba(34,52,42,0.12)]",
          resolvedTheme === "admin" && "admin-date-picker-popover",
        )}
        align="start"
      >
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          captionLayout="label"
          classNames={resolvedTheme === "supervisor-blue" ? {
            caption_label: "text-sm font-semibold text-[#69c5e4]",
            button_previous: "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border-[#28516a] bg-[#132b3b] p-0 text-[#69c5e4] shadow-sm hover:bg-[#1684ad] hover:text-white",
            button_next: "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border-[#28516a] bg-[#132b3b] p-0 text-[#69c5e4] shadow-sm hover:bg-[#1684ad] hover:text-white",
            weekday: "flex h-7 flex-1 items-center justify-center text-xs font-medium text-[#96adba]",
            day_button: "h-8 w-8 rounded-full bg-transparent p-0 font-normal text-[#dce9f0] hover:bg-[#153247] hover:text-[#69c5e4] focus-visible:ring-2 focus-visible:ring-[#36a9d1]/40 aria-selected:!bg-[#1684ad] aria-selected:!text-white aria-selected:hover:!bg-[#1b99c4]",
            selected: "!bg-[#1684ad] !text-white",
            today: "!bg-[#153247] !text-[#69c5e4]",
          } : resolvedTheme === "admin" ? {
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
            caption_label: isDarkMode ? "text-sm font-semibold text-[#f9a8d4]" : "text-sm font-semibold text-[#d94f83]",
            weekday: isDarkMode
              ? "flex h-7 flex-1 items-center justify-center text-xs font-medium text-[#c7b5c0]"
              : "flex h-7 flex-1 items-center justify-center text-xs font-medium text-[#a75b79]",
            button_previous: isDarkMode
              ? "h-8 w-8 rounded-full border-[#493342] bg-[#171219] p-0 text-[#f9a8d4] shadow-sm hover:bg-[#351525] hover:text-[#fff7fb]"
              : "h-8 w-8 rounded-full border-[#f3b7cc] bg-white p-0 text-[#d94f83] shadow-sm hover:bg-[#fff0f5] hover:text-[#b83268]",
            button_next: isDarkMode
              ? "h-8 w-8 rounded-full border-[#493342] bg-[#171219] p-0 text-[#f9a8d4] shadow-sm hover:bg-[#351525] hover:text-[#fff7fb]"
              : "h-8 w-8 rounded-full border-[#f3b7cc] bg-white p-0 text-[#d94f83] shadow-sm hover:bg-[#fff0f5] hover:text-[#b83268]",
            day_button: isDarkMode
              ? "h-8 w-8 rounded-full bg-transparent p-0 font-normal text-[#f8f3f6] hover:bg-[#351525] hover:text-[#f9a8d4] focus-visible:ring-2 focus-visible:ring-[#ec4899]/35 aria-selected:!bg-[#db2777] aria-selected:!text-white aria-selected:hover:!bg-[#be185d] aria-selected:opacity-100"
              : "h-8 w-8 rounded-full bg-transparent p-0 font-normal text-[#5a1830] hover:bg-[#fff0f5] hover:text-[#b83268] focus-visible:ring-2 focus-visible:ring-[#d94f83]/30 aria-selected:!bg-[#d94f83] aria-selected:!text-white aria-selected:hover:!bg-[#b83268] aria-selected:opacity-100",
            today: isDarkMode ? "!bg-[#351525] !text-[#f9a8d4]" : "!bg-[#fff0f5] !text-[#d94f83]",
          } : isOwnerTheme ? {
            months: "flex flex-col",
            month: "relative space-y-3",
            month_caption: "relative mt-3 flex h-9 items-center justify-center px-10",
            nav: "absolute inset-x-2 top-5 z-10 flex h-8 items-center justify-between pointer-events-none",
            caption_label: !isDarkMode ? "text-sm font-semibold text-[#1d6e4b]" : "text-sm font-semibold text-[#dfffea]",
            button_previous: !isDarkMode
              ? "owner-calendar-nav pointer-events-auto h-8 w-8 rounded-full border-[#a9d7b9] bg-[#edf9f1] p-0 text-[#1d6e4b] shadow-sm hover:bg-[#def2e4] hover:text-[#124d39]"
              : "owner-calendar-nav pointer-events-auto h-8 w-8 rounded-full border-[#2d4f3d] bg-[#0d2516] p-0 text-[#7fe0aa] shadow-sm hover:bg-[#123320] hover:text-[#dfffea]",
            button_next: !isDarkMode
              ? "owner-calendar-nav pointer-events-auto h-8 w-8 rounded-full border-[#a9d7b9] bg-[#edf9f1] p-0 text-[#1d6e4b] shadow-sm hover:bg-[#def2e4] hover:text-[#124d39]"
              : "owner-calendar-nav pointer-events-auto h-8 w-8 rounded-full border-[#2d4f3d] bg-[#0d2516] p-0 text-[#7fe0aa] shadow-sm hover:bg-[#123320] hover:text-[#dfffea]",
            month_grid: "w-[252px] table-fixed border-collapse",
            weekdays: "flex w-full",
            weekday: !isDarkMode ? "flex h-7 flex-1 items-center justify-center text-xs font-medium text-[#4e7d62]" : "flex h-7 flex-1 items-center justify-center text-xs font-medium text-[#9bb8a5]",
            week: "mt-1 flex w-full",
            day: "flex h-8 flex-1 items-center justify-center p-0 text-center",
            day_button: !isDarkMode
              ? "mt-1 h-8 w-8 rounded-full bg-transparent p-0 font-normal text-[#1d2a22] hover:bg-[#def2e4] hover:text-[#124d39] focus-visible:ring-2 focus-visible:ring-[#5aa67a]/30 aria-selected:!bg-[#3f9567] aria-selected:!text-white aria-selected:hover:!bg-[#2f7d51] aria-selected:opacity-100"
              : "mt-1 h-8 w-8 rounded-full bg-transparent p-0 font-normal text-[#ebfff4] hover:bg-[#123b2f] hover:text-[#dfffea] focus-visible:ring-2 focus-visible:ring-[#5aa67a]/30 aria-selected:!bg-[#1d7b50] aria-selected:!text-white aria-selected:hover:!bg-[#2f9d67] aria-selected:opacity-100",
            today: !isDarkMode ? "!bg-[#edf9f1] !text-[#1d6e4b]" : "!bg-[#123b2f] !text-[#dfffea]",
            outside: !isDarkMode ? "!text-[#8aa393] [&>button]:!text-[#8aa393] aria-selected:!bg-transparent aria-selected:!text-[#8aa393]" : "!text-[#6d7d73] [&>button]:!text-[#6d7d73] aria-selected:!bg-transparent aria-selected:!text-[#6d7d73]",
            disabled: !isDarkMode ? "!text-[#a5b3ac] opacity-50" : "!text-[#4b5d53] opacity-50",
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
