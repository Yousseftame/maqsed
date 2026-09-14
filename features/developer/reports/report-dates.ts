export type DateRange = {
  start: number;
  end: number;
};

export function toMillis(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }
  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) return numeric;
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }
  if (typeof value === "object") {
    const stamp = value as {
      toMillis?: () => number;
      toDate?: () => Date;
      seconds?: number;
    };
    if (typeof stamp.toMillis === "function") {
      const ms = stamp.toMillis();
      return Number.isFinite(ms) && ms > 0 ? ms : null;
    }
    if (typeof stamp.toDate === "function") {
      const ms = stamp.toDate().getTime();
      return Number.isFinite(ms) && ms > 0 ? ms : null;
    }
    if (typeof stamp.seconds === "number" && Number.isFinite(stamp.seconds)) {
      const ms = stamp.seconds * 1000;
      return ms > 0 ? ms : null;
    }
  }
  return null;
}

export function inRange(ms: number, range: DateRange) {
  return ms >= range.start && ms < range.end;
}

export function monthValueFromDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function parseMonthValue(value: string): { year: number; monthIndex: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(String(value || "").trim());
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return null;
  if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) return null;
  return { year, monthIndex };
}

export function monthRange(year: number, monthIndex: number): DateRange {
  return {
    start: new Date(year, monthIndex, 1, 0, 0, 0, 0).getTime(),
    end: new Date(year, monthIndex + 1, 1, 0, 0, 0, 0).getTime(),
  };
}

export function previousMonthRange(year: number, monthIndex: number): DateRange {
  return monthRange(year, monthIndex - 1);
}

export function formatDay(ms: number, isRtl: boolean) {
  return new Intl.DateTimeFormat(isRtl ? "ar-EG" : "en-GB", {
    calendar: "gregory",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(ms));
}

export function formatMonthTitle(year: number, monthIndex: number, isRtl: boolean) {
  return new Intl.DateTimeFormat(isRtl ? "ar-EG" : "en-GB", {
    calendar: "gregory",
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthIndex, 1));
}
