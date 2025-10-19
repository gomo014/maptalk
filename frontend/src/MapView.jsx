import { useState, useEffect, useRef } from 'react';
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

function MapView({ pins, onPinAdded, mapRefreshTrigger }) {
  const [marker, setMarker] = useState(null);
  const [comment, setComment] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      // 遅延させて invalidateSize を呼び出すことで、コンテナのサイズ変更が完了するのを待つ
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }
  }, [mapRefreshTrigger]);

  const handleMapClick = (latlng) => {
    setMarker(latlng);
    setComment('');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!marker) return;

    try {
      const response = await fetch('/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: marker.lat,
          lng: marker.lng,
          comment: comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post pin');
      }

      alert(`コメント「${comment}」を投稿しました！`);
      setComment('');
      setMarker(null); // 投稿後はフォーム用のマーカーを消す
      onPinAdded();   // Appコンポーネントに通知してピン一覧を更新
    } catch (error) {
      console.error("Error posting pin:", error);
      alert('投稿に失敗しました。');
    }
  }

  return (
    <MapContainer
      center={[35.6895, 139.6917]}
      zoom={13}
      ref={mapRef}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* 既存のピンを地図上に表示 */}
      {pins.map(pin => (
        <Marker key={pin.id} position={[pin.lat, pin.lng]}>
          <Popup>{pin.comment}</Popup>
        </Marker>
      ))}

      <ClickableMap onClick={handleMapClick} />
      {/* 新しいピンを立てるためのマーカーとポップアップ */}
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