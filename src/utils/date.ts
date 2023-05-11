import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const fromNow = (timestamp: number) =>
  dayjs(new Date(timestamp)).fromNow();
