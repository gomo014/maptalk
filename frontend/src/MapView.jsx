import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import './MapView.css';

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
  const [comment, setComment] = useState('');

  const handleMapClick = (latlng) => {
    setMarker(latlng);
    setComment(''); // 新しいマーカーを置くときはコメントをリセット
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // 本来はここでAPIにデータを送信します
    console.log('保存するコメント:', comment);
    console.log('場所:', marker);
    alert(`コメント「${comment}」を投稿しました！`);
    setComment('');
    // 必要に応じてポップアップを閉じる（マーカーを消す）こともできます
    // setMarker(null);
  }

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
          <Popup minWidth={200}>
            <div className="popup-form-container">
              <p>座標: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</p>
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="コメントを入力..."
                  className="comment-textarea"
                />
                <button type="submit" className="submit-button">
                  投稿
                </button>
              </form>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapView;