import { useState } from "react";
import styled from "styled-components";
import { seedDatabase } from "../firebase/seedData";
import Button from "./Button";

const Container = styled.div`
  padding: 20px;
  margin: 20px 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #333333;
  border: 1px solid #ddd;
`;

const InitTitle = styled.h3`
  color: #8B0000;
  font-size: 22px;
  margin-bottom: 12px;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 8px;
`;

const InitDescription = styled.p`
  color: #333333;
  font-size: 18px;
  margin-bottom: 15px;
  line-height: 1.6;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #8B0000;
`;

const Message = styled.p`
  margin-top: 15px;
  color: ${props => props.isError ? '#cc0000' : '#006600'};
  font-weight: bold;
  font-size: 16px;
  padding: 10px;
  background-color: ${props => props.isError ? '#ffeeee' : '#eeffee'};
  border-radius: 4px;
  border-left: 4px solid ${props => props.isError ? '#cc0000' : '#006600'};
`;

const InitDatabaseButton = styled(Button)`
  margin-top: 15px;
  font-size: 18px;
  padding: 12px 20px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }
`;

function InitDatabase() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInit = async () => {
    setLoading(true);
    try {
      await seedDatabase();
      setMessage("データベースの初期化に成功しました！アプリを使用できます。");
      setIsError(false);
    } catch (error) {
      console.error("初期化エラー:", error);
      setMessage("データベースの初期化中にエラーが発生しました。");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <InitTitle>データベース初期化</InitTitle>
      <InitDescription>映画と上映スケジュールのサンプルデータをFirebaseに追加します。</InitDescription>
      <InitDatabaseButton onClick={handleInit} disabled={loading}>
        {loading ? "初期化中..." : "データベースを初期化"}
      </InitDatabaseButton>
      {message && <Message isError={isError}>{message}</Message>}
    </Container>
  );
}

export default InitDatabase;
