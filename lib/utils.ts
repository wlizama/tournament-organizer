import { ClassValue, clsx } from "clsx";
import { formatInTimeZone } from "date-fns-tz";
import { twMerge } from "tailwind-merge";
import useSWR from "swr";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleDateTimeChange(
  date: string,
  time: string,
  timeZone: string
) {
  if (date !== "" && time !== "") {
    const dateTime = `${date}T${time} ${timeZone}`;
    const dateTimeStringFormat = "yyyy-MM-dd'T'HH:mmxxx";
    const formattedDateTime = formatInTimeZone(
      dateTime,
      timeZone,
      dateTimeStringFormat
    );

    return formattedDateTime;
  }
}

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export function useTournament(id: string) {
  const { data, error, isLoading } = useSWR(`/api/tournaments/${id}`, fetcher);

  return {
    tournament: data,
    isLoading,
    error,
  };
}
