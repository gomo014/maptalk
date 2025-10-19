import './Timeline.css';

function Timeline({ pins }) {
  return (
    <div className="timeline-container">
      <div className="timeline-body">
        {pins.length > 0 ? pins.map((pin) => (
          <div key={pin.id} className="timeline-item">
            <p className="timeline-comment">{pin.comment}</p>
            <span className="timeline-timestamp">
              {new Date(pin.created_at).toLocaleString()}
            </span>
          </div>
        )) : <p>まだ投稿がありません。</p>}
      </div>
    </div>
  );
}

export default Timeline;