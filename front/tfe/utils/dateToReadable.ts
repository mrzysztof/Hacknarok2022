import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";

dayjs.extend(isToday);
dayjs.extend(isTomorrow);

export const dateToReadable = (date: string | Date) => {
  const parsedDate = dayjs(date);
  if (parsedDate.isToday()) {
    return "Today";
  } else if (parsedDate.isTomorrow()) {
    return "Tomorrow";
  } else {
    return parsedDate.format("MMMM D, YYYY	");
  }
};
