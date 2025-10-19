import { useState, useEffect } from 'react';
import './App.css'
import MapView from './MapView';
import Timeline from './Timeline';
import { Allotment } from "allotment";
import "allotment/dist/style.css";

function App() {
  const [displayedPins, setDisplayedPins] = useState([]);
  const [newPins, setNewPins] = useState([]);
  const [mapRefreshTrigger, setMapRefreshTrigger] = useState(0);

  // 新しいピンがないか確認する関数
  const checkForNewPins = async () => {
    try {
      const response = await fetch('/api/pins');
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
    const initialFetch = async () => {
      try {
        const response = await fetch('/api/pins');
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

  return (
    <div className="app-container">
      <Allotment onChange={handleAllotmentChange}>
        <Allotment.Pane preferredSize="20%" minSize={200}>
          <Timeline pins={displayedPins} newPinsCount={newPins.length} onShowNewPins={showNewPins} />
        </Allotment.Pane>
        <MapView pins={displayedPins} onPinAdded={checkForNewPins} mapRefreshTrigger={mapRefreshTrigger} />
      </Allotment>
    </div>
  );
}

export default App;