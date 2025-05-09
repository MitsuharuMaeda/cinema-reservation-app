import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { loginWithEmail, loginWithGoogle } from "../firebase/auth";
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

const LoginForm = styled.form`
  background-color: white;
  padding: var(--spacing-large);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333333; // ダークグレーの文字色に設定
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-large);
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: var(--spacing-small);
  color: #333333;
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

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: var(--spacing-medium);
`;

const GoogleButton = styled(Button)`
  width: 100%;
  margin-top: var(--spacing-small);
  background-color: #4285F4;
  
  &:hover {
    background-color: #3367D6;
  }
`;

const RegisterLink = styled.p`
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
        
        <LoginForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <Label htmlFor="email">メールアドレス:</Label>
            <Input 
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@example.com"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">パスワード:</Label>
            <Input 
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="パスワードを入力"
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "ログイン中..." : "ログイン"}
          </SubmitButton>
          
          <GoogleButton type="button" onClick={handleGoogleLogin} disabled={loading}>
            Googleでログイン
          </GoogleButton>
          
          <RegisterLink>
            アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
          </RegisterLink>
          
          <RegisterLink>
            <Link to="/reset-password">パスワードをお忘れですか？</Link>
          </RegisterLink>
        </LoginForm>
      </ContentWrapper>
    </PageContainer>
  );
}

export default LoginPage;
