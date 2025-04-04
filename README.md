# 🚀 Nexus-Tag

![Nexus-Tag](https://github.com/user-attachments/assets/7344cfdd-97e1-45a6-9f0b-25bda6b1b258)

데이터 라벨링을 쉽고 직관적으로!  
개인 프로젝트로 개발한 **데이터 라벨링 툴**입니다.

🔗 **Live Demo:** [nexus-tag.vercel.app](https://nexus-tag.vercel.app)
🔗 **Backend Repo:** [backend repository](https://github.com/ohjooyeong/nexus-tag-server)

## 🎯 소개
Nexus-Tag는 이미지 어노테이션을 간편하게 수행할 수 있는 데이터 라벨링 도구입니다.  
개인 프로젝트로 개발되었으며, **Next.js, Nest.js, TypeORM**을 활용해 제작되었습니다.

## ✨ 주요 기능
- 📌 **워크스페이스 & 프로젝트 관리**  
  - 여러 개의 프로젝트를 생성 및 관리
  - 프로젝트별 데이터셋, 이미지 업로드 및 라벨링

- 🖍 **이미지 어노테이션 (Konva.js 활용)**
  - Bounding Box, Polygon, Mask 등 다양한 라벨링 지원
  - Zundo 활용 **Undo/Redo 기능** 제공
  - **Zoom In/Out & Panning 기능**
  - **라벨 자동 싱크** 기능 (라벨 생성시 즉시 저장)
  - 단축키를 활용한 빠른 작업
 
- 🔐 **Google OAuth 로그인**
  - 간편하고 안전한 사용자 인증 지원

- 🚀 **최적화 & 성능 개선**  
  - **Debounce 기법**으로 불필요한 렌더링 최소화
    
  - 클라이언트 상태: Zustand + Context API
  - 서버 상태: React Query

## 🛠️ 기술 스택
### Frontend
- **React, Next.js, TypeScript**
- **React-Query** (서버 상태 관리)
- **Zustand & Context API** (클라이언트 상태 관리)
- **Konva.js** (이미지 어노테이션)
- **vercel**

### Backend
- **Nest.js, TypeORM**
- **PostgreSQL**
- **AWS EC2**, Docker, docker-compose (배포)
- **AWS S3** (이미지 저장)


## 🚀 실행 방법(로컬 기준)
```bash
# 1. 레포지토리 클론
git clone https://github.com/ohjooyeong/nexus-tag.git
cd nexus-tag

# 2. 프론트엔드 실행
npm install
npm run dev

# 3. 백엔드 실행
git clone https://github.com/ohjooyeong/nexus-tag-server
npm install
docker-compose -f docker-comopose.dev.yml up --build

PostgreSQL 설치 시 가능
.env 필수
```

## 📸 스크린샷
![annotate](https://github.com/user-attachments/assets/1c1b6f0e-6ace-4d33-b8a6-ad022d0164f2)
![화면 캡처 2025-03-22 184735](https://github.com/user-attachments/assets/30a893da-1110-4d57-9ee6-3cc8206819fc)
![화면 캡처 2025-03-22 184715](https://github.com/user-attachments/assets/8273650d-227a-484c-89b9-759cce8c8743)
![화면 캡처 2025-03-22 184646](https://github.com/user-attachments/assets/0f1d6ea0-d951-40ef-a057-3e2857430c28)

## 💡 기타 및 문의
궁금한 점이 있다면 GitHub Discussions에서 소통해 주세요. 🙌
