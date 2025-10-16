"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "../lib/leaflet";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Property:", property); // Log property
    const fetchCoords = async () => {
      try {
        // Validate and clean address fields
        const {
          street = "",
          city = "",
          state = "",
          zip = "",
        } = property.location || {};
        if (!city && !state) {
          throw new Error("At least city or state is required for geocoding");
        }

        // Try multiple address formats
        const addressAttempts = [
          [street, city, state, zip].filter(Boolean).join(" ").trim(), // Full address
          [city, state].filter(Boolean).join(" ").trim(), // City + state
          city || state, // City or state
        ].filter(Boolean);

        console.log("Address attempts:", addressAttempts); // Log all attempts

        let coords = null;
        for (let i = 0; i < addressAttempts.length; i++) {
          const address = addressAttempts[i];
          console.log(`Attempt ${i + 1} - Geocoding address:`, address);

          // Respect Nominatim rate limits
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              address
            )}&format=json&limit=1`,
            {
              headers: {
                "User-Agent": "MyPropertyMapApp/1.0", // Replace with your app name
              },
            }
          );
          console.log(
            `Attempt ${i + 1} - Nominatim response status:`,
            response.status
          ); // Log status
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log(`Attempt ${i + 1} - Nominatim response data:`, data); // Log response

          if (data.length > 0) {
            const { lat, lon } = data[0];
            console.log("Coordinates found:", { lat, lon }); // Log coordinates
            coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
            break;
          }
        }

        if (!coords) {
          setGeocodeError(true);
          setErrorMessage("No results found for any address format");
          return;
        }

        setLat(coords.lat);
        setLng(coords.lng);
      } catch (error) {
        console.error("Geocoding error:", error);
        setGeocodeError(true);
        setErrorMessage(error.message || "Failed to fetch coordinates");
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, [property]);

  console.log("State:", { lat, lng, loading, geocodeError, errorMessage }); // Log state

  if (loading) return <div>Loading map...</div>;
  if (geocodeError || !lat || !lng)
    return <div>Unable to load map for this address: {errorMessage}</div>;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lng]}>
        <Popup>
          {property.location.street ? `${property.location.street}, ` : ""}
          {property.location.city}, {property.location.state}{" "}
          {property.location.zipcode}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default PropertyMap;
