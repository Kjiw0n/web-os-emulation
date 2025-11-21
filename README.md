## 팀 **욧시욧시**의 **Web OS Emulation** 프로젝트 공간입니다!

> Web OS Emulation은 웹 환경에서 실제 운영체제(OS)를 사용하는 듯한 경험을 제공하는 가상 운영체제 시뮬레이터입니다.
>
>
> 직접 경험해보고 싶다면, 👉 https://web01os.duckdns.org/

---

## 팀원 소개

|<a href="https://github.com/vaaast-lake"><img src="https://avatars.githubusercontent.com/u/101388919?v=4" witdth="150px" height="150px"></a>|<a href="https://github.com/Kjiw0n"><img src="https://avatars.githubusercontent.com/u/128016888?v=4" witdth="150px" height="150px"></a>|<a href="https://github.com/AYEOOON"><img src="https://avatars.githubusercontent.com/u/101050134?v=4" witdth="150px" height="150px"></a>|<a href="https://github.com/whateveriiwant"><img src="https://avatars.githubusercontent.com/u/80333011?v=4" witdth="150px" height="150px"></a>|
|:-:|:-:|:-:|:-:|
|[J019_권대호](https://github.com/vaaast-lake)|[J072_김지원](https://github.com/Kjiw0n)|[J050_김아연](https://github.com/AYEOOON)|[J242_정승준](https://github.com/whateveriiwant)|

---

## 그라운드룰 & 개발 컨벤션

**[그라운드룰](https://github.com/boostcampwm2025/web01-web-os-emulation/wiki/%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C%EB%A3%B0)**

Web01 팀이 지향하는 문화에 대한 내용을 담았습니다. 개인이 아닌 팀의 의사결정을 반영하기 위해 언제/어떻게 대화할지, 팀을 위해 각자는 어떤 역할을 맡았는지 알아보실 수 있습니다.

**[개발 컨벤션](https://github.com/boostcampwm2025/web01-web-os-emulation/wiki/%EA%B0%9C%EB%B0%9C-%EC%BB%A8%EB%B2%A4%EC%85%98)**

개발 과정에서 발생할 수 있는 혼란을 미연에 방지하기 위해 한 몸으로 움직이는 방법에 대해 고민했습니다.

---

## 주요 기능

| 구분 | 설명 |
| --- | --- |
| 🖥️ 시스템 부팅 | 사용자가 “전원 버튼”을 클릭하면 가상 OS가 부팅되고, 초기 프로세스 및 기본 터미널 창이 실행됩니다. |
| 💬 터미널 | 실제 콘솔처럼 명령어 입력을 통해 파일/시스템을 제어할 수 있습니다. (예: `ls`, `cat`, `echo`) |
| 📁 파일 탐색기 | 가상 파일 시스템을 시각적으로 탐색 및 관리할 수 있는 GUI 환경을 제공합니다. |
| 🧠 프로세스 관리 | 실행 중인 프로세스 목록을 관리하고, 각 프로세스별로 윈도우 상태를 추적합니다. |
| 🪟 윈도우 시스템 | 창 이동, 크기 조절, z-index 관리 등 데스크톱 OS의 핵심 UX를 제공합니다. |
| 📝 메모장 | 여러 사용자가 동시에 메모를 생성·편집할 수 있으며, Yjs 기반 실시간 공동 편집과 자동 저장 기능을 제공합니다. |

---

## 현재 지원 중인 터미널 명령어

| 명령어 | 설명 |
| --- | --- |
| **cd <경로>** | 현재 작업 디렉토리를 변경합니다. (절대/상대 경로 모두 지원) |
| **pwd** | 현재 작업 중인 디렉토리의 절대 경로를 출력합니다. |
| **ls [경로]** | 디렉토리 내의 파일 및 폴더 목록을 조회합니다. (기본: 현재 디렉토리) |
| **cat <파일명>** | 텍스트 파일의 내용을 출력합니다. |
| **mkdir <디렉토리명>** | 새로운 디렉토리를 생성합니다. |
| **rm <파일명>** | 파일을 삭제합니다. (디렉토리는 삭제 불가) |
| **write <파일명> <내용>** | 지정한 파일명을 가진 텍스트 파일을 생성하거나 덮어씁니다. |

---

## Stacks

### Development

<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" />

<br/>

### Frontend

> 운영체제의 그래픽 환경(UI)과 사용자 상호작용 로직을 담당합니다.

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /> 
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /> <img src="https://img.shields.io/badge/Tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />


```
frontend/src
├── api
│   └── axiosInstance.ts           # API 호출의 공통 설정
├── assets/Icons                   # SVG 아이콘 모음
├── components
│   ├── apps
│   │   ├── Notepad                
│   │   │   ├── Notepad.tsx        # 전체 메모장 앱을 감싸는 root 컴포넌트
│   │   │   ├── NotePadEditor.tsx  # 메모 내용을 입력받고 업데이트하는 에디터
│   │   │   ├── NotePadList.tsx    # 메모 목록 표시
│   │   │   └── notes.ts           # /notes 관련 API
│   │   └── Terminal
│   │       ├── syscall.ts         # /syscall 관련 API
│   │       └── Terminal.tsx       # 사용자 입력을 받아 UI에 표시
│   └── Window
│       ├── Window.tsx             # 실제 OS-like 창 UI
│       └── windowAPI.ts           # /windows 관련 API
├── pages
│   ├── BootPage.tsx               # 부팅 화면
│   └── DesktopPage.tsx            # 실제 데스크탑 UI
└── App.tsx
```

<br/>

#### Backend

> 가상 운영체제의 시스템 동작 로직을 관리하는 핵심 엔진을 담당합니다.

<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" /> <img src="https://img.shields.io/badge/Mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /> 


```
backend/src
├── app.controller.ts            # 기본 앱 컨트롤러
├── app.service.ts               # 기본 앱 서비스
├── app.module.ts                # 루트 모듈
├── main.ts                      # 애플리케이션 엔트리포인트
│
├── database/
│   ├── data-source.ts           # TypeORM 데이터베이스 설정
│   └── seeds/
│       └── initial-seed.ts      # 초기 파일/디렉토리 시드 데이터
│
├── file-system/                 # 가상 파일 시스템(FS) 도메인
│   ├── dto/                     # DTO 정의
│   ├── entities/                # FileSystem 엔티티
│   ├── file-system.controller.ts
│   ├── file-system.service.ts
│   ├── file-system.repository.ts
│   ├── file-system.module.ts
│   └── types/                   # 파일 타입(enum)
│
├── notes/                       # 메모장 기능 전용 도메인
│   ├── dto/                     # 메모장 업데이트 DTO
│   ├── entities/                # Snapshot 엔티티
│   ├── providers/               # 초기 Notes 디렉토리 ID provider
│   ├── note-document.manager.ts # Y.js 기반 문서 관리
│   ├── note-snapshot.repository.ts
│   ├── note-snapshot.service.ts
│   ├── notes.service.ts
│   ├── notes.controller.ts
│   └── notes.module.ts
│
├── processes/                   # 프로세스(Process) 도메인
│   ├── dto/                     # Process DTOs
│   ├── entities/                # Process 엔티티
│   ├── processes.controller.ts
│   ├── processes.service.ts
│   ├── processes.repository.ts
│   └── processes.module.ts
│
├── windows/                     # 윈도우(Window) 도메인
│   ├── dto/                     # Window 관련 DTO
│   ├── entities/                # Window 엔티티
│   ├── windows.controller.ts
│   ├── windows.service.ts
│   ├── windows.repository.ts
│   └── windows.module.ts
│
├── syscall/                     # 터미널 명령어(Syscall) 처리 도메인
│   ├── dto/                     # 명령 전달 DTO
│   ├── handlers/
│   │   ├── builtins/            # 기본 명령어(clear, help, uname 등)
│   │   └── file-system/         # FS 명령어(ls, cd, rm, mkdir, write 등)
│   ├── syscall.controller.ts
│   ├── syscall.service.ts
│   └── syscall.module.ts
│
├── gateway/                     # Websocket Collaboration (메모장 협업용)
│   ├── collaboration.gateway.ts
│   └── collaboration.module.ts
│
└── s3/                          # NCP ObjectStorage 연동
    ├── s3.service.ts
    ├── s3.module.ts
    └── s3.interface.ts
```

<br/>

### Infra

<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" /> 

---

## 시스템 구성도

<img width="2030" height="1248" alt="image" src="https://github.com/user-attachments/assets/9fdaa551-92ff-4548-b631-a6bb7fa830eb" />

---

## ERD

<img width="1146" height="508" alt="Copy of os erd (2)" src="https://github.com/user-attachments/assets/d743c014-cbcc-40d5-b99c-8cb41eabf9df" />

> 더 자세한 설명은 👉 [백엔드 시스템 설계 Wiki](https://github.com/boostcampwm2025/web01-web-os-emulation/wiki/%EB%B0%B1%EC%97%94%EB%93%9C-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EC%84%A4%EA%B3%84)

---

## 클래스 & 시퀀스 다이어그램

자세한 내용은 아래 링크를 참고해주세요🙌

- 터미널 wiki
- 메모장 wiki

---

## 실행 가이드

### 사전 준비

| 항목 | 버전 |
| --- | --- |
| **Node.js** | v22 이상 권장 |
| **npm** | v10 이상 |
| **MySQL** | 8.x |
| **Docker (optional)** | 배포용 |
| **NCP Object Storage 계정** | 파일 저장용 |

<br/>

### 환경 변수 설정 (.env)

아래 내용을 참고하여 `backend/.env` 파일을 생성합니다.

```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SYNCHRONIZE=

NCP_ACCESS_KEY=
NCP_SECRET_KEY=
NCP_REGION=
NCP_BUCKET_NAME=
NCP_OBJECT_STORAGE_ENDPOINT=
```
> ⚠️ NCP_ACCESS_KEY, NCP_SECRET_KEY는 실제 Object Storage 키로 반드시 교체해야 합니다.

<br/>

### 백엔드(NestJS) 실행

#### ① 패키지 설치

```bash
cd backend
npm install
```

#### ② 도커 실행, 빌드, 익명 볼륨 삭제

```bash
npm run docker:up
```

#### ③ seed data 삽입

```bash
npm run seed
```

#### ④ 서버 실행

```bash
npm run start:dev
```

<br/>

### 프론트엔드(React + Vite) 실행

#### ① 패키지 설치

```bash
cd frontend
npm install
```

#### ② 프론트 서버 실행

```bash
npm run dev
```

---

### 시연 영상

---

> **Note**
>
> 욧시욧시의 OS System에 대한 자세한 내용은 👉 [팀 Wiki](https://github.com/boostcampwm2025/web01-web-os-emulation/wiki)
