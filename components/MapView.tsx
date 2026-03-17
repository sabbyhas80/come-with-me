"use client";

import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapPlace {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  creator_handle?: string;
}

interface Props {
  onSelectPlace: (id: string) => void;
  places: MapPlace[];
  selectedId?: string | null;
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

function categoryColor(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat === "restaurant" || cat === "restaurants") return "#FF6B6B";
  if (cat === "coffee") return "#C8956C";
  if (cat === "bar" || cat === "bars") return "#A78BFA";
  if (cat === "shopping") return "#34D399";
  if (cat === "attraction") return "#60A5FA";
  return "#7B2FFF";
}

export default function MapView({ onSelectPlace, places, selectedId }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div style={{ width: "100%", height: "100%" }} className="bg-[#e8e0d8] flex items-center justify-center">
        <p className="font-bricolage font-bold text-gray-600">Add NEXT_PUBLIC_MAPBOX_TOKEN to enable</p>
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{ longitude: -73.9857, latitude: 40.7484, zoom: 13.5 }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      attributionControl={false}
    >
      {places.map((place) => {
        const isSelected = place.id === selectedId;
        const color = categoryColor(place.category);
        return (
          <Marker
            key={place.id}
            longitude={place.longitude}
            latitude={place.latitude}
            onClick={() => onSelectPlace(place.id)}
            anchor="bottom"
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
              <div style={{
                background: "white",
                borderRadius: 20,
                padding: "3px 8px",
                marginBottom: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 4,
                transform: isSelected ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.15s ease",
                border: isSelected ? `2px solid ${color}` : "2px solid transparent",
              }}>
                <span style={{ fontSize: 11 }}>{categoryEmoji(place.category)}</span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  whiteSpace: "nowrap",
                  maxWidth: 100,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontFamily: "sans-serif",
                }}>
                  {place.name}
                </span>
              </div>
              <div style={{
                width: isSelected ? 14 : 10,
                height: isSelected ? 14 : 10,
                borderRadius: "50%",
                background: color,
                border: "2px solid white",
                boxShadow: `0 2px 8px ${color}88`,
                transition: "all 0.15s ease",
              }} />
            </div>
          </Marker>
        );
      })}
    </Map>
  );
}
