import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import SeatSelector from "../components/SeatSelector";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

const PageContainer = styled.div`
  padding: var(--spacing-large) 0;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: var(--spacing-xlarge);
`;

const BackButton = styled(Button)`
  margin-bottom: var(--spacing-large);
`;

const ReservationForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  padding: var(--spacing-large);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MovieInfo = styled.div`
  margin-bottom: var(--spacing-large);
  padding-bottom: var(--spacing-large);
  border-bottom: 1px solid #eee;
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-large);
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: var(--spacing-small);
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-medium);
  border: 2px solid #ccc;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error-color);
  margin-top: var(--spacing-small);
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: var(--spacing-large);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xlarge);
`;

function ModifyReservationPage() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [originalReservation, setOriginalReservation] = useState(null);
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [formData, setFormData] = useState({
    ticketType: "",
    numberOfTickets: 1
  });
  const [errors, setErrors] = useState({});

  // 予約データとそれに関連する映画・上映時間情報を取得
  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        // 予約データを取得
        const reservationDoc = await getDoc(doc(db, "reservations", reservationId));
        
        if (!reservationDoc.exists()) {
          alert("予約情報が見つかりませんでした");
          navigate('/my-reservations');
          return;
        }
        
        const reservationData = {
          id: reservationId,
          ...reservationDoc.data()
        };
        
        // 既にキャンセル済みの予約は変更できない
        if (reservationData.status === "cancelled") {
          alert("キャンセル済みの予約は変更できません");
          navigate('/my-reservations');
          return;
        }
        
        // 上映日時が過ぎている予約は変更できない
        const showDateTime = new Date(reservationData.date + "T" + reservationData.showtime);
        if (showDateTime < new Date()) {
          alert("上映時間が過ぎた予約は変更できません");
          navigate('/my-reservations');
          return;
        }
        
        setOriginalReservation(reservationData);
        
        // 映画情報を取得
        const movieDoc = await getDoc(doc(db, "movies", reservationData.movieId));
        if (movieDoc.exists()) {
          setMovie({
            id: reservationData.movieId,
            ...movieDoc.data()
          });
        }
        
        // 上映時間情報を取得
        const showtimeDoc = await getDoc(doc(db, "showtimes", reservationData.showtimeId));
        if (showtimeDoc.exists()) {
          setShowtime({
            id: reservationData.showtimeId,
            ...showtimeDoc.data()
          });
        }
        
        // フォームデータを初期化
        setFormData({
          ticketType: reservationData.ticketType || "regular",
          numberOfTickets: reservationData.numberOfTickets || 1
        });
        
        // 選択済み座席を設定
        if (reservationData.selectedSeats && reservationData.selectedSeats.length > 0) {
          setSelectedSeats(reservationData.selectedSeats);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("予約データの取得に失敗しました", error);
        alert("予約情報の読み込み中にエラーが発生しました");
        navigate('/my-reservations');
      }
    };
    
    fetchReservationData();
  }, [reservationId, navigate]);

  // 座席選択の処理
  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  // フォーム入力の変更処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // チケット枚数が変更された場合、選択座席をリセット
    if (name === "numberOfTickets" && parseInt(value) !== formData.numberOfTickets) {
      setSelectedSeats([]);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // フォームのバリデーション
  const validateForm = () => {
    const newErrors = {};
    
    if (selectedSeats.length < parseInt(formData.numberOfTickets)) {
      newErrors.seats = `チケット枚数(${formData.numberOfTickets}枚)分の座席を選択してください`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 予約変更の処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // 料金計算
        const prices = {
          regular: 1800,
          senior: 1100,
          child: 900
        };
        
        const unitPrice = prices[formData.ticketType];
        const totalPrice = unitPrice * formData.numberOfTickets;
        
        // 予約データを更新
        const reservationRef = doc(db, "reservations", reservationId);
        await updateDoc(reservationRef, {
          ticketType: formData.ticketType,
          numberOfTickets: parseInt(formData.numberOfTickets),
          selectedSeats: selectedSeats,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          updatedAt: new Date()
        });
        
        alert("予約を変更しました");
        navigate(`/confirmation/${reservationId}`);
      } catch (error) {
        console.error("予約の変更に失敗しました", error);
        alert("予約の変更中にエラーが発生しました。もう一度お試しください。");
      }
    }
  };

  // チケット種類の日本語表示
  const getTicketTypeDisplay = (type) => {
    const types = {
      regular: "一般 (1,800円)",
      senior: "シニア (1,100円)",
      child: "子供 (900円)"
    };
    return types[type] || type;
  };

  if (loading) {
    return <LoadingMessage>予約情報を読み込み中...</LoadingMessage>;
  }

  if (!originalReservation || !movie) {
    return <LoadingMessage>予約情報が見つかりませんでした</LoadingMessage>;
  }

  return (
    <PageContainer>
      <Link to="/my-reservations">
        <BackButton className="secondary">← 予約一覧に戻る</BackButton>
      </Link>
      
      <PageTitle>予約変更</PageTitle>
      
      <ReservationForm onSubmit={handleSubmit}>
        <MovieInfo>
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          <p>上映日: {new Date(originalReservation.date).toLocaleDateString('ja-JP', { 
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
          })}</p>
          <p>上映時間: {originalReservation.showtime}</p>
          <p>上映時間: {movie.duration}分</p>
        </MovieInfo>
        
        <FormGroup>
          <Label htmlFor="ticketType">チケットの種類:</Label>
          <Select 
            id="ticketType"
            name="ticketType"
            value={formData.ticketType}
            onChange={handleChange}
          >
            <option value="regular">一般 (1,800円)</option>
            <option value="senior">シニア (1,100円)</option>
            <option value="child">子供 (900円)</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="numberOfTickets">枚数:</Label>
          <Select 
            id="numberOfTickets"
            name="numberOfTickets"
            value={formData.numberOfTickets}
            onChange={handleChange}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>座席選択:</Label>
          <SeatSelector 
            onSeatsSelected={handleSeatsSelected} 
            numberOfTickets={parseInt(formData.numberOfTickets)}
            initialSelectedSeats={originalReservation.selectedSeats || []}
          />
          {errors.seats && <ErrorMessage>{errors.seats}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label>変更後の合計金額:</Label>
          <div style={{ 
            padding: 'var(--spacing-medium)', 
            backgroundColor: '#f0f7ff', 
            borderRadius: 'var(--border-radius)',
            fontWeight: 'bold',
            fontSize: 'var(--font-size-medium)'
          }}>
            {(() => {
              const prices = {
                regular: 1800,
                senior: 1100,
                child: 900
              };
              const unitPrice = prices[formData.ticketType];
              const totalPrice = unitPrice * formData.numberOfTickets;
              return `${totalPrice.toLocaleString()}円`;
            })()}
          </div>
        </FormGroup>
        
        <SubmitButton type="submit">
          予約を変更する
        </SubmitButton>
      </ReservationForm>
    </PageContainer>
  );
}

export default ModifyReservationPage;
