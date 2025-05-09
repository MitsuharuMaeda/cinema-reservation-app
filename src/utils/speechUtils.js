const speechUtils = {
  // 音声合成の初期化状態
  initialized: false,
  // 音声合成のインスタンス
  synth: null,
  // 利用可能な音声のリスト
  voices: [],
  // 選択された音声（日本語優先）
  selectedVoice: null,
  
  // 音声合成の初期化
  init() {
    if (typeof window !== 'undefined' && !this.initialized) {
      this.synth = window.speechSynthesis;
      this.initialized = true;
      
      // 音声のロード
      this.loadVoices();
      
      // 音声リストが変更された時のイベントリスナー
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = this.loadVoices.bind(this);
      }
    }
  },
  
  // 利用可能な音声を読み込み、日本語の音声を優先的に選択
  loadVoices() {
    if (!this.synth) return;
    
    this.voices = this.synth.getVoices();
    
    // 日本語の音声を探す
    const japaneseVoice = this.voices.find(voice => 
      voice.lang.includes('ja-JP') || voice.lang.includes('ja')
    );
    
    // 日本語の音声がなければ、デフォルトの音声を使用
    this.selectedVoice = japaneseVoice || this.voices[0];
  },
  
  // テキストを読み上げる
  speak(text, options = {}) {
    if (!this.initialized) {
      this.init();
    }
    
    if (!this.synth || !text) return;
    
    // 現在の読み上げを停止
    this.stop();
    
    // 音声合成のためのインスタンスを作成
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 音声の設定
    utterance.voice = this.selectedVoice;
    utterance.pitch = options.pitch || 1;
    utterance.rate = options.rate || 0.9; // やや遅めの速度でわかりやすく
    utterance.volume = options.volume || 1;
    
    // 読み上げ開始
    this.synth.speak(utterance);
    
    return utterance;
  },
  
  // 読み上げを停止
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  },
  
  // 現在利用可能な音声リストを返す
  getVoices() {
    if (!this.initialized) {
      this.init();
    }
    return this.voices;
  },
  
  // 音声を設定する
  setVoice(voiceIndex) {
    if (this.voices[voiceIndex]) {
      this.selectedVoice = this.voices[voiceIndex];
    }
  }
};

export default speechUtils;
