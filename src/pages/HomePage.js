import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import InitDatabase from "../components/InitDatabase";
import PageHelp, { HelpSectionBlock } from "../components/PageHelp";
import { useAuth } from "../contexts/AuthContext";

// 映画館らしい背景のコンテナ
const HomePageContainer = styled.div`
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

// タイトル用の映画風スタイル
const Title = styled.h1`
  font-size: 48px;
  margin-bottom: var(--spacing-large);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
  color: #FFD700;
  letter-spacing: 2px;
  font-family: 'Impact', 'Arial Black', sans-serif;
  position: relative;
  display: inline-block;
  padding: 0 20px;
  
  &:before, &:after {
    content: '★';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #FFD700;
  }
  
  &:before {
    left: -30px;
  }
  
  &:after {
    right: -30px;
  }
`;

const Subtitle = styled.p`
  font-size: 24px;
  margin-bottom: var(--spacing-xlarge);
  color: #e0e0e0;
  font-weight: 300;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

// 映画リールの装飾を持つコンテナ
const ContentContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 40px;
  border-radius: 15px;
  max-width: 1000px;
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

// 映画チケットのようなデザインのボタンコンテナ
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

// チケットのようなボタン
const TicketButton = styled(Button)`
  background-color: #8B0000;
  color: #fff;
  border: 2px dashed #FFD700;
  border-radius: 8px;
  padding: 15px 25px;
  font-size: 18px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 220px;
  
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

const HelpWrapper = styled.div`
  margin-top: 50px;
  text-align: left;
  color: #FFFFFF;
  
  h3 {
    color: #FFD700;
    border-bottom: 1px solid #FFD700;
    padding-bottom: 8px;
    margin-bottom: 20px;
    font-size: 22px;
  }
  
  h4 {
    color: #FFD700;
    font-size: 20px;
    margin-top: 15px;
    margin-bottom: 10px;
  }
  
  a {
    color: #ADD8E6;
    text-decoration: underline;
    
    &:hover {
      color: #FFD700;
    }
  }
  
  p {
    margin-bottom: 15px;
    font-size: 18px;
    line-height: 1.7;
    color: #FFFFFF;
  }
  
  ol, ul {
    margin-left: 15px;
    margin-bottom: 15px;
  }
  
  li {
    margin-bottom: 10px;
    font-size: 18px;
    color: #FFFFFF;
  }
  
  strong {
    color: #FFD700;
    font-weight: bold;
  }
`;

const AdminLink = styled(Link)`
  display: inline-block;
  margin-top: 30px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.3s;
  
  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const NowShowingSection = styled.div`
  margin: 40px 0;
  
  h2 {
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
  }
`;

const MoviePosters = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  
  img {
    width: 120px;
    height: 180px;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    
    &:hover {
      transform: scale(1.05);
      border-color: #FFD700;
      box-shadow: 0 5px 15px rgba(255, 215, 0, 0.5);
    }
  }
`;

function HomePage() {
  const { isAuthenticated, currentUser } = useAuth();
  
  // 上映中の映画ポスター（公開ディレクトリの画像を使用）
  const moviePosters = [
    { title: "キングダム 大将軍の帰還", path: "/images/posters/kingdam.jpg" },
    { title: "君たちはどう生きるか", path: "/images/posters/kimitachi.jpg" },
    { title: "怪物", path: "/images/posters/kaibutsu.jpg" },
    { title: "ゴジラ-1.0", path: "/images/posters/godzilla.jpg" }
  ];

  return (
    <HomePageContainer>
      <Title>シニアフレンドリー映画館</Title>
      <Subtitle>
        {isAuthenticated
          ? `${currentUser.displayName || 'ユーザー'}様、ようこそ！映画の予約や確認が簡単に行えます。`
          : '大きな文字、シンプルな操作で、どなたでも簡単に映画の予約ができます。'}
      </Subtitle>
      
      <ContentContainer>
        <ButtonContainer>
          <TicketButton as={Link} to="/schedule">
            上映スケジュールを見る
          </TicketButton>
          
          {isAuthenticated ? (
            <TicketButton as={Link} to="/my-reservations">
              予約を確認する
            </TicketButton>
          ) : (
            <TicketButton as={Link} to="/login">
              ログイン / 新規登録
            </TicketButton>
          )}
          
          <TicketButton as={Link} to="/faq">
            よくある質問
          </TicketButton>
        </ButtonContainer>
        
        <NowShowingSection>
          <h2>上映中の作品</h2>
          <MoviePosters>
            {moviePosters.map((movie, index) => (
              <Link key={index} to="/schedule">
                <img 
                  src={movie.path} 
                  alt={movie.title} 
                  title={movie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/posters/default-poster.jpg";
                  }}
                />
              </Link>
            ))}
          </MoviePosters>
        </NowShowingSection>
        
        <HelpWrapper>
          <PageHelp title="このサイトの使い方">
            <HelpSectionBlock title="映画館予約サイトについて">
              <p>このサイトは、映画の上映スケジュールの閲覧や座席予約が簡単にできる映画予約サイトです。</p>
              <p>大きな文字、わかりやすい操作、充分な余白を設けており、どなたでも使いやすいよう設計されています。</p>
            </HelpSectionBlock>
            
            <HelpSectionBlock title="基本的な使い方">
              <ol>
                <li><strong>上映スケジュールを見る</strong> - 現在上映中の映画と時間を確認できます。</li>
                <li><strong>座席を予約する</strong> - 映画と時間を選んだ後、座席を選択して予約できます。</li>
                <li><strong>予約を確認・変更する</strong> - 過去の予約履歴の確認や変更、キャンセルができます。</li>
              </ol>
            </HelpSectionBlock>
            
            <HelpSectionBlock title="お困りの場合は">
              <p>操作方法がわからない場合は、各ページの「？」マークをクリックすると詳しい説明が表示されます。</p>
              <p>また、<Link to="/faq">よくある質問（FAQ）</Link>ページもご用意していますので、ぜひご利用ください。</p>
            </HelpSectionBlock>
          </PageHelp>
        </HelpWrapper>
        
        <div style={{ marginTop: 20 }}>
          <InitDatabase />
        </div>
      </ContentContainer>
    </HomePageContainer>
  );
}

export default HomePage;
