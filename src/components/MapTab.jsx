import { useEffect, useRef, useState } from "react";
import { DAYS } from "../data/days";

const TYPE_COLORS = {
  main: "#e94560",
  sleep: "#3b82f6",
  optional: "#9ca3af",
  food: "#22c55e",
  photo: "#a78bfa",
};

const TYPE_LABELS = {
  main: "Главные",
  sleep: "Ночёвки",
  optional: "Опциональные",
  food: "Еда",
  photo: "Фото",
};

const ALL_TYPES = Object.keys(TYPE_LABELS);

export default function MapTab() {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const activeDayRef = useRef("all");
  const activeTypesRef = useRef(new Set(ALL_TYPES));

  const [activeDay, setActiveDay] = useState("all");
  const [activeTypes, setActiveTypes] = useState(new Set(ALL_TYPES));

  // Fit map height to remaining viewport below header + tabs + controls
  useEffect(() => {
    function setHeight() {
      const header = document.querySelector(".header");
      const tabs = document.querySelector(".tabs");
      const controls = document.querySelector(".map-controls");
      const headerH = header?.offsetHeight ?? 0;
      const tabsH = tabs?.offsetHeight ?? 0;
      const controlsH = controls?.offsetHeight ?? 0;
      if (mapDivRef.current) {
        mapDivRef.current.style.height = `${
          window.innerHeight - headerH - tabsH - controlsH
        }px`;
      }
    }
    const t = setTimeout(setHeight, 0);
    window.addEventListener("resize", setHeight);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", setHeight);
    };
  }, []);

  // Load Google Maps JS API
  useEffect(() => {
    if (window.google?.maps) {
      initMap();
      return;
    }
    const key = window.NORMANDY_CONFIG?.GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.error("[MapTab] NORMANDY_CONFIG.GOOGLE_MAPS_API_KEY is not set");
      return;
    }
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Script already injected but not yet loaded — wait for callback
      window.__normandyMapInit = initMap;
      return;
    }
    window.__normandyMapInit = initMap;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=__normandyMapInit`;
    script.async = true;
    document.head.appendChild(script);
    return () => {
      delete window.__normandyMapInit;
    };
  }, []);

  function initMap() {
    if (!mapDivRef.current) return;
    mapRef.current = new window.google.maps.Map(mapDivRef.current, {
      zoom: 7,
      center: { lat: 49.0, lng: -0.8 },
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      mapTypeControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });
    renderMarkers(activeDayRef.current, activeTypesRef.current);
    renderRoutes(activeDayRef.current);
  }

  function buildAllPoints() {
    const points = [];
    DAYS.forEach((day, dayIndex) => {
      (day.stops || []).forEach((stop) => {
        if (stop.type !== "drive" && stop.coordinates) {
          points.push({ ...stop, pointType: stop.type, dayIndex });
        }
      });
      (day.food || []).forEach((item) => {
        if (item.coordinates) {
          points.push({ ...item, pointType: "food", dayIndex });
        }
      });
      (day.markets || []).forEach((item) => {
        if (item.coordinates) {
          points.push({ ...item, pointType: "food", dayIndex });
        }
      });
      (day.nearby || []).forEach((item) => {
        if (item.coordinates) {
          points.push({
            ...item,
            pointType: item.type === "photo" ? "photo" : "optional",
            dayIndex,
          });
        }
      });
    });
    return points;
  }

  function buildInfoContent(point) {
    const dayName = DAYS[point.dayIndex]?.day ?? "";
    const photoHtml = point.photo
      ? `<img src="${point.photo}" alt="${point.name}" style="width:100%;max-height:110px;object-fit:cover;border-radius:4px;margin-bottom:6px;">`
      : "";
    const ratingHtml = point.rating
      ? `<div style="font-size:11px;color:#888;margin-top:2px;">★ ${point.rating}</div>`
      : "";
    const descHtml = point.desc
      ? `<p style="font-size:12px;margin:5px 0;color:#444;line-height:1.4;">${point.desc}</p>`
      : "";
    const mapsHtml = point.maps
      ? `<a href="${point.maps}" target="_blank" rel="noopener" style="font-size:12px;color:#3b82f6;text-decoration:none;">Открыть в Maps →</a>`
      : "";
    return `
      <div style="max-width:230px;font-family:'Source Sans 3',sans-serif;padding:2px;">
        ${photoHtml}
        <div style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">${dayName}</div>
        <strong style="font-size:14px;color:#2c2416;display:block;">${point.name}</strong>
        ${ratingHtml}
        ${descHtml}
        ${mapsHtml}
      </div>
    `;
  }

  function renderMarkers(day, types) {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (!mapRef.current) return;

    const infoWindow = new window.google.maps.InfoWindow();
    const filtered = buildAllPoints().filter(
      (p) => (day === "all" || p.dayIndex === day) && types.has(p.pointType)
    );

    filtered.forEach((point) => {
      const marker = new window.google.maps.Marker({
        position: { lat: point.coordinates[0], lng: point.coordinates[1] },
        map: mapRef.current,
        title: point.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: TYPE_COLORS[point.pointType],
          fillOpacity: 0.95,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      marker.addListener("click", () => {
        infoWindow.setContent(buildInfoContent(point));
        infoWindow.open(mapRef.current, marker);
      });
      markersRef.current.push(marker);
    });
  }

  function renderRoutes(day) {
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    if (!mapRef.current) return;

    const indices = day === "all" ? DAYS.map((_, i) => i) : [day];
    indices.forEach((dayIndex) => {
      const waypoints = (DAYS[dayIndex].stops || [])
        .filter((s) => (s.type === "main" || s.type === "sleep") && s.coordinates)
        .map((s) => s.coordinates);
      if (waypoints.length < 2) return;

      const line = new window.google.maps.Polyline({
        path: waypoints.map(([lat, lng]) => ({ lat, lng })),
        geodesic: true,
        strokeColor: "#3b82f6",
        strokeOpacity: 0.5,
        strokeWeight: 3,
        map: mapRef.current,
      });
      polylinesRef.current.push(line);
    });
  }

  function handleDayChange(day) {
    activeDayRef.current = day;
    setActiveDay(day);
    if (mapRef.current) {
      renderMarkers(day, activeTypesRef.current);
      renderRoutes(day);
    }
  }

  function handleTypeToggle(type) {
    const next = new Set(activeTypesRef.current);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    activeTypesRef.current = next;
    setActiveTypes(new Set(next));
    if (mapRef.current) renderMarkers(activeDayRef.current, next);
  }

  return (
    <div className="map-tab">
      <div className="map-controls">
        <div className="map-day-filter">
          <button
            className={`map-day-btn${activeDay === "all" ? " active" : ""}`}
            onClick={() => handleDayChange("all")}
          >
            Все
          </button>
          {DAYS.map((d, i) => (
            <button
              key={i}
              className={`map-day-btn${activeDay === i ? " active" : ""}`}
              onClick={() => handleDayChange(i)}
            >
              {d.day}
            </button>
          ))}
        </div>
        <div className="map-type-filter">
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              className={`map-chip${activeTypes.has(type) ? " active" : ""}`}
              style={{ "--chip-color": TYPE_COLORS[type] }}
              onClick={() => handleTypeToggle(type)}
            >
              ● {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>
      <div ref={mapDivRef} className="map-container" />
    </div>
  );
}
