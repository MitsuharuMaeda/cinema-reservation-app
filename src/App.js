import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import AppHeader from "./components/AppHeader";
import Footer from "./components/Footer";
import VoiceGuide from "./components/VoiceGuide";
import { AuthProvider } from "./contexts/AuthContext";

// ページコンポーネントをインポート
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import ReservationPage from "./pages/ReservationPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import ModifyReservationPage from "./pages/ModifyReservationPage";
import FAQPage from "./pages/FAQPage";
import AdminMoviePage from "./pages/AdminMoviePage"; // 映画管理ページを復活
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";

// ハイコントラスト用のグローバルスタイル - コントラスト差を強化
const HighContrastStyles = createGlobalStyle`
  /* すべての背景を真っ黒に */
  body, #root, .app-container, main, section, div, article, aside, nav {
    background-color: #000000 !important;
    color: #ffffff !important;
  }
  
  /* すべてのテキストを明るく */
  h1, h2, h3, h4, h5, h6, p, span, label, li {
    color: #ffffff !important;
    text-shadow: none !important;
  }
  
  /* ヘッダーとフッターのスタイル強化 */
  header, footer, nav, .navbar {
    background-color: #000000 !important;
    border-color: #ffff00 !important;
    border-width: 2px !important;
  }
  
  /* 黄色の縁取りを追加 */
  .app-container {
    border: 3px solid #ffff00 !important;
  }
  
  /* リンクとボタンを黄色に */
  a, button, .btn, .nav-link {
    color: #ffff00 !important;
    border: 2px solid #ffff00 !important;
    background-color: #000000 !important;
    font-weight: bold !important;
    text-shadow: none !important;
  }
  
  a:hover, button:hover, .btn:hover, .nav-link:hover {
    background-color: #ffff00 !important;
    color: #000000 !important;
  }
  
  /* フォーム要素のコントラスト強化 */
  input, select, textarea {
    background-color: #000000 !important;
    color: #ffffff !important;
    border: 2px solid #ffff00 !important;
  }
  
  /* コンテナとカードの強調 */
  .white-container, .modal-content, .dialog, .card, .panel, .container, .form-control {
    background-color: #000000 !important;
    color: #ffffff !important;
    border: 3px solid #ffff00 !important;
    box-shadow: 0 0 10px rgba(255, 255, 0, 0.5) !important;
  }
  
  /* テーブルのコントラスト強化 */
  table, tr, td, th {
    color: #ffffff !important;
    border-color: #ffff00 !important;
    border-width: 2px !important;
  }
  
  tr:nth-child(even) {
    background-color: #222222 !important;
  }
  
  /* 映画館特有の要素 */
  .cinema-title, .theater-title {
    color: #ffff00 !important;
    text-shadow: 0 0 8px #ffff00 !important;
    font-weight: bold !important;
  }
  
  /* 上映スケジュールのボックス強調 */
  .schedule-item, .movie-card {
    background-color: #000000 !important;
    border: 3px solid #ffff00 !important;
    box-shadow: 0 0 10px rgba(255, 255, 0, 0.3) !important;
  }
  
  /* 座席選択のコントラスト強化 */
  .seat, .seat-available, .seat-selected, .seat-reserved {
    border: 2px solid #ffff00 !important;
  }
  
  .seat-available {
    background-color: #000000 !important;
    color: #ffff00 !important;
  }
  
  .seat-selected {
    background-color: #ffff00 !important;
    color: #000000 !important;
    font-weight: bold !important;
  }
  
  .seat-reserved {
    background-color: #333333 !important;
    color: #999999 !important;
  }
  
  /* ヘルプボタンとアクセシビリティボタンの強調 */
  .help-button, .accessibility-button {
    background-color: #ffff00 !important;
    color: #000000 !important;
    font-weight: bold !important;
    border: 3px solid #ffff00 !important;
  }
  
  /* 閉じるボタンのハイコントラスト調整 */
  button[aria-label="閉じる"] {
    background-color: #ff0000 !important;
    color: #ffffff !important;
    border: 2px solid #ffffff !important;
    z-index: 10000 !important;
  }
  
  /* モーダルコンテンツの余白調整 */
  .help-content {
    padding-top: 30px !important;
  }
  
  /* 映画ポスターの枠を追加 */
  img, .movie-poster {
    border: 2px solid #ffff00 !important;
  }
  
  /* フォーカス状態の強調 */
  *:focus {
    outline: 3px solid #ffff00 !important;
    outline-offset: 2px !important;
  }
`;

// 文字サイズ調整用のスタイル
const FontSizeStyles = createGlobalStyle`
  html, body {
    font-size: ${props => 16 * props.theme.fontSizeMultiplier}px !important;
  }
  
  button, input, select, textarea {
    font-size: ${props => 16 * props.theme.fontSizeMultiplier}px !important;
  }
  
  h1, .cinema-title {
    font-size: ${props => 32 * props.theme.fontSizeMultiplier}px !important;
  }
  
  h2 {
    font-size: ${props => 24 * props.theme.fontSizeMultiplier}px !important;
  }
  
  h3 {
    font-size: ${props => 20 * props.theme.fontSizeMultiplier}px !important;
  }
  
  p, li, a, span, div {
    font-size: ${props => 16 * props.theme.fontSizeMultiplier}px !important;
  }
`;

// メインのAppコンポーネント
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// AppContentコンポーネント - Router内でuseLocationを安全に使用
function AppContent() {
  const [theme, setTheme] = useState({
    fontSizeMultiplier: 1,
    highContrast: false
  });
  const routerLocation = useLocation();
  
  const increaseFontSize = () => {
    setTheme(prev => ({
      ...prev,
      fontSizeMultiplier: Math.min(prev.fontSizeMultiplier + 0.2, 1.6)
    }));
  };
  
  const decreaseFontSize = () => {
    setTheme(prev => ({
      ...prev,
      fontSizeMultiplier: Math.max(prev.fontSizeMultiplier - 0.2, 1)
    }));
  };
  
  const toggleContrast = () => {
    setTheme(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <GlobalStyles />
        <FontSizeStyles />
        {theme.highContrast && <HighContrastStyles />}
        <AppHeader 
          increaseFontSize={increaseFontSize}
          decreaseFontSize={decreaseFontSize}
          toggleContrast={toggleContrast}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/faq" element={<FAQPage />} />
          
          {/* 認証が必要なルート */}
          <Route path="/reservation/:movieId/:showtimeId" element={
            <PrivateRoute>
              <ReservationPage />
            </PrivateRoute>
          } />
          <Route path="/confirmation/:reservationId" element={
            <PrivateRoute>
              <ConfirmationPage />
            </PrivateRoute>
          } />
          <Route path="/my-reservations" element={
            <PrivateRoute>
              <MyReservationsPage />
            </PrivateRoute>
          } />
          <Route path="/modify-reservation/:reservationId" element={
            <PrivateRoute>
              <ModifyReservationPage />
            </PrivateRoute>
          } />
          
          {/* 管理者ページ */}
          <Route path="/admin/movies" element={<AdminMoviePage />} />
          
          {/* プロフィールページ（認証要） */}
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
        </Routes>
        <Footer />
        <VoiceGuide location={routerLocation} />
    </div>
    </ThemeProvider>
  );
}

export default App;
