import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { resetPassword } from "../firebase/auth";
import Button from "../components/Button";
import { 
  CinemaPageContainer, 
  CinemaContentContainer, 
  CinemaTitle
} from "../styles/CinemaTheme";

const PageContainer = styled(CinemaPageContainer)``;

const ContentWrapper = styled(CinemaContentContainer)`
  max-width: 500px;
`;

const PageTitle = styled(CinemaTitle)`
  margin-bottom: 30px;
`;

const ResetForm = styled.form`
  background-color: white;
  padding: var(--spacing-large);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333333;
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-large);
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: var(--spacing-small);
  color: #333333; // ダークグレーに設定
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

const ErrorMessage = styled.p`
  color: var(--error-color);
  margin-top: var(--spacing-small);
`;

const SuccessMessage = styled.p`
  color: var(--success-color);
  margin-top: var(--spacing-small);
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: var(--spacing-medium);
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: var(--spacing-large);
  color: #333333;
  
  a {
    color: var(--primary-color);
    text-decoration: underline;
    
    &:hover {
      color: var(--secondary-color);
    }
  }
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
        
        <ResetForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <FormGroup>
            <Label htmlFor="email">メールアドレス:</Label>
            <Input 
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="登録したメールアドレスを入力"
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "送信中..." : "パスワードをリセット"}
          </SubmitButton>
          
          <LoginLink>
            <Link to="/login">ログインページに戻る</Link>
          </LoginLink>
        </ResetForm>
      </ContentWrapper>
    </PageContainer>
  );
}

export default ResetPasswordPage;
