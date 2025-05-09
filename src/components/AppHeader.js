import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../firebase/auth";

const HeaderContainer = styled.header`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid #8B0000;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  color: #FFD700;
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  font-family: 'Impact', 'Arial Black', sans-serif;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    fill: #FFD700;
  }
  
  &:hover {
    text-decoration: none;
    color: #FFD700;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #FFFFFF;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
  position: relative;
  padding: 5px 0;
  
  &:hover, &.active {
    color: #FFD700;
    
    &:after {
      width: 100%;
    }
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #FFD700;
    transition: width 0.3s;
  }
`;

const AccessibilityControls = styled.div`
  display: flex;
  gap: 10px;
`;

const AccessibilityButton = styled.button`
  background-color: #333;
  color: #FFD700;
  border: 1px solid #FFD700;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #FFD700;
    color: #000;
  }
`;

// ユーザーメニューのスタイル
const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 10px 0;
  min-width: 200px;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const UserMenuItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #333333;
  font-size: 16px;
  
  &:hover {
    background-color: #f5f5f5;
    color: var(--primary-color);
  }
`;

function AppHeader({ increaseFontSize, decreaseFontSize, toggleContrast }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">シニアフレンドリー映画館</Logo>
        
        <NavLinks>
          <NavLink to="/" $active={location.pathname === '/' ? 1 : 0}>
            ホーム
          </NavLink>
          <NavLink to="/schedule" $active={location.pathname === '/schedule' ? 1 : 0}>
            上映スケジュール
          </NavLink>
          <NavLink to="/my-reservations" $active={location.pathname === '/my-reservations' ? 1 : 0}>
            予約確認
          </NavLink>
          <NavLink to="/faq" $active={location.pathname === '/faq' ? 1 : 0}>
            よくある質問
          </NavLink>
        </NavLinks>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <AccessibilityControls>
            <AccessibilityButton onClick={decreaseFontSize} title="文字サイズを小さくする">
              A-
            </AccessibilityButton>
            <AccessibilityButton onClick={increaseFontSize} title="文字サイズを大きくする">
              A+
            </AccessibilityButton>
            <AccessibilityButton onClick={toggleContrast} title="コントラストを切り替える">
              <span role="img" aria-label="コントラスト切替">🎨</span>
            </AccessibilityButton>
          </AccessibilityControls>
          
          {isAuthenticated ? (
            <UserMenu>
              <UserButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                {currentUser.displayName || ''}
              </UserButton>
              
              <UserMenuDropdown isOpen={isMenuOpen}>
                <UserMenuItem onClick={() => {
                  navigate("/my-reservations");
                  setIsMenuOpen(false);
                }}>
                  予約確認
                </UserMenuItem>
                <UserMenuItem onClick={handleLogout}>
                  ログアウト
                </UserMenuItem>
              </UserMenuDropdown>
            </UserMenu>
          ) : (
            <NavLink to="/login">
              ログイン
            </NavLink>
          )}
        </div>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default AppHeader;
