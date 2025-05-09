import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import Button from "../components/Button";
import { 
  CinemaPageContainer, 
  CinemaContentContainer, 
  CinemaTitle
} from "../styles/CinemaTheme";

const PageContainer = styled(CinemaPageContainer)``;

const ContentWrapper = styled(CinemaContentContainer)`
  max-width: 600px;
`;

const PageTitle = styled(CinemaTitle)`
  margin-bottom: 30px;
`;

const ProfileForm = styled.form`
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

const SuccessMessage = styled.p`
  color: var(--success-color);
  margin-top: var(--spacing-small);
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: var(--spacing-medium);
`;

function ProfilePage() {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      setSuccess("プロフィールが更新されました。");
    } catch (error) {
      setError("プロフィールの更新に失敗しました。");
      console.error(error);
    }
    
    setLoading(false);
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>プロフィール</PageTitle>
        
        <ProfileForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <FormGroup>
            <Label htmlFor="displayName">お名前:</Label>
            <Input 
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">メールアドレス:</Label>
            <Input 
              type="email"
              id="email"
              value={email}
              disabled
            />
            <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
              ※メールアドレスは変更できません
            </p>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "更新中..." : "プロフィールを更新"}
          </SubmitButton>
        </ProfileForm>
      </ContentWrapper>
    </PageContainer>
  );
}

export default ProfilePage;
