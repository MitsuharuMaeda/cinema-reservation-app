import styled from "styled-components";
import { Link } from "react-router-dom";

// 映画館風のページコンテナ
export const CinemaPageContainer = styled.div`
  text-align: center;
  padding: var(--spacing-xlarge) 0;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
                    url('/images/cinema-background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  color: #fff;
`;

// 映画館風のコンテンツコンテナ
export const CinemaContentContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.75);
  padding: 40px;
  border-radius: 15px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    background-image: url('/images/film-reel.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
  
  &:before {
    top: 20px;
    left: 20px;
  }
  
  &:after {
    bottom: 20px;
    right: 20px;
  }
`;

// 映画館風のタイトル
export const CinemaTitle = styled.h1`
  font-size: 42px;
  margin-bottom: var(--spacing-large);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
  color: #FFD700;
  letter-spacing: 2px;
  font-family: 'Impact', 'Arial Black', sans-serif;
  position: relative;
  display: inline-block;
  padding: 0 20px;
`;

// 映画館風のサブタイトル
export const CinemaSubtitle = styled.p`
  font-size: 24px;
  margin-bottom: var(--spacing-xlarge);
  color: #e0e0e0;
  font-weight: 300;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

// 映画館風のチケット型ボタン
export const CinemaButton = styled.button`
  background-color: #8B0000;
  color: #fff;
  border: 2px dashed #FFD700;
  border-radius: 8px;
  padding: 15px 25px;
  font-size: 18px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 180px;
  
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    z-index: -1;
    background: repeating-linear-gradient(
      45deg,
      #FFD700,
      #FFD700 10px,
      #8B0000 10px,
      #8B0000 20px
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    background-color: #a00000;
    
    &:before {
      opacity: 0.1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

// 映画館風のセクションタイトル
export const CinemaSectionTitle = styled.h2`
  color: #FFD700;
  margin-bottom: 30px;
  font-size: 28px;
  position: relative;
  display: inline-block;
  
  &:before, &:after {
    content: '•';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #FFD700;
    font-size: 24px;
  }
  
  &:before {
    left: -20px;
  }
  
  &:after {
    right: -20px;
  }
`;

// 映画館風のカード
export const CinemaCard = styled.div`
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.2);
  color: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
  }
`;

// 映画館風のテキスト
export const CinemaText = styled.p`
  color: #FFFFFF;
  font-size: 18px;
  line-height: 1.7;
  margin-bottom: 15px;
`;

// 映画館風のリンク
export const CinemaLink = styled(Link)`
  color: #ADD8E6;
  text-decoration: underline;
  transition: color 0.3s;
  
  &:hover {
    color: #FFD700;
  }
`;

// 映画館風のフォームコンテナ
export const CinemaForm = styled.form`
  background-color: #222222;
  padding: var(--spacing-large);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  color: #fff;
  border: 2px solid #FFD700;
  position: relative;
  margin: 0 auto;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
`;

export const CinemaFormGroup = styled.div`
  margin-bottom: var(--spacing-large);
`;

export const CinemaLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: var(--spacing-small);
  color: #FFD700;
  font-size: 18px;
`;

export const CinemaInput = styled.input`
  width: 100%;
  padding: var(--spacing-medium);
  background-color: #333333;
  border: 2px solid #FFD700;
  border-radius: 5px;
  font-size: var(--font-size-medium);
  color: #FFFFFF;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  
  &::placeholder {
    color: #999999;
  }
`;

export const CinemaSubmitButton = styled(CinemaButton)`
  width: 100%;
  margin-top: var(--spacing-large);
  background-color: #8B0000;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const CinemaLinkText = styled.p`
  text-align: center;
  margin-top: var(--spacing-large);
  color: #FFFFFF;
`;

export const CinemaErrorMessage = styled.p`
  color: #FF6B6B;
  background-color: rgba(255, 0, 0, 0.1);
  border-left: 3px solid #FF6B6B;
  padding: 10px;
  margin-bottom: var(--spacing-medium);
`;

export const CinemaSuccessMessage = styled.p`
  color: #6BFF6B;
  background-color: rgba(0, 255, 0, 0.1);
  border-left: 3px solid #6BFF6B;
  padding: 10px;
  margin-bottom: var(--spacing-medium);
`;
