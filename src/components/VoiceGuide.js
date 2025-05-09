import { useState, useEffect } from "react";
import styled from "styled-components";
import speechUtils from "../utils/speechUtils";

const VoiceGuideContainer = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  z-index: 1000;
`;

const VoiceButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #8B0000;
  color: white;
  border: 2px solid #FFD700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: #a00000;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:focus {
    outline: 3px solid #FFD700;
    outline-offset: 2px;
  }
  
  svg {
    width: 30px;
    height: 30px;
  }
`;

const VoiceControlPanel = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  padding: 20px;
  width: 320px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  border: 2px solid #0066cc;
`;

const VoiceControlTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 22px;
  color: #0066cc;
  font-weight: bold;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const VoiceControlButton = styled.button`
  display: block;
  width: 100%;
  padding: 15px;
  margin-bottom: 12px;
  background-color: #8B0000;
  border: 2px dashed #FFD700;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  color: #FFD700;
  
  &:hover {
    background-color: #a00000;
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:focus {
    outline: 3px solid #FFD700;
    outline-offset: 2px;
  }
`;

const VoiceSettingsGroup = styled.div`
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const VoiceSettingsLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
`;

const VoiceSettingsRange = styled.input`
  width: 100%;
  margin-bottom: 20px;
  height: 8px;
  
  &::-webkit-slider-thumb {
    width: 24px;
    height: 24px;
    background: #0066cc;
  }
  
  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: #0066cc;
  }
`;

const ReadingProgress = styled.div`
  margin-top: 12px;
  padding: 12px;
  background-color: #fffde7;
  border: 2px solid #ffecb3;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  color: #795548;
`;

const AutoReadLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  
  input {
    margin-right: 10px;
    transform: scale(1.5);
  }
`;

// 各ページの主要な内容を読み上げるためのテキスト
const getPageDescriptionText = (pathname) => {
  if (pathname === "/") {
    return "シニアフレンドリー映画館のトップページです。上映スケジュールの確認、予約の確認・変更、よくある質問などの機能があります。画面中央の大きなボタンから各機能にアクセスできます。";
  } else if (pathname === "/schedule") {
    return "上映スケジュールページです。画面上部で日付を選択すると、その日に上映される映画が表示されます。映画を選んで時間をクリックすると、予約ページに進むことができます。";
  } else if (pathname.includes("/reservation")) {
    return "映画予約ページです。チケットの種類と枚数を選び、座席を選択してください。座席選択後、お名前と電話番号を入力して予約を確定します。";
  } else if (pathname.includes("/confirmation")) {
    return "予約確認ページです。予約が完了しました。表示されているQRコードを映画館でご提示ください。ページ下部のボタンからトップページに戻ることができます。";
  } else if (pathname === "/my-reservations") {
    return "予約確認・変更ページです。予約時に入力したお名前か電話番号で予約を検索できます。予約の詳細確認、変更、キャンセルができます。";
  } else if (pathname === "/faq") {
    return "よくある質問ページです。予約方法や変更・キャンセル方法、チケット情報などカテゴリごとに質問と回答が掲載されています。上部の検索ボックスで質問を検索することもできます。";
  } else if (pathname.includes("/modify-reservation")) {
    return "予約変更ページです。チケットの種類、枚数、座席を変更できます。変更内容を確認して予約を更新してください。";
  }
  
  return "シニアフレンドリー映画館のページです。このサイトでは映画の予約、確認、変更が簡単にできます。";
};

// 音声ガイドコンポーネント
function VoiceGuide({ location }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1);
  const [isReading, setIsReading] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  
  // コンポーネントがマウントされたときに音声合成を初期化
  useEffect(() => {
    speechUtils.init();
    
    // コンポーネントがアンマウントされたときに読み上げを停止
    return () => {
      speechUtils.stop();
    };
  }, []);
  
  useEffect(() => {
    if (autoReadEnabled) {
      const pageTitle = getPageTitle(location.pathname);
      speechUtils.speak(pageTitle, { rate, pitch });
    }
  }, [location.pathname, autoReadEnabled]);
  
  // パネルの表示/非表示を切り替える
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  
  // ページの説明を読み上げる
  const readPageDescription = () => {
    const text = getPageDescriptionText(location.pathname);
    setIsReading(true);
    
    const utterance = speechUtils.speak(text, { rate, pitch });
    
    utterance.onend = () => {
      setIsReading(false);
    };
  };
  
  // 現在のページの操作方法を読み上げる
  const readOperationGuide = () => {
    let text = "";
    
    if (location.pathname === "/") {
      text = "トップページの操作方法です。上映スケジュールを見るには、「上映スケジュールを見る」ボタンをクリックします。予約の確認や変更をするには、「予約の確認・変更」ボタンをクリックします。よくある質問を見るには、「よくある質問」ボタンをクリックします。";
    } else if (location.pathname === "/schedule") {
      text = "上映スケジュールページの操作方法です。上部の日付ボタンをクリックすると、その日の上映スケジュールが表示されます。映画と時間を選んで予約するには、時間ボタンをクリックします。トップページに戻るには、「トップページに戻る」ボタンをクリックします。";
    } else if (location.pathname.includes("/reservation")) {
      text = "予約ページの操作方法です。チケットの種類と枚数を選び、座席図から座席を選択します。座席は白色が選択可能な席、グレーが予約済みの席です。選択した座席は青色で表示されます。次に進むには「次へ進む」ボタンをクリックします。お客様情報を入力し、「予約を確定する」ボタンをクリックすると予約が完了します。";
    } else if (location.pathname.includes("/confirmation")) {
      text = "予約確認ページの操作方法です。予約内容とQRコードが表示されています。このQRコードを映画館でご提示ください。トップページに戻るには「トップページに戻る」ボタンをクリックします。予約履歴を見るには「予約履歴を見る」ボタンをクリックします。";
    } else if (location.pathname === "/my-reservations") {
      text = "予約確認・変更ページの操作方法です。予約を検索するには、予約時に入力したお名前か電話番号を入力して「予約を検索」ボタンをクリックします。予約の詳細を見るには「詳細を見る」ボタン、予約を変更するには「予約を変更」ボタン、予約をキャンセルするには「予約をキャンセル」ボタンをクリックします。";
    } else if (location.pathname === "/faq") {
      text = "よくある質問ページの操作方法です。質問を検索するには上部の検索ボックスに検索したい内容を入力します。カテゴリごとに質問を見るには、カテゴリタブをクリックします。質問をクリックすると回答が表示されます。";
    } else if (location.pathname.includes("/modify-reservation")) {
      text = "予約変更ページの操作方法です。チケットの種類や枚数を変更するには、該当するプルダウンメニューから選択します。座席を変更するには、座席図から新しい座席を選択します。変更を保存するには「予約を変更する」ボタンをクリックします。";
    }
    
    setIsReading(true);
    
    const utterance = speechUtils.speak(text, { rate, pitch });
    
    utterance.onend = () => {
      setIsReading(false);
    };
  };
  
  // 読み上げを停止する
  const stopReading = () => {
    speechUtils.stop();
    setIsReading(false);
  };
  
  // 読み上げ速度を変更する
  const handleRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
  };
  
  // 音の高さを変更する
  const handlePitchChange = (e) => {
    const newPitch = parseFloat(e.target.value);
    setPitch(newPitch);
  };
  
  // ページタイトルを取得する関数
  const getPageTitle = (pathname) => {
    if (pathname === "/") return "トップページです";
    if (pathname === "/schedule") return "上映スケジュールページです";
    if (pathname.includes("/reservation")) return "映画予約ページです";
    if (pathname.includes("/confirmation")) return "予約確認ページです";
    if (pathname === "/my-reservations") return "予約確認・変更ページです";
    if (pathname === "/faq") return "よくある質問ページです";
    if (pathname.includes("/modify-reservation")) return "予約変更ページです";
    
    return "シニアフレンドリー映画館のページです";
  };
  
  // 自動読み上げの設定を切り替える関数
  const toggleAutoRead = () => {
    setAutoReadEnabled(!autoReadEnabled);
    
    // 設定変更を通知
    if (!autoReadEnabled) {
      speechUtils.speak("自動読み上げを有効にしました");
    } else {
      speechUtils.speak("自動読み上げを無効にしました");
    }
  };
  
  return (
    <VoiceGuideContainer>
      <VoiceButton 
        onClick={togglePanel} 
        aria-label="音声ガイド"
        title="音声ガイド"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      </VoiceButton>
      
      <VoiceControlPanel isOpen={isPanelOpen}>
        <VoiceControlTitle>音声ガイド</VoiceControlTitle>
        {isReading ? (
          <>
            <VoiceControlButton onClick={stopReading}>
              ◼ 読み上げを停止する
            </VoiceControlButton>
            <ReadingProgress>
              🔊 読み上げ中... 停止するには上のボタンをクリックしてください。
            </ReadingProgress>
          </>
        ) : (
          <>
            <VoiceControlButton onClick={readPageDescription}>
              📄 このページの内容を読み上げる
            </VoiceControlButton>
            <VoiceControlButton onClick={readOperationGuide}>
              ℹ️ 操作方法を読み上げる
            </VoiceControlButton>
          </>
        )}
        
        <VoiceSettingsGroup>
          <VoiceSettingsLabel htmlFor="rate">
            読み上げ速度: {rate}
          </VoiceSettingsLabel>
          <VoiceSettingsRange 
            type="range" 
            id="rate" 
            min="0.5" 
            max="1.5" 
            step="0.1" 
            value={rate} 
            onChange={handleRateChange} 
          />
          
          <VoiceSettingsLabel htmlFor="pitch">
            音の高さ: {pitch}
          </VoiceSettingsLabel>
          <VoiceSettingsRange 
            type="range" 
            id="pitch" 
            min="0.5" 
            max="1.5" 
            step="0.1" 
            value={pitch} 
            onChange={handlePitchChange} 
          />
          
          <div style={{ marginTop: '16px' }}>
            <AutoReadLabel>
              <input 
                type="checkbox" 
                checked={autoReadEnabled} 
                onChange={toggleAutoRead}
              />
              ページ移動時に自動読み上げ
            </AutoReadLabel>
          </div>
        </VoiceSettingsGroup>
      </VoiceControlPanel>
    </VoiceGuideContainer>
  );
}

export default VoiceGuide;
