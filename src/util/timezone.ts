import { addMinutes, subMinutes } from "date-fns";

export const convertLocalToUTC = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return offset > 0
    ? subMinutes(date, offset)
    : addMinutes(date, Math.abs(offset));
};

export const convertUTCToLocal = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return offset > 0
    ? addMinutes(date, offset)
    : subMinutes(date, Math.abs(offset));
};
