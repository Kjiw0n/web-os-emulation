### 팀 **욧시욧시**의 **Web OS Emulation** 프로젝트 공간입니다!

> Web OS Emulation은 웹 환경에서 실제 운영체제(OS)를 사용하는 듯한 경험을 제공하는 가상 운영체제 시뮬레이터입니다.
>
> 사용자는 부팅 → 바탕화면 진입 → 터미널 실행 → 파일 탐색기 열기 등의 일련의 과정을 통해, 웹 브라우저 상에서 OS의 작동 원리를 경험할 수 있습니다.

### 팀원 소개

|<a href="https://github.com/vaaast-lake"><img src="https://avatars.githubusercontent.com/u/101388919?v=4" witdth="150px" height="150px"></a>|<a href="https://github.com/Kjiw0n"><img src="https://avatars.githubusercontent.com/u/128016888?v=4" witdth="150px" height="150px"></a>|<a href="https://github.com/AYEOOON"><img src="https://avatars.githubusercontent.com/u/101050134?v=4" witdth="150px" height="150px"></a>|<a href="https://github.com/whateveriiwant"><img src="https://avatars.githubusercontent.com/u/80333011?v=4" witdth="150px" height="150px"></a>|
|:-:|:-:|:-:|:-:|
|[J019_권대호](https://github.com/vaaast-lake)|[J072_김지원](https://github.com/Kjiw0n)|[J050_김아연](https://github.com/AYEOOON)|[J242_정승준](https://github.com/whateveriiwant)|

#### 한마디

<img src="https://avatars.githubusercontent.com/u/101388919?v=4" witdth="30px" height="30px"> : 개구리 우러욧 <br>
<img src="https://avatars.githubusercontent.com/u/128016888?v=4" witdth="30px" height="30px"> : 힘내욧 <br>
<img src="https://avatars.githubusercontent.com/u/101050134?v=4" witdth="30px" height="30px"> : 즐겁게 지내욧 <br>
<img src="https://avatars.githubusercontent.com/u/80333011?v=4" witdth="30px" height="30px"> : 학교 돌아가기 싫어욧

---

### Contents

**[그라운드룰](https://github.com/boostcampwm2025/web01-web-os-emulation/wiki/%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C%EB%A3%B0)**

Web01 팀이 지향하는 문화에 대한 내용을 담았습니다. 개인이 아닌 팀의 의사결정을 반영하기 위해 언제/어떻게 대화할지, 팀을 위해 각자는 어떤 역할을 맡았는지 알아보실 수 있습니다.

**[개발 컨벤션](https://github.com/boostcampwm2025/web01-web-os-emulation/wiki/%EA%B0%9C%EB%B0%9C-%EC%BB%A8%EB%B2%A4%EC%85%98)**

개발 과정에서 발생할 수 있는 혼란을 미연에 방지하기 위해 한 몸으로 움직이는 방법에 대해 고민했습니다.

---

### 주요 기능

| 구분 | 설명 |
| --- | --- |
| 🖥️ 시스템 부팅 | 사용자가 “전원 버튼”을 클릭하면 가상 OS가 부팅되고, 초기 프로세스 및 기본 터미널 창이 실행됩니다. |
| 💬 터미널 | 실제 콘솔처럼 명령어 입력을 통해 파일/시스템을 제어할 수 있습니다. (예: `ls`, `cat`, `echo`) |
| 📁 파일 탐색기 | 가상 파일 시스템을 시각적으로 탐색 및 관리할 수 있는 GUI 환경을 제공합니다. |
| 🧠 프로세스 관리 | 실행 중인 프로세스 목록을 관리하고, 각 프로세스별로 윈도우 상태를 추적합니다. |
| 🪟 윈도우 시스템 | 창 이동, 크기 조절, z-index 관리 등 데스크톱 OS의 핵심 UX를 제공합니다. |

---

### ERD

<img width="1000" height="466" alt="스크린샷 2025-11-11 15 47 13" src="https://github.com/user-attachments/assets/379cd2fb-f586-41c3-8ee9-c8303d8c3420" />

| 테이블명 | 설명 |
| --- | --- |
| **시스템 정보** | 가상 OS의 전체 상태를 관리하는 테이블입니다. 부팅 상태(`status`), 버전(`version`), OS 이름(`os_name`), 부팅/종료 시각 등을 저장합니다. |
| **프로세스** | 실행 중인 애플리케이션(프로세스)의 정보를 관리합니다. 어떤 파일로부터 실행되었는지(`file_id`), 상태(`status`), 시작/종료 시간 등을 포함합니다. |
| **윈도우 창** | 사용자 화면에 표시되는 개별 창(Window)의 속성을 관리합니다. 위치(`x`, `y`), 크기(`width`, `height`), Z-인덱스(`z_index`), 프로세스 연결(`process_id`)을 통해 UI를 제어합니다. |
| **파일/디렉토리** | 가상 파일 시스템의 기본 구조를 표현합니다. 디렉토리 계층(`parent_id`), 파일 크기(`size`), 확장자(`file_extension`), 권한(`permissions`) 등을 포함하며, 파일의 아이콘이나 썸네일을 위한 `image_url`도 저장합니다. |

- **시스템 정보 → 프로세스 (1:N)**
    
    : 하나의 시스템에는 여러 프로세스가 존재할 수 있습니다.
    
- **프로세스 → 윈도우 창 (1:N)**
    
    : 하나의 프로세스는 여러 개의 윈도우를 생성할 수 있습니다.
    
- **프로세스 → 파일/디렉토리 (N:1)**
    
    : 각 프로세스는 특정 파일(실행 파일)로부터 실행됩니다.
    
- **파일/디렉토리 → 파일/디렉토리 (1:N 자기참조)**
    
    : 디렉토리 내부에 다른 파일이나 디렉토리가 포함되는 구조를 표현합니다.

---

### Stacks

#### Development

<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" />


#### Frontend

> 운영체제의 그래픽 환경(UI)과 사용자 상호작용 로직을 담당합니다.

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /> 
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /> <img src="https://img.shields.io/badge/Tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />


#### Backend

> 가상 운영체제의 시스템 동작 로직을 관리하는 핵심 엔진을 담당합니다.

<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" /> <img src="https://img.shields.io/badge/Mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /> 

#### Infra

<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" /> 
