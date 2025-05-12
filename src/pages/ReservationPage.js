import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import SeatSelector from "../components/SeatSelector";
import { db } from "../firebase/config";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import PageHelp, { HelpSectionBlock } from "../components/PageHelp";
import HelpTip from "../components/HelpTip";
import { 
  CinemaPageContainer, 
  CinemaContentContainer, 
  CinemaTitle,
  CinemaSectionTitle,
  CinemaButton,
  CinemaSubmitButton
} from "../styles/CinemaTheme";
import { useAuth } from "../contexts/AuthContext";

const PageContainer = styled(CinemaPageContainer)``;

const ContentWrapper = styled(CinemaContentContainer)`
  text-align: left;
`;

const PageTitle = styled(CinemaTitle)`
  margin-bottom: 30px;
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled(CinemaButton)`
  margin-bottom: var(--spacing-large);
`;

const ReservationForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background-color: #222222;
  padding: var(--spacing-large);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: #f0f0f0;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const MovieInfo = styled.div`
  margin-bottom: var(--spacing-large);
  padding-bottom: var(--spacing-large);
  border-bottom: 1px solid #444;
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-large);
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: var(--spacing-small);
  color: #FFD700;
`;

const SelectedSeatsBox = styled.div`
  width: 100%;
  padding: var(--spacing-medium);
  background-color: #333333;
  color: #f0f0f0;
  border-radius: var(--border-radius);
  border: 2px solid #FFD700;
  font-size: var(--font-size-medium);
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-medium);
  border: 2px solid #FFD700;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
  background-color: #333333;
  color: #f0f0f0;
  
  &:focus {
    border-color: #FFD700;
    outline: none;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-medium);
  border: 2px solid #FFD700;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
  background-color: #333333;
  color: #f0f0f0;
  
  &:focus {
    border-color: #FFD700;
    outline: none;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  
  &::-ms-expand {
    background-color: transparent;
    border: none;
    color: #f0f0f0;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error-color);
  margin-top: var(--spacing-small);
`;

const SubmitButton = styled(CinemaSubmitButton)`
  width: 100%;
  margin-top: var(--spacing-large);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  border: 2px dashed #FFD700;
  background-color: #8B0000;
  color: white;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  
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
  
  &.confirm {
    background-color: #8B0000;
    
    &:hover {
      background-color: #a00000;
    }
  }
  
  &.back {
    background-color: rgba(0, 0, 0, 0.6);
    
    &:hover {
      background-color: #8B0000;
    }
  }
`;

function ReservationPage() {
  const { movieId, showtimeId } = useParams();
  console.log("ReservationPage - URL params:", { movieId, showtimeId });
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || "",
    phone: "",
    ticketType: "regular",
    numberOfTickets: 1
  });
  const [errors, setErrors] = useState({});

  // 映画情報と上映時間情報の取得
  useEffect(() => {
    const fetchMovieAndShowtime = async () => {
      try {
        // 映画情報の取得
        const movieDoc = await getDoc(doc(db, "movies", movieId));
        
        // 上映時間情報の取得
        const showtimeDoc = await getDoc(doc(db, "showtimes", showtimeId));
        
        if (movieDoc.exists() && showtimeDoc.exists()) {
          const movieData = movieDoc.data();
          const showtimeData = showtimeDoc.data();
          
          setMovie({
            id: movieId,
            ...movieData,
            showtime: showtimeData.time,
            showtimeDate: showtimeData.date,
            theater: showtimeData.theater
          });
          
          setLoading(false);
        } else {
          console.error("映画または上映時間情報が見つかりません");
          setLoading(false);
        }
      } catch (error) {
        console.error("データの取得に失敗しました", error);
        setLoading(false);
      }
    };
    
    fetchMovieAndShowtime();
  }, [movieId, showtimeId]);

  // 座席選択の処理を追加
  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  // ステップを進める処理
  const goToNextStep = () => {
    if (currentStep === 1) {
      // 枚数に合わせた座席が選択されているか確認
      if (selectedSeats.length < formData.numberOfTickets) {
        alert(`チケット枚数(${formData.numberOfTickets}枚)分の座席を選択してください。`);
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  // 前のステップに戻る処理
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // チケット枚数が変更された場合、選択座席をリセット
    if (name === "numberOfTickets" && value !== formData.numberOfTickets) {
      setSelectedSeats([]);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "お名前を入力してください";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "電話番号を入力してください";
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = "有効な電話番号を入力してください";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // チケット料金の計算
        const prices = {
          regular: 1800,
          senior: 1100,
          child: 900
        };
        
        const unitPrice = prices[formData.ticketType];
        const totalPrice = unitPrice * formData.numberOfTickets;
        
        // 予約データをFirestoreに保存
        const reservationData = {
          movieId: movieId,
          movieTitle: movie.title,
          showtimeId: showtimeId,
          showtime: movie.showtime,
          date: movie.showtimeDate || new Date().toISOString().split('T')[0],
          name: formData.name,
          phone: formData.phone,
          ticketType: formData.ticketType,
          numberOfTickets: parseInt(formData.numberOfTickets),
          selectedSeats: selectedSeats,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          createdAt: new Date(),
          userId: currentUser.uid
        };
        
        const docRef = await addDoc(collection(db, "reservations"), reservationData);
        
        // 確認ページに遷移
        navigate(`/confirmation/${docRef.id}`);
      } catch (error) {
        console.error("予約の保存に失敗しました", error);
        alert("予約の処理中にエラーが発生しました。もう一度お試しください。");
      }
    }
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (!movie) {
    return <p>映画情報が見つかりませんでした。</p>;
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Link to="/schedule">
          <BackButton className="secondary">← スケジュールに戻る</BackButton>
        </Link>
        
        <PageTitle>映画予約</PageTitle>
        
        <ReservationForm onSubmit={handleSubmit}>
          <MovieInfo>
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p>上映時間: {movie.showtime}</p>
            <p>上映時間: {movie.duration}分</p>
          </MovieInfo>
          
          {currentStep === 1 && (
            <>
              <FormGroup>
                <Label htmlFor="ticketType">チケットタイプ:</Label>
                <Select 
                  id="ticketType" 
                  name="ticketType" 
                  value={formData.ticketType} 
                  onChange={handleChange}
                >
                  <option value="regular">一般（1,800円）</option>
                  <option value="senior">シニア（1,100円）</option>
                  <option value="child">子供（900円）</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="numberOfTickets">チケット枚数:</Label>
                <Select 
                  id="numberOfTickets" 
                  name="numberOfTickets" 
                  value={formData.numberOfTickets} 
                  onChange={handleChange}
                >
                  {[...Array(5)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </Select>
              </FormGroup>
              
              <SeatSelector
                onSeatsSelected={handleSeatsSelected}
                numberOfTickets={parseInt(formData.numberOfTickets)}
                showtimeId={showtimeId}
              />
              
              <ButtonContainer>
                <ActionButton 
                  type="button" 
                  className="back" 
                  onClick={() => navigate(-1)}
                >
                  戻る
                </ActionButton>
                <ActionButton 
                  type="button" 
                  className="confirm" 
                  onClick={goToNextStep}
                  disabled={selectedSeats.length < parseInt(formData.numberOfTickets)}
                >
                  次へ進む
                </ActionButton>
              </ButtonContainer>
            </>
          )}
          
          {currentStep === 2 && (
            <>
              <FormGroup>
                <Label htmlFor="name">お名前:</Label>
                <Input 
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="例: 山田 太郎"
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone">電話番号:</Label>
                <Input 
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="例: 090-1234-5678"
                />
                {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label>選択した座席:</Label>
                <SelectedSeatsBox>
                  {selectedSeats.length > 0 ? (
                    <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{selectedSeats.join(', ')}</span>
                  ) : (
                    'まだ座席が選択されていません'
                  )}
                </SelectedSeatsBox>
              </FormGroup>
              
              <ButtonContainer>
                <ActionButton 
                  type="button" 
                  className="back" 
                  onClick={goToPreviousStep}
                >
                  戻る
                </ActionButton>
                <ActionButton 
                  type="submit"
                  className="confirm"
                >
                  予約を確定する
                </ActionButton>
              </ButtonContainer>
            </>
          )}
        </ReservationForm>
        
        <PageHelp title="映画予約の方法">
          <HelpSectionBlock title="予約の手順">
            <ol>
              <li><strong>チケット情報の入力</strong> - チケットの種類と枚数を選びます</li>
              <li><strong>座席の選択</strong> - スクリーン図から希望の座席を選びます</li>
              <li><strong>お客様情報の入力</strong> - お名前と電話番号を入力します</li>
              <li><strong>予約の確定</strong> - 内容を確認して予約を確定します</li>
            </ol>
          </HelpSectionBlock>
          
          <HelpSectionBlock title="座席選択の方法">
            <p><strong>座席図の見方:</strong></p>
            <ul>
              <li><strong>白色の座席</strong> - 選択可能な空席</li>
              <li><strong>青色の座席</strong> - あなたが選択中の座席</li>
              <li><strong>灰色の座席</strong> - 既に予約済みの座席</li>
            </ul>
            <p>チケット枚数と同じ数の座席を選んでください。座席をクリックすると選択/選択解除できます。</p>
          </HelpSectionBlock>
          
          <HelpSectionBlock title="予約情報について">
            <p>入力したお名前と電話番号は、予約の確認や変更時に必要となります。</p>
            <p>予約完了後に表示されるQRコードを映画館窓口でご提示ください。</p>
          </HelpSectionBlock>
        </PageHelp>
      </ContentWrapper>
    </PageContainer>
  );
}

export default ReservationPage;
