import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // 登録フォームと同じスタイルを流用

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ログインに失敗しました。');
      }

      // TODO: 本来はセッショントークンを保存する
      // 今回はlocalStorageにユーザー情報を保存してログイン状態を擬似的に再現
      localStorage.setItem('maptalk_user', JSON.stringify(data));

      // メインページにリダイレクト
      navigate('/');

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h3>ログイン</h3>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ユーザー名"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          required
        />
        <button type="submit">ログイン</button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <a href="/" className="back-link">マップに戻る</a>
    </div>
  );
}

export default Login;