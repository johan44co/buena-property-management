import { addMinutes, subMinutes } from "date-fns";

export const adjustForTimezone = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return offset > 0
    ? subMinutes(date, offset)
    : addMinutes(date, Math.abs(offset));
};

export const formatForTimezone = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return offset > 0
    ? addMinutes(date, offset)
    : subMinutes(date, Math.abs(offset));
};
