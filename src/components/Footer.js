import { Link } from "react-router-dom";
import styled from "styled-components";

const FooterContainer = styled.footer`
  margin-top: var(--spacing-xlarge);
  padding: var(--spacing-large) 0;
  background-color: #1a1a1a;
  border-top: 1px solid #333;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-medium);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-large);
  margin-bottom: var(--spacing-large);
`;

const FooterLink = styled(Link)`
  color: #FFD700;
  text-decoration: none;
  font-size: var(--font-size-medium);
  font-weight: bold;
  padding: 8px 16px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #FFFFFF;
    text-decoration: none;
    background-color: rgba(255, 215, 0, 0.2);
    border-radius: 4px;
  }
`;

const FooterText = styled.p`
  text-align: center;
  color: #999;
  font-size: var(--font-size-small);
`;

const HelpBadge = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  
  &:hover {
    background-color: var(--secondary-color);
    transform: scale(1.05);
  }
`;

function Footer() {
  return (
    <>
      <FooterContainer>
        <FooterContent>
          <FooterLinks>
            <FooterLink to="/">ホーム</FooterLink>
            <FooterLink to="/schedule">上映スケジュール</FooterLink>
            <FooterLink to="/my-reservations">予約の確認・変更</FooterLink>
            <FooterLink to="/faq">よくある質問</FooterLink>
          </FooterLinks>
          <FooterText>© 2023 シニアフレンドリー映画館. All rights reserved.</FooterText>
        </FooterContent>
      </FooterContainer>
      
      <HelpBadge to="/faq" aria-label="ヘルプ">?</HelpBadge>
    </>
  );
}

export default Footer;
