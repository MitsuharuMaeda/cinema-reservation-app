import { db } from "./config";
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";

// サンプル映画データ（2024年上映作品ベース、シニア向け）
const moviesData = [
  {
    title: "キングダム 大将軍の帰還",
    description: "中国春秋戦国時代を舞台にした人気漫画の実写映画第4作。大将軍・王翦との決戦に挑む信と政の活躍を描く。迫力のアクションと感動のドラマ。",
    duration: 134,
    genre: "アクション/歴史",
    releaseYear: 2024,
    director: "佐藤信介",
    imageUrl: "/images/posters/kingdam.jpg"
  },
  {
    title: "君たちはどう生きるか",
    description: "宮崎駿監督による感動のアニメーション。少年の成長と戦時下の日本を描いた名作。美しい映像と深いメッセージが心に響きます。",
    duration: 124,
    genre: "アニメーション",
    releaseYear: 2023,
    director: "宮崎 駿",
    imageUrl: "/images/posters/kimitachi.jpg"
  },
  {
    title: "怪物",
    description: "コロナ禍の小学校を舞台に、母と子、教師それぞれの視点から真実を描く是枝裕和監督の傑作。カンヌ国際映画祭脚本賞受賞作品。",
    duration: 126,
    genre: "ドラマ/ミステリー",
    releaseYear: 2023,
    director: "是枝 裕和",
    imageUrl: "/images/posters/kaibutsu.jpg"
  },
  {
    title: "ゴジラ-1.0",
    description: "戦後間もない日本を襲う巨大生物の恐怖。山崎貴監督によるゴジラシリーズ最新作。オスカー受賞の話題作をぜひ大スクリーンで。",
    duration: 124,
    genre: "アクション/SF",
    releaseYear: 2023,
    director: "山崎 貴",
    imageUrl: "/images/posters/godzilla.jpg"
  },
  {
    title: "四月になれば彼女は",
    description: "定年退職した男性が昔の恋人を思い出し、再会を試みる感動ドラマ。人生の後半に訪れる静かな愛の物語。シニア世代の共感を呼ぶヒューマンドラマ。",
    duration: 116,
    genre: "ドラマ/ロマンス",
    releaseYear: 2024,
    director: "吉田 康弘",
    imageUrl: "/images/posters/april.jpg"
  },
  {
    title: "名探偵コナン 100万ドルの五稜星",
    description: "人気アニメシリーズの27作目。函館を舞台に、100万ドルの価値がある「五稜星」をめぐるミステリー。老若男女で楽しめる国民的作品。",
    duration: 110,
    genre: "アニメ/ミステリー",
    releaseYear: 2024,
    director: "満仲勧",
    imageUrl: "/images/posters/conan.jpg"
  },
  {
    title: "老後の居場所",
    description: "高齢化社会の課題に向き合う夫婦の実話をもとにした感動作。地域コミュニティの大切さと、人生の最終章を自分らしく生きる勇気を描く話題作。",
    duration: 120,
    genre: "ドラマ",
    releaseYear: 2024,
    director: "黒木 瞳",
    imageUrl: "/images/posters/roogo.jpg"
  },
  {
    title: "デッドプール＆ウルヴァリン",
    description: "マーベル・ユニバースの異色ヒーロー2人が初共演。過激なユーモアと派手なアクションの融合。お孫さんと一緒に楽しめる話題作。",
    duration: 127,
    genre: "アクション/コメディ",
    releaseYear: 2024,
    director: "ショーン・レヴィ",
    imageUrl: "/images/posters/deadpool.jpg"
  }
];

// 上映時間データ（1週間分）
const generateShowtimes = () => {
  const showtimes = [];
  const startDate = new Date();
  
  // 多様な上映時間を設定
  const allTimeSlots = [
    "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", 
    "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30"
  ];
  
  // シアターごとの特性を設定
  const theaters = [
    { name: "シアター1", capacity: 120 },
    { name: "シアター2", capacity: 80 },
    { name: "シアター3", capacity: 150 }
  ];
  
  // 各日付、各シアターの予約済み時間枠を追跡するオブジェクト
  const bookedTimeSlots = {};
  
  // 日付とシアター名から一意のキーを生成する関数
  const getBookingKey = (dateStr, theaterName) => `${dateStr}_${theaterName}`;
  
  // 指定した上映時間と映画の上映時間（分）から終了時間を計算
  const calculateEndTime = (startTimeStr, durationMinutes) => {
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    let endDate = new Date();
    endDate.setHours(hours, minutes, 0, 0);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes + 30); // 上映時間 + 30分の準備時間
    
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    
    return `${endHours}:${endMinutes}`;
  };
  
  // 指定した時間が既存の上映と重複するかチェック
  const isTimeSlotOverlapping = (dateStr, theaterName, startTime, duration) => {
    const key = getBookingKey(dateStr, theaterName);
    
    if (!bookedTimeSlots[key]) {
      return false; // まだ予約がない場合は重複なし
    }
    
    const endTime = calculateEndTime(startTime, duration);
    
    // 既存の予約との重複をチェック
    for (const slot of bookedTimeSlots[key]) {
      // 開始時間が既存の上映の間にある場合
      if (startTime >= slot.startTime && startTime < slot.endTime) {
        return true;
      }
      // 終了時間が既存の上映の間にある場合
      if (endTime > slot.startTime && endTime <= slot.endTime) {
        return true;
      }
      // 既存の上映を包含する場合
      if (startTime <= slot.startTime && endTime >= slot.endTime) {
        return true;
      }
    }
    
    return false;
  };
  
  // 時間枠を予約済みとしてマーク
  const bookTimeSlot = (dateStr, theaterName, startTime, duration) => {
    const key = getBookingKey(dateStr, theaterName);
    const endTime = calculateEndTime(startTime, duration);
    
    if (!bookedTimeSlots[key]) {
      bookedTimeSlots[key] = [];
    }
    
    bookedTimeSlots[key].push({
      startTime,
      endTime,
      duration
    });
  };
  
  // 映画ごとに上映スケジュールを生成
  for (const movie of moviesData) {
    // この映画の希望上映回数（1日あたり）
    const targetDailyScreenings = Math.floor(Math.random() * 2) + 2; // 2〜3回
    
    // 各日付について処理
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + day);
      const dateStr = date.toISOString().split('T')[0];
      
      // 平日か週末かでスケジュールを変える
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const maxScreeningsForDay = isWeekend ? targetDailyScreenings + 1 : targetDailyScreenings;
      
      // 各シアターについて処理
      for (const theater of theaters) {
        // このシアターでこの映画を上映するかどうか（ランダムに決定）
        if (Math.random() > 0.6) { // 40%の確率で上映
          // この映画をこのシアターで何回上映するか
          const screeningsInThisTheater = Math.floor(Math.random() * 2) + 1; // 1〜2回
          let addedScreenings = 0;
          
          // 上映時間をシャッフル
          const shuffledTimeSlots = [...allTimeSlots].sort(() => 0.5 - Math.random());
          
          // 重複しない時間枠を見つけて上映スケジュールを追加
          for (const timeSlot of shuffledTimeSlots) {
            if (addedScreenings >= screeningsInThisTheater) {
              break; // 目標の上映回数に達したら終了
            }
            
            // 時間が重複していないかチェック
            if (!isTimeSlotOverlapping(dateStr, theater.name, timeSlot, movie.duration)) {
              // 重複がなければスケジュールに追加
              showtimes.push({
                movieTitle: movie.title,
                date: dateStr,
                time: timeSlot,
                theater: theater.name,
                availableSeats: Math.floor(theater.capacity * (0.5 + Math.random() * 0.4)), // 50%〜90%の座席が利用可能
                duration: movie.duration
              });
              
              // この時間枠を予約済みとしてマーク
              bookTimeSlot(dateStr, theater.name, timeSlot, movie.duration);
              
              addedScreenings++;
            }
          }
        }
      }
    }
  }
  
  return showtimes;
};

// シアターごとの座席マップを作成する関数
const createTheaterSeats = async () => {
  try {
    // theaters コレクションがあるか確認
    const theatersSnapshot = await getDocs(collection(db, "theaters"));
    if (theatersSnapshot.size > 0) {
      console.log("劇場データは既に存在します。");
      return;
    }
    
    // 劇場データを追加
    const theaters = [
      { name: "シアター1", rows: 8, cols: 10 },
      { name: "シアター2", rows: 10, cols: 12 },
      { name: "シアター3", rows: 6, cols: 8 }
    ];
    
    for (const theater of theaters) {
      await addDoc(collection(db, "theaters"), theater);
      console.log(`劇場「${theater.name}」を追加しました。`);
    }
    
    console.log("劇場データの初期化が完了しました！");
  } catch (error) {
    console.error("劇場データの初期化中にエラーが発生しました:", error);
  }
};

// 既存のデータを削除する関数を追加
const clearCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log(`${collectionName}コレクションのデータを削除しました`);
};

// 検証用の関数を追加 - 同一シアターでの重複がないかチェック
const validateShowtimes = (showtimes) => {
  const theaterSchedules = {};
  
  for (const showtime of showtimes) {
    const key = `${showtime.date}_${showtime.theater}`;
    
    if (!theaterSchedules[key]) {
      theaterSchedules[key] = [];
    }
    
    // 上映の開始時間と終了時間を計算
    const [startHour, startMinute] = showtime.time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = startMinutes + showtime.duration + 30; // 上映時間 + 30分の準備時間
    
    const current = {
      movie: showtime.movieTitle,
      start: startMinutes,
      end: endMinutes,
      time: showtime.time
    };
    
    // 既存の上映とチェック
    for (const existing of theaterSchedules[key]) {
      // 重複チェック
      if (
        (current.start >= existing.start && current.start < existing.end) || // 開始時間が既存の間
        (current.end > existing.start && current.end <= existing.end) || // 終了時間が既存の間
        (current.start <= existing.start && current.end >= existing.end) // 既存を包含
      ) {
        console.error(`重複を検出: ${key}`);
        console.error(`  ${current.movie} (${current.time}) と ${existing.movie} (${existing.time})`);
        return false;
      }
    }
    
    theaterSchedules[key].push(current);
  }
  
  console.log("重複なし: すべての上映スケジュールは有効です");
  return true;
};

// seedDatabase関数を更新
export const seedDatabase = async () => {
  try {
    // 既存のデータを削除
    await clearCollection("movies");
    await clearCollection("showtimes");
    console.log("既存のデータを削除しました");
    
    // 映画データを追加
    for (const movie of moviesData) {
      const docRef = await addDoc(collection(db, "movies"), movie);
      console.log(`映画「${movie.title}」を追加しました。ID: ${docRef.id}`);
    }
    
    // 上映スケジュールを追加
    const showtimesData = generateShowtimes();
    
    // スケジュールの検証
    const isValid = validateShowtimes(showtimesData);
    if (!isValid) {
      console.error("上映スケジュールに重複があります。修正してください。");
      // 重複があってもとりあえず追加する場合はコメントアウトを解除
      // return;
    }
    
    for (const showtime of showtimesData) {
      await addDoc(collection(db, "showtimes"), showtime);
    }
    
    // 劇場と座席情報を追加
    await createTheaterSeats();
    
    console.log("データベースの初期化が完了しました！");
  } catch (error) {
    console.error("データベースの初期化中にエラーが発生しました:", error);
  }
};
