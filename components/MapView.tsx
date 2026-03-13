"use client";

import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { PLACES } from "@/lib/mock-data";

interface Props {
  onSelectPlace: (id: string) => void;
}

const PLACE_COORDS: Record<string, [number, number]> = {
  "1": [-74.0059, 40.7312],
  "2": [-74.0000, 40.7231],
  "3": [-73.9538, 40.7128],
  "4": [-73.9633, 40.7735],
  "5": [-73.9963, 40.7231],
  "6": [-74.0059, 40.7360],
};

function categoryEmoji(category: string) {
  if (category === "Restaurants") return "🍽️";
  if (category === "Coffee") return "☕";
  if (category === "Shopping") return "🛍️";
  return "🍸";
}

export default function MapView({ onSelectPlace }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div
        style={{ width: "100%", height: "100%" }}
        className="bg-[#0d0d0f] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3 text-center px-8">
          <div className="w-14 h-14 rounded-2xl bg-purple/20 border border-purple/30 flex items-center justify-center text-3xl">🗺️</div>
          <p className="font-bricolage font-bold text-white text-lg">Map Preview</p>
          <p className="text-white/40 font-jakarta text-sm">Add NEXT_PUBLIC_MAPBOX_TOKEN to enable</p>
        </div>
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{ longitude: -73.9857, latitude: 40.7484, zoom: 12.5 }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      attributionControl={false}
    >
      {PLACES.map((place) => {
        const coords = PLACE_COORDS[place.id];
        if (!coords) return null;
        return (
          <Marker
            key={place.id}
            longitude={coords[0]}
            latitude={coords[1]}
            onClick={() => onSelectPlace(place.id)}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "#7B2FFF",
                border: "2px solid #CAFF33",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(123,47,255,0.55)",
              }}
            >
              {categoryEmoji(place.category)}
            </div>
          </Marker>
        );
      })}
    </Map>
  );
}
