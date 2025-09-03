# 4YourRun
GenAI supports your healthy running.

## 🏃‍♂️ About 4YourRun

4YourRun은 AI 기반 마라톤 훈련 계획 생성 앱입니다. 개인의 목표와 러닝 기록을 바탕으로 맞춤형 훈련 계획을 제공합니다.

## ✨ Features

- 🎯 개인 맞춤형 마라톤 훈련 계획 생성
- 📱 모바일 최적화 반응형 디자인
- 🤖 Google Gemini AI 기반 지능형 추천
- 📊 주차별 상세 훈련 계획
- 💡 AI 기반 훈련 팁 및 조언
- 🔄 PWA 지원으로 앱처럼 사용 가능

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/jieunk311/4YourRun.git
cd 4YourRun
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Add your Google Gemini API key to `.env.local`:
```
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Testing**: Jest, Playwright
- **PWA**: Service Worker, Web App Manifest

## 📱 Usage

1. **마라톤 정보 입력**: 목표 시간, 마라톤 날짜 등 기본 정보 입력
2. **러닝 기록 입력**: 최근 6개월 내 러닝 기록 입력 (최대 3개)
3. **AI 훈련 계획 생성**: 개인 맞춤형 주차별 훈련 계획 확인
4. **훈련 실행**: 제공된 계획에 따라 체계적인 훈련 진행

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **jieunk311** - *Initial work* - [jieunk311](https://github.com/jieunk311)
