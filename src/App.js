import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
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

// デフォルトのテーマ
const defaultTheme = {
  fontSizeMultiplier: 1,
  highContrast: false
};

const AppContainer = styled.div`
  font-size: ${props => 16 * props.theme.fontSizeMultiplier}px;
  background-color: ${props => props.theme.highContrast ? '#000' : 'var(--background-color)'};
  color: ${props => props.theme.highContrast ? '#fff' : 'var(--text-color)'};
  min-height: 100vh;
  
  button, input, select {
    font-size: ${props => 16 * props.theme.fontSizeMultiplier}px;
  }
  
  h1 {
    font-size: ${props => 32 * props.theme.fontSizeMultiplier}px;
  }
  
  h2 {
    font-size: ${props => 24 * props.theme.fontSizeMultiplier}px;
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
  const [fontSize, setFontSize] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const routerLocation = useLocation(); // 変数名を変更してESLintエラーを回避
  
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 1, 2));
  };
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 1, 0));
  };
  
  const toggleContrast = () => {
    setHighContrast(prev => !prev);
  };

  return (
    <div className={`app-container ${fontSize === 1 ? 'medium-font' : fontSize === 2 ? 'large-font' : ''} ${highContrast ? 'high-contrast' : ''}`}>
      <GlobalStyles />
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
        
        {/* 管理者ページ - 復元 */}
        <Route path="/admin/movies" element={<AdminMoviePage />} />
        
        {/* プロフィールページ（認証要） */}
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
      </Routes>
      <Footer />
      <VoiceGuide location={routerLocation} /> {/* 変数名を変更 */}
    </div>
  );
}

export default App;
