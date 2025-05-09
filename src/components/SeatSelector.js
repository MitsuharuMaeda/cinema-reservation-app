import { useState, useEffect } from "react";
import styled from "styled-components";

const SeatSelectorContainer = styled.div`
  margin: var(--spacing-large) 0;
`;

const SeatSelectorTitle = styled.h3`
  margin-bottom: var(--spacing-medium);
  font-size: var(--font-size-medium);
  color: #FFD700;
  font-weight: bold;
`;

const ScreenArea = styled.div`
  background-color: #444444;
  padding: var(--spacing-small);
  text-align: center;
  margin-bottom: var(--spacing-large);
  border-radius: var(--border-radius);
  color: #FFD700;
  font-weight: bold;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const SeatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-medium);
  margin-bottom: var(--spacing-large);
`;

const SeatRow = styled.div`
  display: flex;
  gap: var(--spacing-small);
  align-items: center;
`;

const RowLabel = styled.div`
  width: 30px;
  text-align: center;
  font-weight: bold;
  font-size: var(--font-size-medium);
`;

const Seat = styled.button`
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 2px solid ${props => 
    props.selected ? '#cc0000' : 
    props.reserved ? '#999' : 
    'white'};
  background-color: ${props => 
    props.selected ? '#cc0000' : 
    props.reserved ? 'white' : '#333333'};
  color: ${props => 
    props.selected ? 'white' : 
    props.reserved ? '#777' : 'white'};
  cursor: ${props => props.reserved ? 'not-allowed' : 'pointer'};
  font-weight: bold;
  font-size: var(--font-size-medium);
  transition: all 0.2s;
  
  &:hover {
    transform: ${props => props.reserved ? 'none' : 'scale(1.05)'};
    box-shadow: ${props => props.reserved ? 'none' : '0 2px 5px rgba(0,0,0,0.3)'};
    border-color: ${props => props.reserved ? '#999' : props.selected ? '#cc0000' : '#FFD700'};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-large);
  margin-bottom: var(--spacing-medium);
  color: #f0f0f0;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
`;

const LegendSample = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${props => props.bgColor || props.color};
  border: 2px solid ${props => props.border ? 'white' : props.bgColor === '#cc0000' ? '#cc0000' : '#999'};
`;

const SeatInfo = styled.div`
  background-color: #333333;
  padding: var(--spacing-medium);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-medium);
  color: #f0f0f0;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const SeatSelectionSummary = styled.div`
  margin-top: var(--spacing-medium);
  padding: var(--spacing-medium);
  background-color: #333333;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
  color: #f0f0f0;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

// アルファベットの配列（行を表す）
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
// 列数
const COLS = 10;

const SeatSelector = ({ onSeatsSelected, numberOfTickets, initialSelectedSeats = [] }) => {
  // 初期選択座席を設定
  const [selectedSeats, setSelectedSeats] = useState(initialSelectedSeats);
  const [reservedSeats, setReservedSeats] = useState([]);

  // 初期選択座席が変更された場合に反映
  useEffect(() => {
    if (initialSelectedSeats.length > 0 && selectedSeats.length === 0) {
      setSelectedSeats(initialSelectedSeats);
    }
  }, [initialSelectedSeats]);

  // ダミーの予約済み座席（実際はFirebaseから取得する）
  useEffect(() => {
    // 約20%の座席をランダムに予約済みとしてマーク
    const dummyReserved = [];
    const totalSeats = ROWS.length * COLS;
    const reservedCount = Math.floor(totalSeats * 0.2);
    
    for (let i = 0; i < reservedCount; i++) {
      const row = ROWS[Math.floor(Math.random() * ROWS.length)];
      const col = Math.floor(Math.random() * COLS) + 1;
      const seatId = `${row}${col}`;
      
      if (!dummyReserved.includes(seatId)) {
        dummyReserved.push(seatId);
      }
    }
    
    setReservedSeats(dummyReserved);
  }, []);

  // 座席の選択/選択解除を処理
  const toggleSeat = (seatId) => {
    // 予約済みの座席は選択できない
    if (reservedSeats.includes(seatId)) {
      return;
    }
    
    // すでに選択されている場合は選択解除
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // チケット枚数を超える選択はできない
      if (selectedSeats.length < numberOfTickets) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        // チケット枚数に達している場合、最初に選択した座席を解除して新しい座席を追加
        const newSelected = [...selectedSeats.slice(1), seatId];
        setSelectedSeats(newSelected);
      }
    }
  };

  // 選択された座席が変更されたら親コンポーネントに通知
  useEffect(() => {
    onSeatsSelected(selectedSeats);
  }, [selectedSeats, onSeatsSelected]);

  return (
    <SeatSelectorContainer>
      <SeatSelectorTitle>座席を選択してください</SeatSelectorTitle>
      
      <SeatInfo>
        <p>• 選択可能な座席数: {numberOfTickets}席</p>
        <p>• 現在選択中: {selectedSeats.length}席</p>
        {selectedSeats.length > 0 && (
          <p>• 選択座席: {selectedSeats.join(', ')}</p>
        )}
      </SeatInfo>
      
      <Legend>
        <LegendItem>
          <LegendSample bgColor="#333333" border />
          <span>空席</span>
        </LegendItem>
        <LegendItem>
          <LegendSample bgColor="#cc0000" />
          <span>選択中</span>
        </LegendItem>
        <LegendItem>
          <LegendSample bgColor="white" />
          <span>予約済</span>
        </LegendItem>
      </Legend>
      
      <ScreenArea>スクリーン</ScreenArea>
      
      <SeatsContainer>
        {ROWS.map(row => (
          <SeatRow key={row}>
            <RowLabel>{row}</RowLabel>
            {Array.from({ length: COLS }, (_, i) => {
              const col = i + 1;
              const seatId = `${row}${col}`;
              const isReserved = reservedSeats.includes(seatId);
              const isSelected = selectedSeats.includes(seatId);
              
              return (
                <Seat
                  key={seatId}
                  onClick={() => toggleSeat(seatId)}
                  reserved={isReserved}
                  selected={isSelected}
                  disabled={isReserved}
                  aria-label={`座席 ${row}列${col}番`}
                >
                  {isReserved ? '' : col}
                </Seat>
              );
            })}
          </SeatRow>
        ))}
      </SeatsContainer>
      
      {selectedSeats.length > 0 && (
        <SeatSelectionSummary>
          <p>選択された座席: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{selectedSeats.join(', ')}</span></p>
          {selectedSeats.length < numberOfTickets && (
            <p>あと<span style={{ color: '#FFD700', fontWeight: 'bold' }}>{numberOfTickets - selectedSeats.length}</span>席選択できます</p>
          )}
        </SeatSelectionSummary>
      )}
    </SeatSelectorContainer>
  );
};

export default SeatSelector;
