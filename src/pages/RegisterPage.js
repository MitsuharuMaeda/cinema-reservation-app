import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail } from "../firebase/auth";
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
        
        <CinemaForm onSubmit={handleSubmit}>
          {error && <CinemaErrorMessage>{error}</CinemaErrorMessage>}
          
          <CinemaFormGroup>
            <CinemaLabel htmlFor="name">お名前:</CinemaLabel>
            <CinemaInput 
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="例: 山田 太郎"
            />
          </CinemaFormGroup>
          
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
              placeholder="6文字以上で入力"
            />
          </CinemaFormGroup>
          
          <CinemaFormGroup>
            <CinemaLabel htmlFor="confirmPassword">パスワード（確認用）:</CinemaLabel>
            <CinemaInput 
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="もう一度パスワードを入力"
            />
          </CinemaFormGroup>
          
          <CinemaSubmitButton type="submit" disabled={loading}>
            {loading ? "登録中..." : "登録する"}
          </CinemaSubmitButton>
          
          <CinemaLinkText>
            既にアカウントをお持ちの方は <Link to="/login" style={{color: '#ADD8E6', textDecoration: 'underline'}}>ログイン</Link>
          </CinemaLinkText>
        </CinemaForm>
      </ContentWrapper>
    </PageContainer>
  );
}

export default RegisterPage;
