import { useState, useEffect } from 'react';
import './App.css'
import MapView from './MapView';
import Timeline from './Timeline';
import { Allotment } from "allotment";
import "allotment/dist/style.css";

function App() {
  const [pins, setPins] = useState([]); // 初期値を空の配列に変更
  const [mapRefreshTrigger, setMapRefreshTrigger] = useState(0);

  // ピンのデータをAPIから取得する関数
  const fetchPins = async () => {
    try {
      const response = await fetch('/api/pins');
      if (!response.ok) {
        throw new Error('Failed to fetch pins');
      }
      const data = await response.json();
      setPins(data || []); // データがnullの場合も考慮
    } catch (error) {
      console.error("Error fetching pins:", error);
    }
  };

  // コンポーネントが最初に表示されたときにデータを取得
  useEffect(() => {
    fetchPins();
  }, []);

  const handleAllotmentChange = () => {
    setMapRefreshTrigger(c => c + 1);
  };

  return (
    <div className="app-container">
      <Allotment onChange={handleAllotmentChange}>
        <Allotment.Pane preferredSize="20%" minSize={200}>
          <Timeline pins={pins} />
        </Allotment.Pane>
        <MapView pins={pins} onPinAdded={fetchPins} mapRefreshTrigger={mapRefreshTrigger} />
      </Allotment>
    </div>
  );
}

export default App;