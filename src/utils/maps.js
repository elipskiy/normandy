/**
 * Build a Google Maps directions URL from an array of stops.
 * Uses the `maps` field (search query URL) from each stop.
 * Falls back to stop name + place as a search query.
 */
export function buildDayRouteUrl(stops) {
  const points = stops
    .filter((s) => s.type !== "drive" && (s.maps || s.place || s.name))
    .map((s) => {
      if (s.maps) {
        // Extract the query param from the maps URL
        try {
          const url = new URL(s.maps);
          return url.searchParams.get("query") || s.name;
        } catch {
          return s.name;
        }
      }
      return s.place ? `${s.name},+${s.place},+France` : `${s.name},+France`;
    });

  if (points.length === 0) return null;
  if (points.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${points[0]}`;
  }

  const origin = points[0];
  const destination = points[points.length - 1];
  const waypoints = points.slice(1, -1).join("|");

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  if (waypoints) {
    url += `&waypoints=${waypoints}`;
  }
  return url;
}

/**
 * Build a Google Maps navigation URL to a specific stop.
 */
export function buildNavUrl(stop) {
  if (stop.maps) {
    try {
      const url = new URL(stop.maps);
      const query = url.searchParams.get("query");
      if (query) {
        return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
      }
    } catch {
      // fall through
    }
  }
  const query = stop.place
    ? `${stop.name},+${stop.place},+France`
    : `${stop.name},+France`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
