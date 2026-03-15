"use client";

import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapPlace {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
}

interface Props {
  onSelectPlace: (id: string) => void;
  places: MapPlace[];
}

function categoryEmoji(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat === "restaurant" || cat === "restaurants") return "🍽️";
  if (cat === "coffee") return "☕";
  if (cat === "bar" || cat === "bars") return "🍸";
  if (cat === "shopping") return "🛍️";
  if (cat === "attraction") return "🎭";
  return "📍";
}

export default function MapView({ onSelectPlace, places }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div
        style={{ width: "100%", height: "100%" }}
        className="bg-[#0d0d0f] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3 text-center px-8">
          <div className="w-14 h-14 rounded-2xl bg-purple/20 border border-purple/30 flex items-center justify-center text-3xl">
            🗺️
          </div>
          <p className="font-bricolage font-bold text-white text-lg">
            Map Preview
          </p>
          <p className="text-white/40 font-jakarta text-sm">
            Add NEXT_PUBLIC_MAPBOX_TOKEN to enable
          </p>
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
      {places.map((place) => (
        <Marker
          key={place.id}
          longitude={place.longitude}
          latitude={place.latitude}
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
      ))}
    </Map>
  );
}
