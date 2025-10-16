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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert('コメントを入力してください。');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment,
          lat: marker.lat,
          lng: marker.lng,
        }),
      });

      if (!response.ok) {
        throw new Error('データの保存に失敗しました。');
      }

      const newPin = await response.json();
      console.log('保存成功:', newPin);
      alert('投稿が保存されました！');
      setMarker(null); // 保存が成功したらマーカーを消す

    } catch (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました。');
    }
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