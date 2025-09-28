import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

function ClickableMap({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

function MapView() {
  const [marker, setMarker] = useState(null);

  const handleMapClick = (latlng) => {
    setMarker(latlng);
    // APIに保存処理を追加
  };

  return (
    <MapContainer
      center={[35.6895, 139.6917]}
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ClickableMap onClick={handleMapClick} />
      {marker && (
        <Marker position={[marker.lat, marker.lng]}>
          <Popup>
            座標: {marker.lat}, {marker.lng}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapView;