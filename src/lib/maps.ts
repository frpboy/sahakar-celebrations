export function getGoogleMapsQueryEmbedUrl(placeQuery: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    placeQuery
  )}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
}

export function getGoogleMapsShortlink(shortlinkOrQuery: string): string {
  if (shortlinkOrQuery.startsWith('http')) return shortlinkOrQuery;
  return `https://maps.google.com/?q=${encodeURIComponent(shortlinkOrQuery)}`;
}
