import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../firebase/auth";
import { 
  CinemaPageContainer, 
  CinemaContentContainer, 
  CinemaTitle,
  CinemaForm,
  CinemaFormGroup,
  CinemaLabel,
  CinemaInput,
  CinemaSubmitButton,
  CinemaLinkText,
  CinemaErrorMessage,
  CinemaSuccessMessage
} from "../styles/CinemaTheme";
import styled from "styled-components";

const PageContainer = styled(CinemaPageContainer)``;

const ContentWrapper = styled(CinemaContentContainer)`
  max-width: 500px;
`;

const PageTitle = styled(CinemaTitle)`
  margin-bottom: 30px;
`;

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const result = await resetPassword(email);
      if (result.success) {
        setSuccess("パスワードリセットの手順をメールで送信しました。受信トレイをご確認ください。");
        setEmail("");
      } else {
        setError("パスワードリセットメールの送信に失敗しました。メールアドレスが正しいか確認してください。");
      }
    } catch (error) {
      setError("エラーが発生しました。後でもう一度お試しください。");
      console.error(error);
    }
    
    setLoading(false);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>パスワードのリセット</PageTitle>
        
        <CinemaForm onSubmit={handleSubmit}>
          {error && <CinemaErrorMessage>{error}</CinemaErrorMessage>}
          {success && <CinemaSuccessMessage>{success}</CinemaSuccessMessage>}
          
          <CinemaFormGroup>
            <CinemaLabel htmlFor="email">メールアドレス:</CinemaLabel>
            <CinemaInput 
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="登録したメールアドレスを入力"
            />
          </CinemaFormGroup>
          
          <CinemaSubmitButton type="submit" disabled={loading}>
            {loading ? "送信中..." : "パスワードをリセット"}
          </CinemaSubmitButton>
          
          <CinemaLinkText>
            <Link to="/login" style={{color: '#ADD8E6', textDecoration: 'underline'}}>ログインページに戻る</Link>
          </CinemaLinkText>
        </CinemaForm>
      </ContentWrapper>
    </PageContainer>
  );
}

export default ResetPasswordPage;
