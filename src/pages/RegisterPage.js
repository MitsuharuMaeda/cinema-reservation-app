import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { registerWithEmail } from "../firebase/auth";
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

const RegisterForm = styled.form`
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

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません。");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("パスワードは6文字以上で設定してください。");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await registerWithEmail(
        formData.email, 
        formData.password,
        formData.name
      );
      
      if (result.success) {
        navigate("/");
      } else {
        if (result.error.code === "auth/email-already-in-use") {
          setError("このメールアドレスは既に使用されています。");
        } else {
          setError("登録中にエラーが発生しました。後でもう一度お試しください。");
        }
      }
    } catch (error) {
      setError("登録中にエラーが発生しました。後でもう一度お試しください。");
      console.error(error);
    }
    
    setLoading(false);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>新規登録</PageTitle>
        
        <RegisterForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <Label htmlFor="name">お名前:</Label>
            <Input 
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="例: 山田 太郎"
            />
          </FormGroup>
          
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
              placeholder="6文字以上で入力"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">パスワード（確認用）:</Label>
            <Input 
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="もう一度パスワードを入力"
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "登録中..." : "登録する"}
          </SubmitButton>
          
          <LoginLink>
            既にアカウントをお持ちの方は <Link to="/login">ログイン</Link>
          </LoginLink>
        </RegisterForm>
      </ContentWrapper>
    </PageContainer>
  );
}

export default RegisterPage;
