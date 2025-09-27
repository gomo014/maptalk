import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MapView() {
  return (
    <MapContainer center={[35.6895, 139.6917]} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[35.6895, 139.6917]}>
        <Popup>
          東京
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapView;