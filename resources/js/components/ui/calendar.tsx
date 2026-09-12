import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();
  const startMonth = (props as Record<string, unknown>).startMonth as Date | undefined
    ?? new Date(currentYear - 80, 0);
  const endMonth = (props as Record<string, unknown>).endMonth as Date | undefined
    ?? new Date(currentYear + 20, 11);

  // v10: "dropdown-buttons" removed — map to "dropdown"
  const rawCaption = props.captionLayout as string | undefined;
  const captionLayout = (rawCaption === "dropdown-buttons" ? "dropdown" : rawCaption) as CalendarProps["captionLayout"];

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("relative p-3", className)}
      startMonth={startMonth}
      endMonth={endMonth}
      captionLayout={captionLayout}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "relative space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center gap-1 px-10",
        caption_label: "text-sm font-semibold text-[#315d45]",
        dropdowns: "flex justify-center gap-1.5 z-10",
        nav: "absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 rounded-full border-[#d4e8da] bg-white p-0 text-[#3f9567] opacity-100 shadow-sm hover:bg-[#edf8f1] hover:text-[#2f7d51] pointer-events-auto"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 rounded-full border-[#d4e8da] bg-white p-0 text-[#3f9567] opacity-100 shadow-sm hover:bg-[#edf8f1] hover:text-[#2f7d51] pointer-events-auto"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 rounded-full bg-transparent p-0 font-normal hover:bg-[#edf8f1] hover:text-[#2f7d51] focus-visible:ring-2 focus-visible:ring-[#5aa67a]/30 aria-selected:!bg-[#5aa67a] aria-selected:!text-white aria-selected:hover:!bg-[#4b946a] aria-selected:opacity-100"
        ),
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected: "bg-transparent",
        today: "!bg-[#e8f6ed] !text-[#315d45]",
        outside:
          "day-outside !text-[#9ca3af] [&>button]:!text-[#9ca3af] [&>button:hover]:!text-[#7f8a83] aria-selected:!bg-transparent aria-selected:!text-[#b7c0bb] aria-selected:opacity-70",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass, ...rest }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("h-4 w-4", chevronClass)} {...rest} />;
          }
          return <ChevronRight className={cn("h-4 w-4", chevronClass)} {...rest} />;
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
