import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

function UserMenu({ currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <div className="user-menu-wrapper">
      <div className="user-icon-button" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-user-circle"></i>
      </div>
      {isOpen && (
        <div className="user-menu-dropdown">
          {currentUser ? (
            <>
              <div className="menu-user-info">
                {currentUser.username}
              </div>
              <button onClick={() => alert('プロフィール機能は未実装です')}>プロフィール</button>
              <button onClick={() => alert('設定機能は未実装です')}>設定</button>
              <hr />
              <button onClick={handleLogout} className="logout-button">ログアウト</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>ログイン</button>
              <button onClick={() => navigate('/register')}>ユーザー登録</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default UserMenu;
