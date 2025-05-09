import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import PageHelp, { HelpSectionBlock } from "../components/PageHelp";
import HelpTip from "../components/HelpTip";
import { useAuth } from "../contexts/AuthContext";

const PageContainer = styled.div`
  padding: var(--spacing-large) 0;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: var(--spacing-xlarge);
`;

const SearchForm = styled.form`
  max-width: 600px;
  margin: 0 auto var(--spacing-xlarge);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
  background-color: white;
  padding: var(--spacing-large);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333333;
`;

const InstructionTitle = styled.h3`
  color: #8B0000;
  margin-bottom: 15px;
  font-size: 22px;
`;

const InstructionText = styled.p`
  color: #333333;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 20px;
  font-weight: 500;
  padding: 10px;
  background-color: #f8f8f8;
  border-left: 4px solid #8B0000;
  border-radius: 4px;
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-medium);
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: var(--spacing-small);
`;

const InputLabel = styled(Label)`
  font-size: 18px;
  color: #333333;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
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

const SearchButton = styled(Button)`
  margin-top: var(--spacing-small);
`;

const ReservationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-large);
  max-width: 800px;
  margin: 0 auto;
`;

const ReservationCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-large);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-left: 8px solid ${props => 
    props.status === "cancelled" ? "#999" : 
    new Date(props.date) < new Date() ? "#666" : "var(--primary-color)"};
  margin-bottom: 25px;
  color: #333333;
`;

const ReservationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-medium);
  flex-wrap: wrap;
  gap: var(--spacing-small);
`;

const MovieTitle = styled.h2`
  margin: 0;
  font-size: 26px;
  color: #8B0000;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 8px;
  margin-bottom: 10px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 8px;
  background-color: ${props => 
    props.status === "active" ? "#e6f7e6" : 
    props.status === "past" ? "#f0f0f0" : 
    props.status === "cancelled" ? "#ffe6e6" : "#f0f0f0"};
  color: ${props => 
    props.status === "active" ? "#006600" : 
    props.status === "past" ? "#666666" : 
    props.status === "cancelled" ? "#cc0000" : "#333333"};
  border: 2px solid ${props => 
    props.status === "active" ? "#006600" : 
    props.status === "past" ? "#666666" : 
    props.status === "cancelled" ? "#cc0000" : "#333333"};
`;

const ReservationDetails = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: var(--spacing-medium);
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DetailLabel = styled.div`
  font-weight: bold;
  flex: 0 0 150px;
  font-size: 18px;
  color: #555;
  background-color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 4px;
`;

const DetailValue = styled.div`
  flex: 1;
  font-size: 18px;
  color: #333;
  padding: 5px 10px;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-medium);
  margin-top: var(--spacing-medium);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(Button)`
  flex: 1;
  font-size: 16px;
  padding: 12px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }
`;

const CancelButton = styled(ActionButton)`
  background-color: #cc0000;
  
  &:hover {
    background-color: #aa0000;
  }
`;

const NoReservations = styled.div`
  text-align: center;
  padding: var(--spacing-xlarge);
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: var(--spacing-large);
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 90%;
`;

const ModalTitle = styled.h3`
  margin-bottom: var(--spacing-medium);
  color: #000000; /* 黒字に設定 */
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-medium);
  margin-top: var(--spacing-large);
`;

const ModalText = styled.p`
  color: #000000; /* 黒字 */
  font-size: 16px;
  margin-bottom: 10px;
`;

const ModalTextBold = styled.span`
  font-weight: bold;
`;

const ModalTextWarning = styled.p`
  color: #cc0000; /* 赤字 */
  font-size: 16px;
  margin-top: 15px;
  font-weight: bold;
`;

function MyReservationsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    name: "",
    phone: ""
  });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalAction, setModalAction] = useState(null); // "cancel" or "modify"
  const { currentUser } = useAuth();

  // 入力フォームの処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 予約検索
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchParams.name && !searchParams.phone) {
      alert("お名前または電話番号を入力してください");
      return;
    }
    
    setLoading(true);
    try {
      let q;
      
      // 名前と電話番号の両方が入力されている場合
      if (searchParams.name && searchParams.phone) {
        q = query(
          collection(db, "reservations"),
          where("name", "==", searchParams.name),
          where("phone", "==", searchParams.phone)
        );
      } 
      // 名前のみ入力されている場合
      else if (searchParams.name) {
        q = query(
          collection(db, "reservations"),
          where("name", "==", searchParams.name)
        );
      } 
      // 電話番号のみ入力されている場合
      else {
        q = query(
          collection(db, "reservations"),
          where("phone", "==", searchParams.phone)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const reservationsData = [];
      
      // 予約データの取得とステータス決定
      const now = new Date();
      
      for (const docSnapshot of querySnapshot.docs) {
        const reservation = {
          id: docSnapshot.id,
          ...docSnapshot.data()
        };
        
        // 予約に関連する映画の詳細情報を取得
        try {
          const movieDoc = await getDoc(doc(db, "movies", reservation.movieId));
          if (movieDoc.exists()) {
            reservation.movieDetails = movieDoc.data();
          }
        } catch (error) {
          console.error("映画情報の取得に失敗しました", error);
        }
        
        // 上映開始時間を日付オブジェクトに変換
        let showDateTime;
        try {
          const [hours, minutes] = reservation.showtime.split(':').map(Number);
          showDateTime = new Date(reservation.date);
          showDateTime.setHours(hours, minutes, 0, 0);
        } catch (error) {
          console.error("日付変換エラー", error);
          showDateTime = new Date(reservation.date);
        }
        
        // ステータスの決定
        if (reservation.status === "cancelled") {
          reservation.statusDisplay = "キャンセル済";
        } else if (showDateTime < now) {
          reservation.status = "past";
          reservation.statusDisplay = "上映終了";
        } else {
          reservation.status = "active";
          reservation.statusDisplay = "予約済";
        }
        
        reservationsData.push(reservation);
      }
      
      // 日付順にソート（新しい予約が上に来るように）
      reservationsData.sort((a, b) => {
        // まず予約ステータスでソート
        if (a.status === "active" && b.status !== "active") return -1;
        if (a.status !== "active" && b.status === "active") return 1;
        
        // 次に日付でソート
        const dateA = new Date(a.date + "T" + a.showtime);
        const dateB = new Date(b.date + "T" + b.showtime);
        return dateB - dateA;
      });
      
      setReservations(reservationsData);
      setSearched(true);
    } catch (error) {
      console.error("予約検索に失敗しました", error);
      alert("予約の検索中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  // 予約詳細ページへの遷移
  const viewReservationDetails = (reservationId) => {
    navigate(`/confirmation/${reservationId}`);
  };

  // 予約キャンセルのモーダル表示
  const showCancelModal = (reservation) => {
    setSelectedReservation(reservation);
    setModalAction("cancel");
    setModalOpen(true);
  };

  // 予約変更のモーダル表示
  const showModifyModal = (reservation) => {
    setSelectedReservation(reservation);
    setModalAction("modify");
    setModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setModalOpen(false);
    setSelectedReservation(null);
  };

  // 予約キャンセルの実行
  const cancelReservation = async () => {
    if (!selectedReservation) return;
    
    try {
      // 予約ステータスを「キャンセル済」に更新
      const reservationRef = doc(db, "reservations", selectedReservation.id);
      await updateDoc(reservationRef, {
        status: "cancelled",
        cancelledAt: new Date()
      });
      
      // 予約リストを更新
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === selectedReservation.id 
            ? { ...res, status: "cancelled", statusDisplay: "キャンセル済" } 
            : res
        )
      );
      
      alert("予約をキャンセルしました");
      closeModal();
    } catch (error) {
      console.error("予約キャンセルに失敗しました", error);
      alert("予約のキャンセル中にエラーが発生しました。もう一度お試しください。");
    }
  };

  // 予約変更画面への遷移
  const goToModifyReservation = () => {
    if (!selectedReservation) return;
    
    // 予約変更ページに遷移（後で実装）
    navigate(`/modify-reservation/${selectedReservation.id}`);
    closeModal();
  };

  // チケット種類の日本語表示
  const getTicketTypeDisplay = (type) => {
    const types = {
      regular: "一般",
      senior: "シニア",
      child: "子供"
    };
    return types[type] || type;
  };

  // 日付の表示形式を整える
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
      });
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchUserReservations = async () => {
      try {
        setLoading(true);
        
        if (!currentUser) {
          setReservations([]);
          setLoading(false);
          return;
        }
        
        // ユーザーIDで予約を検索
        const q = query(
          collection(db, "reservations"),
          where("userId", "==", currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const reservationsData = [];
        
        querySnapshot.forEach(doc => {
          reservationsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setReservations(reservationsData);
        setSearched(true);
        setLoading(false);
      } catch (error) {
        console.error("予約データの取得に失敗しました", error);
        setLoading(false);
      }
    };
    
    fetchUserReservations();
  }, [currentUser]);

  return (
    <PageContainer>
      <Link to="/">
        <Button className="secondary" style={{ marginBottom: 'var(--spacing-large)' }}>
          ← トップページに戻る
        </Button>
      </Link>
      
      <PageTitle>予約履歴・管理</PageTitle>
      
      <SearchForm onSubmit={handleSearch}>
        <InstructionTitle>予約情報を検索</InstructionTitle>
        <InstructionText>
          予約時に入力したお名前、または電話番号で予約を検索できます。
          どちらか一方の入力でも検索可能です。
        </InstructionText>
        
        <FormGroup>
          <InputLabel htmlFor="name">
            お名前:
            <HelpTip title="お名前の入力">
              <p>予約時に入力したお名前を入力してください。</p>
              <p>お名前か電話番号、どちらか一方だけでも検索できます。</p>
            </HelpTip>
          </InputLabel>
          <Input 
            type="text"
            id="name"
            name="name"
            value={searchParams.name}
            onChange={handleChange}
            placeholder="例: 山田 太郎"
          />
        </FormGroup>
        
        <FormGroup>
          <InputLabel htmlFor="phone">
            電話番号:
            <HelpTip title="電話番号の入力">
              <p>予約時に入力した電話番号を入力してください。</p>
              <p>ハイフン（-）ありでもなしでも検索できます。</p>
            </HelpTip>
          </InputLabel>
          <Input 
            type="tel"
            id="phone"
            name="phone"
            value={searchParams.phone}
            onChange={handleChange}
            placeholder="例: 090-1234-5678"
          />
        </FormGroup>
        
        <SearchButton type="submit" disabled={loading}>
          {loading ? "検索中..." : "予約を検索"}
        </SearchButton>
      </SearchForm>
      
      {searched && (
        <ReservationsList>
          {reservations.length > 0 ? (
            reservations.map(reservation => (
              <ReservationCard 
                key={reservation.id}
                status={reservation.status}
                date={reservation.date}
              >
                <ReservationHeader>
                  <MovieTitle>{reservation.movieTitle}</MovieTitle>
                  <StatusBadge status={reservation.status}>
                    {reservation.statusDisplay}
                    <HelpTip title="予約の状態">
                      <p><strong>予約済</strong>: 有効な予約です。映画館で上映されるのをお待ちください。</p>
                      <p><strong>上映終了</strong>: すでに上映が終了した予約です。</p>
                      <p><strong>キャンセル済</strong>: キャンセルされた予約です。</p>
                    </HelpTip>
                  </StatusBadge>
                </ReservationHeader>
                
                <ReservationDetails>
                  <DetailRow>
                    <DetailLabel>予約番号:</DetailLabel>
                    <DetailValue>{reservation.id}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>上映日:</DetailLabel>
                    <DetailValue>{formatDate(reservation.date)}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>上映時間:</DetailLabel>
                    <DetailValue>{reservation.showtime}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>チケット:</DetailLabel>
                    <DetailValue>
                      {getTicketTypeDisplay(reservation.ticketType)} × {reservation.numberOfTickets}枚
                    </DetailValue>
                  </DetailRow>
                  {reservation.selectedSeats && (
                    <DetailRow>
                      <DetailLabel>座席:</DetailLabel>
                      <DetailValue>
                        {reservation.selectedSeats.join(', ')}
                      </DetailValue>
                    </DetailRow>
                  )}
                  <DetailRow>
                    <DetailLabel>合計金額:</DetailLabel>
                    <DetailValue>
                      {reservation.totalPrice?.toLocaleString() || '---'}円
                    </DetailValue>
                  </DetailRow>
                </ReservationDetails>
                
                <ActionButtons>
                  <ActionButton 
                    onClick={() => viewReservationDetails(reservation.id)}
                  >
                    詳細を見る
                  </ActionButton>
                  
                  {reservation.status === "active" && (
                    <>
                      <ActionButton 
                        onClick={() => showModifyModal(reservation)}
                      >
                        予約を変更
                      </ActionButton>
                      <CancelButton 
                        onClick={() => showCancelModal(reservation)}
                      >
                        予約をキャンセル
                      </CancelButton>
                    </>
                  )}
                </ActionButtons>
              </ReservationCard>
            ))
          ) : (
            <NoReservations>
              <h3>予約が見つかりませんでした</h3>
              <p>入力情報をご確認の上、もう一度検索してください。</p>
            </NoReservations>
          )}
        </ReservationsList>
      )}
      
      {modalOpen && selectedReservation && (
        <Modal>
          <ModalContent>
            {modalAction === "cancel" ? (
              <>
                <ModalTitle>予約キャンセルの確認</ModalTitle>
                <ModalText>以下の予約をキャンセルしますか？</ModalText>
                <ModalText><ModalTextBold>映画:</ModalTextBold> {selectedReservation.movieTitle}</ModalText>
                <ModalText><ModalTextBold>日時:</ModalTextBold> {formatDate(selectedReservation.date)} {selectedReservation.showtime}</ModalText>
                <ModalText><ModalTextBold>枚数:</ModalTextBold> {selectedReservation.numberOfTickets}枚</ModalText>
                <ModalTextWarning>※キャンセル後の復元はできません。</ModalTextWarning>
                <ModalButtons>
                  <Button 
                    className="secondary"
                    onClick={closeModal}
                  >
                    戻る
                  </Button>
                  <CancelButton onClick={cancelReservation}>
                    キャンセルする
                  </CancelButton>
                </ModalButtons>
              </>
            ) : (
              <>
                <ModalTitle>予約変更の確認</ModalTitle>
                <ModalText>以下の予約を変更しますか？</ModalText>
                <ModalText><ModalTextBold>映画:</ModalTextBold> {selectedReservation.movieTitle}</ModalText>
                <ModalText><ModalTextBold>日時:</ModalTextBold> {formatDate(selectedReservation.date)} {selectedReservation.showtime}</ModalText>
                <ModalText><ModalTextBold>枚数:</ModalTextBold> {selectedReservation.numberOfTickets}枚</ModalText>
                <ModalButtons>
                  <Button 
                    className="secondary"
                    onClick={closeModal}
                  >
                    戻る
                  </Button>
                  <ActionButton onClick={goToModifyReservation}>
                    変更する
                  </ActionButton>
                </ModalButtons>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      
      <PageHelp title="予約の確認と管理方法">
        <HelpSectionBlock title="予約の検索方法">
          <p>予約を検索するには、予約時に入力した<strong>お名前</strong>または<strong>電話番号</strong>を入力してください。</p>
          <p>両方入力すると、より正確に検索できます。</p>
        </HelpSectionBlock>
        
        <HelpSectionBlock title="予約状態について">
          <ul>
            <li><strong>予約済</strong> - 有効な予約です。変更やキャンセルが可能です。</li>
            <li><strong>上映終了</strong> - すでに上映時間が過ぎた予約です。変更やキャンセルはできません。</li>
            <li><strong>キャンセル済</strong> - キャンセルされた予約です。復元はできません。</li>
          </ul>
        </HelpSectionBlock>
        
        <HelpSectionBlock title="予約の変更・キャンセル">
          <p><strong>予約変更</strong>: 「予約を変更」ボタンをクリックすると、チケットの種類や座席などを変更できます。</p>
          <p><strong>予約キャンセル</strong>: 「予約をキャンセル」ボタンをクリックすると、予約をキャンセルできます。</p>
          <p>※上映時間を過ぎた予約は変更・キャンセルできません。</p>
        </HelpSectionBlock>
      </PageHelp>
    </PageContainer>
  );
}

export default MyReservationsPage;
