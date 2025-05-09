import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { uploadImage } from '../firebase/storage';
import Button from '../components/Button';

const PageContainer = styled.div`
  padding: var(--spacing-large);
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  margin-bottom: var(--spacing-large);
  text-align: center;
`;

const Form = styled.form`
  background-color: white;
  padding: var(--spacing-large);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-large);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-medium);
`;

const Label = styled.label`
  display: block;
  margin-bottom: var(--spacing-small);
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-medium);
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: var(--spacing-medium);
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
  min-height: 100px;
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-medium);
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
`;

const MovieList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-large);
`;

const MovieCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-medium);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MoviePoster = styled.div`
  width: 100%;
  height: 300px;
  margin-bottom: var(--spacing-medium);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius);
  }
`;

const MovieActions = styled.div`
  display: flex;
  gap: var(--spacing-small);
  margin-top: var(--spacing-medium);
`;

function AdminMoviePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    genre: '',
    releaseYear: '',
    director: '',
    image: null
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'movies'));
      const moviesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMovies(moviesList);
      setLoading(false);
    } catch (error) {
      console.error('映画データの取得に失敗しました', error);
      setError('映画データの取得に失敗しました');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const movieData = {
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration, 10),
        genre: formData.genre,
        releaseYear: parseInt(formData.releaseYear, 10),
        director: formData.director
      };

      if (formData.image) {
        // 画像をアップロード
        const imagePath = `posters/${formData.title}_${Date.now()}`;
        const uploadResult = await uploadImage(formData.image, imagePath);
        
        if (uploadResult.success) {
          movieData.imageUrl = uploadResult.url;
        } else {
          setError('画像のアップロードに失敗しました');
          return;
        }
      }

      if (selectedMovie) {
        // 既存の映画を更新
        await updateDoc(doc(db, 'movies', selectedMovie.id), movieData);
        setSuccess('映画情報を更新しました');
      } else {
        // 新しい映画を追加
        await addDoc(collection(db, 'movies'), movieData);
        setSuccess('新しい映画を追加しました');
      }

      // フォームをリセット
      setFormData({
        title: '',
        description: '',
        duration: '',
        genre: '',
        releaseYear: '',
        director: '',
        image: null
      });
      setSelectedMovie(null);

      // 映画リストを再取得
      fetchMovies();
    } catch (error) {
      console.error('映画の保存に失敗しました', error);
      setError('映画の保存に失敗しました');
    }
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      genre: movie.genre,
      releaseYear: movie.releaseYear,
      director: movie.director,
      image: null
    });
  };

  return (
    <PageContainer>
      <Link to="/">
        <Button className="secondary">← トップページに戻る</Button>
      </Link>
      
      <PageTitle>{selectedMovie ? '映画情報を編集' : '新しい映画を追加'}</PageTitle>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">タイトル</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">あらすじ</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="duration">上映時間（分）</Label>
          <Input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            required
            min="1"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="genre">ジャンル</Label>
          <Input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="releaseYear">公開年</Label>
          <Input
            type="number"
            id="releaseYear"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleInputChange}
            required
            min="1900"
            max="2100"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="director">監督</Label>
          <Input
            type="text"
            id="director"
            name="director"
            value={formData.director}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="image">ポスター画像</Label>
          <Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {selectedMovie && selectedMovie.imageUrl && (
            <div style={{ marginTop: '0.5rem' }}>
              <p>現在の画像:</p>
              <img 
                src={selectedMovie.imageUrl} 
                alt={selectedMovie.title} 
                style={{ maxWidth: '100px', marginTop: '0.5rem' }}
              />
            </div>
          )}
        </FormGroup>
        
        <Button type="submit" style={{ marginRight: '1rem' }}>
          {selectedMovie ? '更新する' : '追加する'}
        </Button>
        
        {selectedMovie && (
          <Button 
            type="button" 
            className="secondary" 
            onClick={() => {
              setSelectedMovie(null);
              setFormData({
                title: '',
                description: '',
                duration: '',
                genre: '',
                releaseYear: '',
                director: '',
                image: null
              });
            }}
          >
            キャンセル
          </Button>
        )}
      </Form>
      
      <h2>映画一覧</h2>
      
      {loading ? (
        <p>読み込み中...</p>
      ) : movies.length > 0 ? (
        <MovieList>
          {movies.map(movie => (
            <MovieCard key={movie.id}>
              <MoviePoster>
                <img 
                  src={movie.imageUrl || "https://via.placeholder.com/300x450?text=NO+IMAGE"} 
                  alt={movie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x450?text=NO+IMAGE";
                  }}
                />
              </MoviePoster>
              <h3>{movie.title}</h3>
              <p>{movie.director} 監督 / {movie.releaseYear}年</p>
              <p>{movie.duration}分 / {movie.genre}</p>
              <MovieActions>
                <Button onClick={() => handleEdit(movie)}>編集</Button>
              </MovieActions>
            </MovieCard>
          ))}
        </MovieList>
      ) : (
        <p>映画がありません。新しく追加してください。</p>
      )}
    </PageContainer>
  );
}

export default AdminMoviePage;
