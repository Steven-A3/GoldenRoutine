# Morning Golden Time

당신의 아침을 황금빛으로 물들이는 골든 루틴 앱

## 소개

Morning Golden Time은 뇌과학에 기반한 아침 루틴 앱입니다. 기상 직후 뇌의 창의적인 세타파(Theta)와 알파파(Alpha) 상태를 보호하고, 도파민 중독이나 불안을 유발하는 디지털 자극을 지연시켜 부와 정신적 풍요를 모두 잡는 것을 목표로 합니다.

## 골든 루틴 6단계

1. **🔇 세타파 보호 (Digital Detox)**: 기상 직후 스마트폰 알림, 이메일, 뉴스 확인 차단
2. **🎯 의도 설정 (Intentions & Affirmations)**: 오늘 하루의 기분과 목표 설정, 긍정적 확언
3. **☀️ 빛과 감정 (Light & Mood)**: 날씨 확인 및 자연광 노출 계획 수립
4. **📝 내면 의식화 (Journaling)**: 운세 키워드 확인, 감사 일기, 저널링
5. **🏃 개인 과업 (Personal Tasks)**: 운동 및 개인 프로젝트 우선 처리
6. **📈 시장 확인 (Market Check)**: 마지막에 주가, 환율, 뉴스 확인 (주간 단위 권장)

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **PWA**: next-pwa
- **Deployment**: Vercel

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 앱을 확인할 수 있습니다.

### 프로덕션 빌드

```bash
npm run build
npm run start
```

## 환경 변수 설정

`.env.example`을 `.env.local`로 복사하고 필요한 값을 설정하세요:

```bash
cp .env.example .env.local
```

### 필요한 환경 변수

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics 측정 ID
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: Google AdSense 클라이언트 ID
- `NEXT_PUBLIC_OPENWEATHER_API_KEY`: OpenWeatherMap API 키 (선택사항)

## Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 환경 변수 설정
5. "Deploy" 클릭

## PWA 기능

- 오프라인 지원
- 홈 화면에 앱 추가 가능
- 푸시 알림 (향후 지원 예정)
- 백그라운드 동기화

## 라이선스

MIT License

## 기여

버그 리포트, 기능 제안, PR 모두 환영합니다!
