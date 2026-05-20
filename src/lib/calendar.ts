export function generateGoogleCalendarUrl({
  title,
  details,
  location,
  startDateIso,
  durationHours = 5,
}: {
  title: string;
  details: string;
  location: string;
  startDateIso: string;
  durationHours?: number;
}): string {
  const start = new Date(startDateIso);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  const formatIso = (date: Date) =>
    date.toISOString().replace(/-|:|\.\d+/g, '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${formatIso(start)}/${formatIso(end)}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(location)}`;
}
