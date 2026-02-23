import { useState, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import './MapView.css';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 35.6895,
  lng: 139.6917
};

function MapView({ pins, onPinAdded, mapRefreshTrigger }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [newPin, setNewPin] = useState(null);
  const [comment, setComment] = useState('');
  const [selectedPin, setSelectedPin] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (e) => {
    if (selectedPin || newPin) {
      setSelectedPin(null);
      setNewPin(null);
    } else {
      setNewPin({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
      setComment('');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newPin) return;

    const user = JSON.parse(localStorage.getItem('maptalk_user'));
    if (!user) {
      alert('ピンを投稿するにはログインが必要です。');
      return;
    }

    try {
      const response = await fetch('/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.user_id,
        },
        body: JSON.stringify({
          lat: newPin.lat,
          lng: newPin.lng,
          comment: comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post pin');
      }

      const newPinData = await response.json();

      alert(`コメント「${comment}」を投稿しました！`);
      setComment('');
      setNewPin(null);
      onPinAdded(newPinData); // Appコンポーネントに新しいピンを渡してUIを更新
    } catch (error) {
      console.error("Error posting pin:", error);
      alert('投稿に失敗しました。');
    }
  }

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <>
      <style>
        {`
          /* InfoWindowの閉じるボタンのスタイル */
          .gm-style-iw button.gm-ui-hover-effect {
            width: 12px !important;
            height: 12px !important;
            top: 3px !important;
            right: 3px !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            position: absolute !important;
            opacity: 1 !important;
            outline: none !important;
          }
          /* 元の画像を非表示 */
          .gm-style-iw button.gm-ui-hover-effect img {
            display: none !important;
          }
          /* ×印を描画 */
          .gm-style-iw button.gm-ui-hover-effect::before {
            content: "×";
            display: block !important;
            width: 100%;
            height: 100%;
            font-size: 12px;
            line-height: 12px;
            text-align: center;
            color: #666;
            font-family: sans-serif;
          }
        `}
      </style>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          clickableIcons: false,
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        }}
      >
      {pins.map(pin => (
        <Marker
          key={pin.id}
          position={{ lat: pin.lat, lng: pin.lng }}
          onClick={() => {
            setSelectedPin(pin);
            setNewPin(null);
          }}
        />
      ))}

      {selectedPin && (
        <InfoWindow
          position={{ lat: selectedPin.lat, lng: selectedPin.lng }}
          onCloseClick={() => setSelectedPin(null)}
        >
          <div style={{ color: '#333' }}>{selectedPin.comment}</div>
        </InfoWindow>
      )}

      {newPin && (
        <Marker position={newPin}>
          <InfoWindow
            position={newPin}
            onCloseClick={() => setNewPin(null)}
          >
            <div className="popup-form-container">
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="コメントを入力..."
                  className="comment-textarea"
                  style={{ height: '60px', marginBottom: '5px' }}
                />
                <button type="submit" className="submit-button">
                  投稿
                </button>
              </form>
            </div>
          </InfoWindow>
        </Marker>
      )}
      </GoogleMap>
    </>
  );
}

export default memo(MapView);