import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import PageHelp, { HelpSectionBlock } from "../components/PageHelp";
import HelpTip from "../components/HelpTip";
import { 
  CinemaPageContainer, 
  CinemaContentContainer, 
  CinemaTitle,
  CinemaSectionTitle,
  CinemaButton
} from "../styles/CinemaTheme";

const PageContainer = styled(CinemaPageContainer)``;

const ContentWrapper = styled(CinemaContentContainer)`
  text-align: left;
`;

const PageTitle = styled(CinemaTitle)`
  margin-bottom: 30px;
  text-align: center;
  width: 100%;
  color: #FFD700;
  
  &:before, &:after {
    content: none;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled(CinemaButton)`
  position: absolute;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
`;

const DateSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-medium);
  margin-bottom: var(--spacing-large);
  flex-wrap: wrap;
`;

const DateButton = styled.button`
  padding: var(--spacing-medium);
  min-width: 120px;
  border: 2px solid ${props => props.selected ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'};
  background-color: ${props => props.selected ? '#8B0000' : 'rgba(0, 0, 0, 0.6)'};
  color: ${props => props.selected ? '#FFD700' : '#fff'};
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    background-color: ${props => props.selected ? '#8B0000' : 'rgba(50, 50, 50, 0.8)'};
    transform: translateY(-3px);
  }
`;

const MovieList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-large);
`;

const MovieCard = styled.div`
  background-color: rgba(20, 20, 20, 0.8);
  border-radius: 12px;
  padding: var(--spacing-large);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(255, 215, 0, 0.2);
  }
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: var(--spacing-large);
  }
`;

const MoviePoster = styled.div`
  width: 100%;
  max-width: 180px;
  margin-bottom: var(--spacing-medium);
  align-self: center;
  
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);
    min-height: 270px;
  }
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    flex-shrink: 0;
  }
`;

const MovieDetails = styled.div`
  flex: 1;
  color: #fff;
`;

const MovieTitle = styled.h2`
  margin-bottom: var(--spacing-small);
  color: #FFD700;
  font-size: 28px;
`;

const MovieMeta = styled.div`
  display: flex;
  gap: var(--spacing-medium);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-small);
  font-size: 14px;
  color: #e0e0e0;
`;

const MovieMetaItem = styled.span`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    fill: #ADD8E6;
  }
`;

const MovieInfo = styled.div`
  margin-bottom: var(--spacing-medium);
  line-height: 1.6;
  color: #fff;
  font-size: 16px;
`;

const ShowtimeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-medium);
  margin-top: var(--spacing-medium);
`;

const ShowtimeButton = styled(Link)`
  display: inline-block;
  padding: var(--spacing-medium);
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid #FFD700;
  border-radius: var(--border-radius);
  text-decoration: none;
  color: #FFD700;
  font-weight: bold;
  text-align: center;
  min-width: 100px;
  transition: all 0.3s;
  
  &:hover {
    background-color: #8B0000;
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    text-decoration: none;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: var(--spacing-small);
  font-size: var(--font-size-medium);
  color: #fff;
`;

// シアターヘッダーのスタイル定義を追加
const TheaterHeader = styled.h4`
  margin: 0 0 12px;
  font-size: 18px; // フォントサイズを大きく
  font-weight: bold;
  padding: 8px 12px;
  background-color: #8B0000; // 濃い赤色（映画館のテーマカラー）
  color: #FFD700; // 金色のテキスト
  border-radius: 4px;
  text-align: center;
  letter-spacing: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  
  // キラキラ効果を追加（オプション）
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
  }
`;

// シアターコンテナーのスタイルを改善
const TheaterContainer = styled.div`
  margin-bottom: 15px;
  min-width: 150px;
`;

// 日付を生成する関数（今日から1週間分）
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

// 日付をフォーマットする関数
const formatDate = (date) => {
  const options = { month: 'long', day: 'numeric', weekday: 'long' };
  return date.toLocaleDateString('ja-JP', options);
};

// 日付フォーマットのヘルパー関数を追加
const formatDateForFirestore = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const dates = generateDates();

  // 映画タイトルとポスター画像のマッピング
  const posterMap = {
    "キングダム 大将軍の帰還": "kingdam.jpg",
    "君たちはどう生きるか": "kimitachi.jpg",
    "怪物": "kaibutsu.jpg",
    "ゴジラ-1.0": "godzilla.jpg",
    "名探偵コナン 100万ドルの五稜星": "conan.jpg",
    "名探偵コナン": "conan.jpg",
    "デッドプール": "deadpool.jpg",
    "ループ": "roogo.jpg",
    "4月の君、スピカ。": "april.jpg"
  };

  // 映画データをFirestoreから取得する
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Firestoreから映画データを取得
        const moviesSnapshot = await getDocs(collection(db, "movies"));
        const moviesData = moviesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log("取得した映画データ:", moviesData); // デバッグ用
        
        // 選択した日付の上映スケジュールを取得
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        const showtimesQuery = query(
          collection(db, "showtimes"),
          where("date", "==", selectedDateStr)
        );
        const showtimesSnapshot = await getDocs(showtimesQuery);
        
        console.log("日付でフィルタ:", selectedDateStr); // デバッグ用
        console.log("上映時間データ件数:", showtimesSnapshot.size); // デバッグ用
        
        // 上映時間を映画ごとにグループ化
        const showtimesByMovie = {};
        showtimesSnapshot.forEach(doc => {
          const showtime = { id: doc.id, ...doc.data() };
          if (!showtimesByMovie[showtime.movieTitle]) {
            showtimesByMovie[showtime.movieTitle] = [];
          }
          showtimesByMovie[showtime.movieTitle].push(showtime);
        });
        
        console.log("映画ごとの上映時間:", showtimesByMovie); // デバッグ用
        
        // 映画データに上映時間情報を追加
        const moviesWithShowtimes = moviesData.map(movie => {
          const movieShowtimes = showtimesByMovie[movie.title] || [];
          
          // ここでシアターごとにグループ化
          const showtimesByTheater = {};
          
          if (movieShowtimes.length > 0) {
            movieShowtimes.forEach(showtime => {
              if (!showtime.theater) {
                // theater プロパティがない場合はデフォルト値を設定
                showtime.theater = "メインシアター";
              }
              
              if (!showtimesByTheater[showtime.theater]) {
                showtimesByTheater[showtime.theater] = [];
              }
              showtimesByTheater[showtime.theater].push(showtime);
            });
            
            // 各シアターの上映時間を時間順にソート
            Object.keys(showtimesByTheater).forEach(theater => {
              showtimesByTheater[theater].sort((a, b) => a.time.localeCompare(b.time));
            });
          }
          
          return {
            ...movie,
            showtimes: movieShowtimes,
            showtimesByTheater: movieShowtimes.length > 0 ? showtimesByTheater : null
          };
        });
        
        // 上映時間がある映画のみをフィルタリング
        const filteredMovies = moviesWithShowtimes.filter(movie => movie.showtimes.length > 0);
        console.log("フィルタリング後の映画:", filteredMovies); // デバッグ用
        
        setMovies(filteredMovies);
        setLoading(false);
      } catch (error) {
        console.error("映画データの取得に失敗しました", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedDate]); // 選択日付が変わるたびに再取得

  // 画像ソースを取得する関数
  const getPosterSrc = (movie) => {
    // すでに存在していることがわかっている画像ファイルをデフォルトとして使用
    const defaultImage = "/images/posters/kingdam.jpg"; // 確実に存在する画像
    
    try {
      if (posterMap[movie.title]) {
        return `/images/posters/${posterMap[movie.title]}`;
      } else if (movie.imageUrl) {
        return movie.imageUrl;
      } else {
        console.log(`No poster mapping for: ${movie.title}, using default`);
        return defaultImage;
      }
    } catch (error) {
      console.error("Poster path error:", error);
      return defaultImage;
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderWrapper>
          <Link to="/">
            <BackButton className="secondary">← トップページに戻る</BackButton>
          </Link>
          <PageTitle>上映スケジュール</PageTitle>
        </HeaderWrapper>
        
        <div>
          <Label>日付を選択してください: <HelpTip title="日付の選択方法">
            <p>上映日を選択するには、表示されている日付ボタンをクリックしてください。</p>
            <p>選択された日付は青色で表示されます。</p>
          </HelpTip></Label>
          <DateSelector>
            {dates.map((date, index) => (
              <DateButton
                key={index}
                selected={date.toDateString() === selectedDate.toDateString()}
                onClick={() => setSelectedDate(date)}
                aria-label={`${formatDate(date)}を選択`}
              >
                {formatDate(date)}
              </DateButton>
            ))}
          </DateSelector>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>読み込み中...</p>
          </div>
        ) : movies.length > 0 ? (
          <MovieList>
            {movies.map(movie => (
              <MovieCard key={movie.id}>
                <MoviePoster>
                  <img 
                    src={getPosterSrc(movie)}
                    alt={`${movie.title}のポスター`}
                    onError={(e) => {
                      console.log(`Failed to load image for: ${movie.title}, trying fallback`);
                      e.target.onerror = null; 
                      e.target.src = "/images/posters/kingdam.jpg"; // 確実に存在する画像
                    }}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                </MoviePoster>
                
                <MovieDetails>
                  <MovieTitle>{movie.title}</MovieTitle>
                  
                  <MovieMeta>
                    <MovieMetaItem>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 14.9L16.2 16.2Z" fill="currentColor"/>
                      </svg>
                      {movie.duration}分
                    </MovieMetaItem>
                    
                    <MovieMetaItem>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 4L20 8H17L15 4H13L15 8H12L10 4H8L10 8H7L5 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V4H18Z" fill="currentColor"/>
                      </svg>
                      {movie.genre}
                    </MovieMetaItem>
                    
                    <MovieMetaItem>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                      </svg>
                      監督: {movie.director}
                    </MovieMetaItem>
                    
                    <MovieMetaItem>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 13H13V18H11V13H6V11H11V6H13V11H18V13Z" fill="currentColor"/>
                      </svg>
                      {movie.releaseYear}年
                    </MovieMetaItem>
                  </MovieMeta>
                  
                  <MovieInfo>{movie.description}</MovieInfo>
                  <MovieInfo>上映時間: {movie.duration}分</MovieInfo>
                  
                  <p>上映時間を選択してください:</p>
                  
                  {/* シアターをキーで昇順にソートし、横並びに表示 */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '20px',
                    marginTop: '15px'
                  }}>
                    {movie.showtimes && movie.showtimes.length > 0 && (
                      (() => {
                        // シアターごとにグループ化
                        const theaterGroups = {};
                        movie.showtimes.forEach(showtime => {
                          const theater = showtime.theater || 'その他';
                          if (!theaterGroups[theater]) {
                            theaterGroups[theater] = [];
                          }
                          theaterGroups[theater].push(showtime);
                        });
                        
                        // シアター名を昇順にソート
                        const sortedTheaters = Object.keys(theaterGroups).sort((a, b) => {
                          // シアターの数字部分を抽出して数値比較
                          const getTheaterNumber = (name) => {
                            const match = name.match(/(\d+)/);
                            return match ? parseInt(match[1], 10) : 0;
                          };
                          return getTheaterNumber(a) - getTheaterNumber(b);
                        });
                        
                        return sortedTheaters.map(theater => (
                          <TheaterContainer key={theater}>
                            <TheaterHeader>
                              {theater}
                            </TheaterHeader>
                            <ShowtimeList style={{ 
                              display: 'flex', 
                              flexWrap: 'wrap',
                              gap: '10px'
                            }}>
                              {theaterGroups[theater]
                                .sort((a, b) => a.time.localeCompare(b.time))
                                .map((showtime, index) => (
                                  <ShowtimeButton 
                                    key={index} 
                                    to={`/reservation/${movie.id}/${showtime.id}`}
                                    style={{ margin: '0' }}
                                  >
                                    {showtime.time}
                                  </ShowtimeButton>
                                ))
                              }
                            </ShowtimeList>
                          </TheaterContainer>
                        ));
                      })()
                    )}
                  </div>
                  
                  {(!movie.showtimes || movie.showtimes.length === 0) && (
                    <p>この日の上映予定はありません</p>
                  )}
                </MovieDetails>
              </MovieCard>
            ))}
          </MovieList>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px' }}>
            <h3>この日の上映スケジュールはありません</h3>
            <p>別の日を選択してください</p>
          </div>
        )}
        
        <PageHelp title="上映スケジュールの見方">
          <HelpSectionBlock title="日付の選択方法">
            <p>上部の日付ボタンをクリックすると、その日の上映スケジュールが表示されます。</p>
            <p>現在選択されている日付は青色で表示されます。</p>
          </HelpSectionBlock>
          
          <HelpSectionBlock title="映画の選び方">
            <p>各映画カードには以下の情報が表示されています：</p>
            <ul>
              <li><strong>映画タイトル</strong> - 映画の名前</li>
              <li><strong>あらすじ</strong> - 映画の簡単な説明</li>
              <li><strong>上映時間</strong> - 映画の長さ（分）</li>
              <li><strong>上映時間帯</strong> - その日のこの映画の上映開始時間</li>
            </ul>
            <p>見たい映画と時間を選び、時間ボタンをクリックすると予約画面に進みます。</p>
          </HelpSectionBlock>
          
          <HelpSectionBlock title="時間の表示について">
            <p>上映時間は左から早い順（午前から午後）に表示されています。</p>
            <p>灰色の時間帯は既に上映開始時間を過ぎているか、満席のため予約できません。</p>
          </HelpSectionBlock>
        </PageHelp>
      </ContentWrapper>
    </PageContainer>
  );
}

export default SchedulePage;
