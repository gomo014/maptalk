import './Timeline.css';

function Timeline({ pins, newPinsCount, onShowNewPins, currentUser, onLogout }) {
  return (
    <div className="timeline-container">
      <div className="timeline-body">
        {currentUser ? (
          <div className="auth-link-container">
            <p>ようこそ、<strong>{currentUser.username}</strong>さん</p>
            <button onClick={onLogout} className="auth-link-button">ログアウト</button>
          </div>
        ) : (
          <div className="auth-link-container">
            <p>アカウントをお持ちですか？</p>
            <a href="/register" className="auth-link-button">ユーザー登録</a>
            <a href="/login" className="auth-link-button">ログイン</a>
          </div>
        )}
        {newPinsCount > 0 && (
          <div className="new-pins-notifier" onClick={onShowNewPins}>{newPinsCount}件の新しいコメント</div>
        )}
        {pins.length > 0 ? (
          pins.map((pin) => (
          <div key={pin.id} className="timeline-item">
            <p className="timeline-comment">{pin.comment}</p>
            <span className="timeline-timestamp">
              {new Date(pin.created_at).toLocaleString()}
            </span>
          </div>
        ))
        ) : (
          <p className="no-pins-message">まだ投稿がありません。</p>
        )}
      </div>
    </div>
  );
}

export default Timeline;
