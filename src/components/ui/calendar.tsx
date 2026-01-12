import * as React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { DayPicker, DropdownProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <div className="flex flex-col bg-[#0a0518]/95 backdrop-blur-xl border border-secondary/20 rounded-2xl shadow-2xl p-4 min-w-[280px]">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <h3 className="text-xs font-black text-secondary uppercase tracking-[0.2em]">Select Birth Date</h3>
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-secondary/40 animate-pulse" />
          <div className="h-1.5 w-1.5 rounded-full bg-secondary/60 animate-pulse delay-75" />
          <div className="h-1.5 w-1.5 rounded-full bg-secondary/80 animate-pulse delay-150" />
        </div>
      </div>

      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-0", className)}
        classNames={{
          months: "flex flex-col space-y-4",
          month: "space-y-4",
          caption: "flex flex-col gap-3 pt-1 relative items-center",
          caption_label: "hidden",
          caption_dropdowns: "flex justify-between items-center w-full gap-2 z-10 px-1",
          dropdown: cn(
            "h-8 rounded-lg border border-secondary/30 bg-secondary/5 px-2 py-1 text-[11px] font-bold text-white shadow-inner transition-all hover:border-secondary/60 hover:bg-secondary/10 focus:ring-1 focus:ring-secondary/50",
            "appearance-none cursor-pointer w-full"
          ),
          dropdown_month: "relative flex flex-col items-start gap-1 flex-1",
          dropdown_year: "relative flex flex-col items-start gap-1 flex-1",
          dropdown_icon: "hidden",
          nav: "flex items-center absolute right-0 top-0 hidden", // Hide nav when dropdowns are active
          table: "w-full border-collapse",
          head_row: "flex justify-between mb-2",
          head_cell: "text-secondary/40 rounded-md w-9 font-bold text-[10px] uppercase tracking-wider text-center",
          row: "flex w-full justify-between mt-1.5",
          cell: "h-9 w-9 text-center text-[11px] p-0 relative focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-medium transition-all hover:bg-secondary/20 hover:text-secondary rounded-xl"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-secondary text-secondary-foreground font-black shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:bg-secondary hover:text-secondary-foreground scale-110 z-10",
          day_today: "bg-white/10 text-white font-black border border-white/20",
          day_outside:
            "day-outside text-muted-foreground/20 opacity-30 pointer-events-none",
          day_disabled: "text-muted-foreground opacity-30",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
          Dropdown: ({ name, ...props }: DropdownProps) => {
            const isMonth = name === "months";
            const [isOpen, setIsOpen] = React.useState(false);
            const dropdownRef = React.useRef<HTMLDivElement>(null);

            const options = React.Children.toArray(props.children) as React.ReactElement[];
            const selectedOption = options.find((opt) => opt.props.value === props.value);
            const selectedLabel = selectedOption?.props.children ?? (isMonth ? "Month" : "Year");

            React.useEffect(() => {
              const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                  setIsOpen(false);
                }
              };
              document.addEventListener("mousedown", handleClickOutside);
              return () => document.removeEventListener("mousedown", handleClickOutside);
            }, []);

            // Auto-scroll to selected year when opened
            React.useEffect(() => {
              if (isOpen && dropdownRef.current) {
                const scrollContainer = dropdownRef.current.querySelector(".max-h-\\[200px\\]");
                const selectedBtn = scrollContainer?.querySelector(".bg-secondary\\/20, .bg-secondary");
                if (selectedBtn && scrollContainer) {
                  (scrollContainer as HTMLElement).scrollTop = (selectedBtn as HTMLElement).offsetTop - 10;
                } else if (!isMonth && scrollContainer) {
                  const years = Array.from(scrollContainer.querySelectorAll("button"));
                  const year2000Btn = years.find(b => b.textContent?.trim() === "2000");
                  if (year2000Btn) {
                    (scrollContainer as HTMLElement).scrollTop = (year2000Btn as HTMLElement).offsetTop - 10;
                  }
                }
              }
            }, [isOpen, isMonth]);

            return (
              <div className="flex flex-col w-full gap-1.5 relative" ref={dropdownRef}>
                <span className="text-[10px] font-black text-secondary/70 uppercase tracking-[0.15em] pl-1">
                  {isMonth ? "Month" : "Year"}
                </span>

                <button
                  className="h-10 w-full rounded-xl border border-secondary/30 bg-[#1a1235] px-4 pr-10 text-xs font-bold text-white shadow-lg transition-all hover:border-secondary/60 hover:bg-[#251b4a] flex items-center justify-between text-left relative group/btn overflow-hidden"
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                >
                  <span className="truncate">{selectedLabel}</span>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary transition-all duration-300 group-hover/btn:scale-110 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]">
                    <span className="material-icons-round text-lg leading-none">
                      {isOpen ? "expand_less" : "expand_more"}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="absolute top-[100%] left-0 w-full mt-2 bg-[#0a0518] border border-secondary/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-[200px] overflow-y-auto py-1 custom-scrollbar-premium">
                      {options.map((opt) => {
                        const isSelected = opt.props.value === props.value;
                        return (
                          <button
                            key={opt.props.value}
                            className={cn(
                              "w-full px-4 py-2.5 text-left text-xs font-bold transition-all flex items-center justify-between group/opt",
                              isSelected
                                ? "bg-secondary text-secondary-foreground border-l-2 border-secondary"
                                : "text-white/70 hover:bg-secondary/10 hover:text-white"
                            )}
                            onClick={() => {
                              if (props.onChange) {
                                const event = {
                                  target: { value: opt.props.value },
                                } as React.ChangeEvent<HTMLSelectElement>;
                                props.onChange(event);
                              }
                              setIsOpen(false);
                            }}
                            type="button"
                          >
                            <span>{opt.props.children}</span>
                            {isSelected && <Check className="h-3 w-3 text-secondary-foreground" />}
                            {!isSelected && <div className="h-1 w-1 rounded-full bg-secondary/0 group-hover/opt:bg-secondary/40 transition-all font-normal" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        }}
        {...props}
      />
      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <p className="text-[9px] text-white/30 font-medium uppercase tracking-widest">Select your date to continue</p>
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
