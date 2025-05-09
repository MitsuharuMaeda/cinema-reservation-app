import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../firebase/auth";
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
  CinemaErrorMessage
} from "../styles/CinemaTheme";
import styled from "styled-components";

const PageContainer = styled(CinemaPageContainer)``;

const ContentWrapper = styled(CinemaContentContainer)`
  max-width: 500px;
`;

const PageTitle = styled(CinemaTitle)`
  margin-bottom: 30px;
`;

const GoogleButton = styled(CinemaSubmitButton)`
  background-color: #4285F4;
  margin-top: var(--spacing-medium);
  
  &:hover {
    background-color: #3367D6;
  }
`;

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await loginWithEmail(formData.email, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setError("メールアドレスまたはパスワードが正しくありません。");
      }
    } catch (error) {
      setError("ログイン中にエラーが発生しました。後でもう一度お試しください。");
      console.error(error);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        navigate("/");
      } else {
        setError("Googleログインでエラーが発生しました。");
      }
    } catch (error) {
      setError("ログイン中にエラーが発生しました。後でもう一度お試しください。");
      console.error(error);
    }
    
    setLoading(false);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>ログイン</PageTitle>
        
        <CinemaForm onSubmit={handleSubmit}>
          {error && <CinemaErrorMessage>{error}</CinemaErrorMessage>}
          
          <CinemaFormGroup>
            <CinemaLabel htmlFor="email">メールアドレス:</CinemaLabel>
            <CinemaInput 
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@example.com"
            />
          </CinemaFormGroup>
          
          <CinemaFormGroup>
            <CinemaLabel htmlFor="password">パスワード:</CinemaLabel>
            <CinemaInput 
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="パスワードを入力"
            />
          </CinemaFormGroup>
          
          <CinemaSubmitButton type="submit" disabled={loading}>
            {loading ? "ログイン中..." : "ログイン"}
          </CinemaSubmitButton>
          
          <GoogleButton type="button" onClick={handleGoogleLogin} disabled={loading}>
            Googleでログイン
          </GoogleButton>
          
          <CinemaLinkText>
            アカウントをお持ちでない方は <Link to="/register" style={{color: '#ADD8E6', textDecoration: 'underline'}}>新規登録</Link>
          </CinemaLinkText>
          
          <CinemaLinkText>
            <Link to="/reset-password" style={{color: '#ADD8E6', textDecoration: 'underline'}}>パスワードをお忘れですか？</Link>
          </CinemaLinkText>
        </CinemaForm>
      </ContentWrapper>
    </PageContainer>
  );
}

export default LoginPage;
