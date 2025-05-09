import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #8B0000; /* 濃い赤 */
    --secondary-color: #FFD700; /* 金色 */
    --background-color: #121212; /* 非常に暗い背景 */
    --text-color: #FFFFFF; /* 白色テキスト */
    --error-color: #cc0000;
    --success-color: #00cc66;
    --font-size-small: 16px;
    --font-size-medium: 18px;
    --font-size-large: 24px;
    --font-size-xlarge: 32px;
    --spacing-small: 8px;
    --spacing-medium: 16px;
    --spacing-large: 24px;
    --spacing-xlarge: 32px;
    --border-radius: 8px;
    --list-number-color: #333333; /* リスト番号専用の色 */
    --cinema-primary: #8B0000;    /* 深い赤 */
    --cinema-gold: #FFD700;       /* ゴールド */
    --cinema-dark: #121212;       /* 非常に暗い背景 */
    --cinema-text: #e0e0e0;       /* 明るいテキスト */
    --cinema-accent: #DC143C;     /* アクセントの赤 */
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: 'Meiryo', 'Hiragino Kaku Gothic Pro', sans-serif;
    font-size: var(--font-size-medium);
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: var(--spacing-medium);
    font-weight: 700;
  }

  h1 {
    font-size: var(--font-size-xlarge);
  }

  h2 {
    font-size: var(--font-size-large);
  }

  button, input, select {
    font-size: var(--font-size-medium);
    padding: var(--spacing-medium);
    border-radius: var(--border-radius);
  }

  button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: var(--secondary-color);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-large);
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  /* リスト表示の修正 */
  ol, ul {
    padding-left: 2.5rem; /* リストの左パディングを増やす */
    list-style-position: outside; /* リスト番号を外側に配置 */
  }
  
  ol li, ul li {
    margin-bottom: 0.5rem; /* リスト項目間の余白 */
  }
  
  /* リスト番号をより見やすくするためのスタイル */
  ol {
    counter-reset: item;
    list-style-type: decimal;
  }
  
  ol > li {
    display: block;
    position: relative;
  }
  
  ol > li:before {
    content: counters(item, ".") ".";
    counter-increment: item;
    position: absolute;
    left: -2rem;
    color: var(--list-number-color);
    font-weight: bold;
  }

  ol li::marker {
    color: var(--text-color);
    font-weight: normal;
  }

  ul li::marker {
    color: var(--text-color);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* 白背景コンテナを映画館風のグレー背景に変更 */
  .white-container {
    background-color: #222222; /* グレー背景に変更 */
    color: #f0f0f0; /* テキスト色を明るく */
    padding: var(--spacing-medium);
    border-radius: var(--border-radius);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 215, 0, 0.3); /* 映画館テーマの金色枠を追加 */
  }
  
  /* 入力フォーム要素全般 */
  input, select, textarea {
    background-color: #333333; /* 背景色をダークグレーに */
    color: #f0f0f0; /* テキスト色を明るく */
    border: 2px solid #444; /* ボーダー色をダークグレーに */
    
    &:focus {
      border-color: #FFD700; /* フォーカス時の枠色を金色に */
    }
    
    &::placeholder {
      color: #999; /* プレースホルダーの色を調整 */
    }
  }
  
  /* モーダルや白背景ダイアログ */
  .modal-content, .dialog {
    background-color: #222222; /* グレー背景に変更 */
    color: #f0f0f0; /* テキスト色を明るく */
    border: 1px solid rgba(255, 215, 0, 0.3); /* 映画館テーマの金色枠を追加 */
  }
  
  /* 左側の赤いバーを調整するために追加 */
  [class*="ReservationCard"] {
    background-color: #222222 !important;
    color: #f0f0f0 !important;
  }
  
  [class*="SearchForm"] {
    background-color: #222222 !important;
    color: #f0f0f0 !important;
  }
  
  [class*="DetailLabel"] {
    color: #FFD700 !important;
    background-color: #383838 !important;
  }
  
  [class*="DetailValue"] {
    color: #f0f0f0 !important;
  }
  
  [class*="MovieTitle"] {
    color: #FFD700 !important;
  }
`;

export default GlobalStyles;
