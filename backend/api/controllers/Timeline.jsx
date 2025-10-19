import './Timeline.css';

function Timeline({ pins }) {
  return (
    <div className="timeline">
      <h2 className="timeline-header">Timeline</h2>
      <div className="timeline-body">
        {pins.map((pin) => (
          <div key={pin.id} className="timeline-item">
            <p className="timeline-comment">{pin.comment}</p>
            <span className="timeline-timestamp">
              {new Date(pin.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;