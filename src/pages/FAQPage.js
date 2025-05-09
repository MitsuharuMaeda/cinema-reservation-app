import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import { OrderedList } from "../components/CustomList";
import { 
  CinemaPageContainer, 
  CinemaContentContainer, 
  CinemaTitle
} from "../styles/CinemaTheme";

const PageContainer = styled(CinemaPageContainer)``;

const ContentWrapper = styled(CinemaContentContainer)`
  text-align: left;
`;

const YellowBorderContainer = styled.div`
  border: 2px solid #FFD700;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  position: relative;
`;

const PageTitle = styled(CinemaTitle)`
  text-align: center;
  width: 100%;
  margin: 40px auto 30px;
  font-size: 32px;
  color: #FFD700;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
`;

const HeaderArea = styled.div`
  margin-bottom: 20px;
`;

const BackButton = styled(Button)`
  margin: 15px 0;
  background-color: #666;
  color: #fff;
  border-radius: 5px;
  padding: 10px 15px;
  &:hover {
    background-color: #555;
  }
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-small);
  margin-bottom: var(--spacing-large);
  border-bottom: 1px solid #eee;
  padding-bottom: var(--spacing-medium);
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 10px 0;
`;

const CategoryTab = styled.button`
  padding: var(--spacing-medium);
  background-color: ${props => props.active ? '#cc0000' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#cc0000'};
  border: 2px solid #cc0000;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-medium);
  font-weight: bold;
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    background-color: ${props => props.active ? '#aa0000' : '#ffeeee'};
  }
`;

const FAQItem = styled.div`
  margin-bottom: 25px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 25px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FAQQuestion = styled.h3`
  color: #FFD700;
  font-size: 22px;
  margin-bottom: 15px;
  cursor: pointer;
  
  &:before {
    content: 'Q. ';
    font-weight: bold;
  }
`;

const FAQAnswer = styled.div`
  color: #FFFFFF;
  font-size: 18px;
  line-height: 1.7;
  padding-left: 20px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  
  &:before {
    content: 'A. ';
    font-weight: bold;
    color: #ADD8E6;
    margin-left: -20px;
  }
  
  p {
    margin-bottom: 10px;
  }
  
  a {
    color: #ADD8E6;
    text-decoration: underline;
    
    &:hover {
      color: #FFD700;
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-medium);
  margin-bottom: var(--spacing-large);
  border: 2px solid #ccc;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: var(--spacing-xlarge);
  background-color: #f8f9fa;
  border-radius: var(--border-radius);
  color: #333333;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

// FAQ項目のデータ
const faqData = [
  {
    category: "予約方法",
    items: [
      {
        question: "映画の予約はどのように行いますか？",
        answer: (
          <>
            <p>映画の予約は以下の手順で行えます：</p>
            <OrderedList items={[
              "トップページの「上映スケジュールを見る」ボタンをクリックします。",
              "観たい映画と上映時間を選びます。",
              "希望の座席を選択します。",
              "チケットの種類と枚数を選びます。",
              "お名前と電話番号を入力します。",
              "「予約を確定する」ボタンをクリックします。"
            ]} />
            <p>予約が完了すると、予約確認ページにQRコードが表示されます。</p>
          </>
        )
      },
      {
        question: "座席は自分で選べますか？",
        answer: (
          <>
            <p>はい、座席は自分で選ぶことができます。予約ページで座席選択画面が表示されます。</p>
            <p>白色の座席が選択可能な座席、グレーの座席は既に予約済みの座席です。</p>
            <p>座席をクリックすると青色に変わり、選択されたことを示します。</p>
          </>
        )
      },
      {
        question: "予約にはクレジットカードが必要ですか？",
        answer: (
          <>
            <p>いいえ、このシステムでは事前の支払いは必要ありません。</p>
            <p>チケット代金は映画館の窓口で、予約時に表示されるQRコードをご提示の上お支払いください。</p>
          </>
        )
      }
    ]
  },
  {
    category: "変更・キャンセル",
    items: [
      {
        question: "予約内容を変更することはできますか？",
        answer: (
          <>
            <p>はい、上映時間前であれば予約内容を変更することができます。</p>
            <p>変更方法は以下の通りです：</p>
            <ol>
              <li>「予約の確認・変更」ページにアクセスします。</li>
              <li>予約時に使用したお名前と電話番号を入力して予約を検索します。</li>
              <li>変更したい予約の「予約を変更」ボタンをクリックします。</li>
              <li>チケット種類、枚数、座席などを変更し、「予約を変更する」ボタンをクリックします。</li>
            </ol>
          </>
        )
      },
      {
        question: "予約をキャンセルするにはどうすればいいですか？",
        answer: (
          <>
            <p>予約のキャンセルは以下の手順で行えます：</p>
            <ol>
              <li>「予約の確認・変更」ページにアクセスします。</li>
              <li>予約時に使用したお名前と電話番号を入力して予約を検索します。</li>
              <li>キャンセルしたい予約の「予約をキャンセル」ボタンをクリックします。</li>
              <li>確認画面で「キャンセルする」ボタンをクリックします。</li>
            </ol>
            <p>※上映時間を過ぎた予約はキャンセルできません。</p>
          </>
        )
      },
      {
        question: "キャンセル料はかかりますか？",
        answer: (
          <>
            <p>当日のキャンセルについてはキャンセル料が発生する場合があります。詳細は映画館のスタッフにお問い合わせください。</p>
          </>
        )
      }
    ]
  },
  {
    category: "チケット",
    items: [
      {
        question: "チケットの種類と料金を教えてください",
        answer: (
          <>
            <p>チケットには以下の種類があります：</p>
            <ul>
              <li><strong>一般</strong>: 1,800円</li>
              <li><strong>シニア（60歳以上）</strong>: 1,100円</li>
              <li><strong>子供（小学生以下）</strong>: 900円</li>
            </ul>
            <p>※料金は変更される場合があります。</p>
          </>
        )
      },
      {
        question: "チケットはどこで受け取りますか？",
        answer: (
          <>
            <p>予約完了後に表示されるQRコードを映画館窓口でご提示ください。スタッフがチケットをお渡しします。</p>
            <p>予約内容は「予約の確認・変更」ページからいつでも確認できます。</p>
          </>
        )
      }
    ]
  },
  {
    category: "使い方・操作",
    items: [
      {
        question: "文字が小さくて見えません。大きくできますか？",
        answer: (
          <>
            <p>画面右上の「A+」ボタンをクリックすると文字サイズを大きくすることができます。「A-」ボタンで小さくできます。</p>
          </>
        )
      },
      {
        question: "予約したことを忘れてしまいました。確認できますか？",
        answer: (
          <>
            <p>「予約の確認・変更」ページで予約時に使用したお名前と電話番号を入力すると、予約内容を確認できます。</p>
          </>
        )
      },
      {
        question: "操作方法がわかりません。助けてもらえますか？",
        answer: (
          <>
            <p>各ページの上部にある「？」アイコンをクリックすると、そのページの操作方法が表示されます。</p>
            <p>また、映画館のスタッフにお電話いただければ、予約のサポートを受けることができます。</p>
          </>
        )
      }
    ]
  },
  {
    category: "アカウントとログイン",
    items: [
      {
        question: "アカウント登録が必要ですか？",
        answer: (
          <>
            <p>映画情報の閲覧はアカウント登録なしでも可能ですが、予約するにはアカウント登録とログインが必要です。</p>
            <p>登録は簡単に行えます。メールアドレスとパスワードを設定するか、Googleアカウントを使ってログインできます。</p>
          </>
        )
      },
      {
        question: "パスワードを忘れてしまいました",
        answer: (
          <>
            <p>パスワードを忘れた場合は、ログインページの「パスワードをお忘れですか？」リンクをクリックしてください。</p>
            <p>登録したメールアドレスにパスワードリセット用のリンクが送信されます。</p>
          </>
        )
      },
      {
        question: "アカウント情報の変更方法は？",
        answer: (
          <>
            <p>ログイン後、右上のユーザーメニューから「プロフィール」を選択すると、アカウント情報の確認・変更ができます。</p>
          </>
        )
      }
    ]
  }
];

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("予約方法");
  const [openQuestions, setOpenQuestions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // カテゴリを切り替える
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // 検索結果をクリア
    setSearchQuery("");
  };
  
  // 質問の開閉を切り替える
  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // 検索処理
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // カテゴリ選択をリセット（検索時はすべてのカテゴリから検索）
    if (e.target.value) {
      setActiveCategory("");
    } else {
      setActiveCategory("予約方法");
    }
  };
  
  // 検索結果またはアクティブカテゴリのFAQを取得
  const getFAQItems = () => {
    if (searchQuery) {
      const results = [];
      faqData.forEach(category => {
        category.items.forEach(item => {
          if (
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
          ) {
            results.push({
              category: category.category,
              ...item
            });
          }
        });
      });
      return results;
    }
    
    if (activeCategory) {
      const categoryData = faqData.find(c => c.category === activeCategory);
      return categoryData ? categoryData.items.map(item => ({
        category: activeCategory,
        ...item
      })) : [];
    }
    
    // すべてのFAQを返す
    return faqData.flatMap(category => 
      category.items.map(item => ({
        category: category.category,
        ...item
      }))
    );
  };
  
  const faqItems = getFAQItems();
  
  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderArea>
          <StyledLink to="/">
            <BackButton className="secondary">
              ← トップページに戻る
            </BackButton>
          </StyledLink>
        </HeaderArea>
        
        <YellowBorderContainer>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <PageTitle>よくある質問（FAQ）</PageTitle>
          </div>
          
          <FAQContainer>
            <SearchInput 
              type="text" 
              placeholder="質問を検索..."
              value={searchQuery}
              onChange={handleSearch}
              aria-label="質問を検索"
            />
            
            <CategoryTabs>
              {faqData.map((category, index) => (
                <CategoryTab 
                  key={index}
                  active={activeCategory === category.category}
                  onClick={() => handleCategoryChange(category.category)}
                >
                  {category.category}
                </CategoryTab>
              ))}
            </CategoryTabs>
            
            {faqItems.length > 0 ? (
              faqItems.map((item, index) => {
                const key = `${item.category}-${index}`;
                return (
                  <FAQItem key={key}>
                    <FAQQuestion onClick={() => toggleQuestion(item.category, index)}>
                      <span>
                        {searchQuery && <small>[{item.category}]</small>} {item.question}
                      </span>
                      <span>{openQuestions[key] ? '▲' : '▼'}</span>
                    </FAQQuestion>
                    <FAQAnswer isOpen={openQuestions[key]}>
                      {item.answer}
                    </FAQAnswer>
                  </FAQItem>
                );
              })
            ) : (
              <NoResults>
                <h3>検索結果がありません</h3>
                <p>別のキーワードで検索してみてください。</p>
              </NoResults>
            )}
          </FAQContainer>
        </YellowBorderContainer>
      </ContentWrapper>
    </PageContainer>
  );
}

export default FAQPage;
