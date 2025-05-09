import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import PageHelp, { HelpSectionBlock } from "../components/PageHelp";
import HelpTip from "../components/HelpTip";
import { 
  CinemaPageContainer, 
  CinemaContentContainer, 
  CinemaTitle,
  CinemaSectionTitle,
  CinemaButton,
  CinemaCard,
  CinemaText
} from "../styles/CinemaTheme";

const PageContainer = styled(CinemaPageContainer)``;

const ContentWrapper = styled(CinemaContentContainer)`
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
`;

const PageTitle = styled(CinemaTitle)`
  margin-bottom: 30px;
`;

const ConfirmationCard = styled(CinemaCard)`
  background-color: rgba(20, 20, 20, 0.9);
  border: 2px solid #FFD700;
  position: relative;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
  
  &:before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    background: #FFD700;
    opacity: 0.1;
    transform: rotate(45deg);
  }
`;

const SuccessMessage = styled.p`
  font-size: var(--font-size-large);
  color: #FFD700;
  margin-bottom: var(--spacing-large);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const ReservationDetails = styled.div`
  margin-bottom: var(--spacing-large);
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px dotted rgba(255, 215, 0, 0.3);
  padding-bottom: 10px;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DetailLabel = styled.span`
  width: 150px;
  color: #FFD700;
  font-weight: bold;
`;

const DetailValue = styled.span`
  flex: 1;
  color: #FFFFFF;
`;

const QRSection = styled.div`
  background-color: rgba(20, 20, 20, 0.9);
  padding: 20px;
  border-radius: 10px;
  display: inline-block;
  margin: 20px auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid #FFD700;
  
  img {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  flex-direction: row;
  
  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
`;

const StyledButton = styled(CinemaButton)`
  width: 200px;
  margin: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HomeButton = styled(StyledButton)`
  /* ここでは追加のスタイルは必要なし */
`;

function ConfirmationPage() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  // 予約データを取得する
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        // Firestoreから予約データを取得
        const reservationRef = doc(db, "reservations", reservationId);
        const docSnap = await getDoc(reservationRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // 料金表示のフォーマット
          const formattedUnitPrice = data.unitPrice.toLocaleString() + '円';
          const formattedTotalPrice = data.totalPrice.toLocaleString() + '円';
          
          // チケットタイプの日本語表示
          const ticketTypeDisplay = {
            regular: "一般",
            senior: "シニア",
            child: "子供"
          };
          
          // 予約情報を設定
          setReservation({
            id: reservationId,
            movie: data.movieTitle,
            showtime: data.showtime,
            date: data.date,
            name: data.name,
            phone: data.phone,
            ticketType: ticketTypeDisplay[data.ticketType] || data.ticketType,
            numberOfTickets: data.numberOfTickets,
            unitPrice: formattedUnitPrice,
            totalPrice: formattedTotalPrice,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${reservationId}`,
            selectedSeats: data.selectedSeats
          });
          
          setLoading(false);
        } else {
          console.error("予約データが見つかりません");
          setLoading(false);
        }
      } catch (error) {
        console.error("予約データの取得に失敗しました", error);
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (!reservation) {
    return <p>予約情報が見つかりませんでした。</p>;
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>予約確認</PageTitle>
        
        <ConfirmationCard>
          <SuccessMessage>ご予約ありがとうございました！</SuccessMessage>
          
          <ReservationDetails>
            <DetailRow>
              <DetailLabel>予約番号:</DetailLabel>
              <DetailValue>{reservation.id}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>映画:</DetailLabel>
              <DetailValue>{reservation.movie}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>上映日:</DetailLabel>
              <DetailValue>{reservation.date}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>上映時間:</DetailLabel>
              <DetailValue>{reservation.showtime}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>チケット:</DetailLabel>
              <DetailValue>{reservation.ticketType} × {reservation.numberOfTickets}枚</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>座席:</DetailLabel>
              <DetailValue>{reservation.selectedSeats?.join(', ')}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>お名前:</DetailLabel>
              <DetailValue>{reservation.name}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>電話番号:</DetailLabel>
              <DetailValue>{reservation.phone}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>合計金額:</DetailLabel>
              <DetailValue>{reservation.totalPrice}</DetailValue>
            </DetailRow>
          </ReservationDetails>
          
          <div>
            <p>
              こちらのQRコードを映画館でご提示ください
              <HelpTip title="QRコードについて">
                <p>このQRコードは、映画館の窓口でチケットを受け取る際に必要です。</p>
                <p>スマートフォンで表示するか、印刷してお持ちください。</p>
              </HelpTip>
            </p>
            <QRSection>
              <img src={reservation.qrCodeUrl} alt="予約QRコード" />
            </QRSection>
          </div>
          
          <ActionButtons>
            <Link to="/">
              <StyledButton>
                トップページに戻る
              </StyledButton>
            </Link>
            <Link to="/my-reservations">
              <StyledButton>
                予約履歴を見る
              </StyledButton>
            </Link>
          </ActionButtons>
        </ConfirmationCard>
        
        <PageHelp title="予約確認について">
          <HelpSectionBlock title="予約完了後の流れ">
            <ol>
              <li>この画面に表示されているQRコードを保存するか、印刷してください</li>
              <li>映画館に到着したら、窓口でQRコードをご提示ください</li>
              <li>スタッフがチケットをお渡しします</li>
              <li>上映開始10分前までには映画館にお越しください</li>
            </ol>
          </HelpSectionBlock>
          
          <HelpSectionBlock title="予約の確認・変更">
            <p>予約内容の確認や変更、キャンセルは「予約の確認・変更」ページから行えます。</p>
            <p>予約時に入力したお名前と電話番号が必要です。</p>
          </HelpSectionBlock>
          
          <HelpSectionBlock title="お問い合わせ">
            <p>ご不明な点がございましたら、映画館までお電話でお問い合わせください。</p>
            <p>電話番号: 03-XXXX-XXXX（受付時間: 9:00～21:00）</p>
          </HelpSectionBlock>
        </PageHelp>
      </ContentWrapper>
    </PageContainer>
  );
}

export default ConfirmationPage;
