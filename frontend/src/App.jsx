import { useState, useEffect } from 'react';
import './App.css'
import MapView from './MapView';
import Timeline from './Timeline';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import UserMenu from './UserMenu';

function App() {
  const [displayedPins, setDisplayedPins] = useState([]);
  const [newPins, setNewPins] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [mapRefreshTrigger, setMapRefreshTrigger] = useState(0);

  // 2週間以内のピンのみをフィルタリングする関数
  const filterPinsByAge = (pins) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    return pins.filter(pin => {
      const createdAt = new Date(pin.created_at);
      return createdAt >= twoWeeksAgo;
    });
  };

  // 新しいピンがないか確認する関数
  const checkForNewPins = async () => {
    try {
      const headers = {};
      if (currentUser) {
        headers['X-User-ID'] = currentUser.user_id;
      }
      const response = await fetch('/api/pins', {
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pins');
      }
      const allPins = await response.json() || [];

      const displayedPinIds = new Set(displayedPins.map(p => p.id));
      const currentNewPinIds = new Set(newPins.map(p => p.id));

      const latestPins = allPins.filter(
        p => !displayedPinIds.has(p.id) && !currentNewPinIds.has(p.id)
      );

      if (latestPins.length > 0) {
        setNewPins(prev => [...latestPins, ...prev]);
      }
    } catch (error) {
      console.error("Error fetching pins:", error);
    }
  };

  // 初回ロード時
  useEffect(() => {
    // ログイン状態を確認
    const user = localStorage.getItem('maptalk_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    const initialFetch = async () => {
      try {
        const headers = {};
        const user = localStorage.getItem('maptalk_user');
        if (user) {
          headers['X-User-ID'] = JSON.parse(user).user_id;
        }
        const response = await fetch('/api/pins', { headers });
        const data = await response.json();
        setDisplayedPins(data || []);
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };
    initialFetch();
  }, []);

  // 15秒ごとに新しいピンをチェック
  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewPins();
    }, 15000);
    return () => clearInterval(interval);
  }, [displayedPins, newPins]); // displayedPins, newPins が更新されたら依存関係を更新

  const handleAllotmentChange = () => {
    setMapRefreshTrigger(c => c + 1);
  };

  const showNewPins = () => {
    setDisplayedPins(prev => [...newPins, ...prev]);
    setNewPins([]);
  };

  const addPin = (newPin) => {
    // 新しいピンを表示されているピンリストの先頭に追加
    setDisplayedPins(prev => [newPin, ...prev]);
  };

  const handleLikeToggle = async (pinId, liked) => {
    // UIを即座に更新（楽観的更新）
    const updatePins = (pins) =>
      pins.map((p) => {
        if (p.id === pinId) {
          return {
            ...p,
            liked: !liked,
            like_count: liked ? p.like_count - 1 : p.like_count + 1,
          };
        }
        return p;
      });
    setDisplayedPins(pins => updatePins(pins));
    if (newPins.length > 0) {
      setNewPins(pins => updatePins(pins));
    }

    // APIリクエスト
    const method = liked ? 'DELETE' : 'POST';
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser) {
        headers['X-User-ID'] = currentUser.user_id;
      }
      const response = await fetch(`/api/pins/${pinId}/like`, {
        method: method,
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Like/Unlike failed');
      }
      // 成功時は何もしない（UIは更新済みのため）
    } catch (error) {
      console.error('Error toggling like:', error);
      // 失敗した場合はUIを元に戻す（今回は簡略化）
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('maptalk_user');
    setCurrentUser(null);
    // 必要に応じてページをリロードしても良い
    // window.location.reload();
  };

  return (
    <div className="app-container">
      <UserMenu currentUser={currentUser} onLogout={handleLogout} />
      <Allotment onChange={handleAllotmentChange}>
        <Allotment.Pane preferredSize="20%" minSize={200}>
          <Timeline pins={filterPinsByAge(displayedPins)} newPinsCount={newPins.length} onShowNewPins={showNewPins}
            onLikeToggle={handleLikeToggle} />
        </Allotment.Pane>
        <MapView pins={filterPinsByAge(displayedPins)} onPinAdded={addPin} mapRefreshTrigger={mapRefreshTrigger} />
      </Allotment>
    </div>
  );
}

export default App;