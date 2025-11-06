# 1. 빌드(Build) 단계
# --------------------
# Node.js 22 버전을 기반으로 'builder'라는 별명의 환경을 시작합니다.
FROM node:22-alpine AS builder

# 작업 디렉토리를 /usr/src/app으로 설정합니다.
WORKDIR /usr/src/app

# package.json과 package-lock.json을 먼저 복사합니다.
# (파일 변경이 잦은 소스코드보다 먼저 복사하여 도커 캐시를 활용, 빌드 속도 향상)
COPY package.json package-lock.json ./

# 의존성을 설치합니다.
RUN npm ci

# 전체 소스 코드를 복사합니다.
COPY . .

# TypeScript를 JavaScript로 빌드합니다.
RUN npm run build

# 2. 프로덕션(Production) 단계
# --------------------
# Node.js 22 버전을 기반으로 최종 실행 환경을 시작합니다.
FROM node:22-alpine

# 작업 디렉토리를 설정합니다.
WORKDIR /usr/src/app

# package.json과 package-lock.json을 복사합니다.
COPY package.json package-lock.json ./

# '프로덕션' 의존성만 설치합니다. (개발용 의존성 제외)
RUN npm ci --omit=dev 

# 'builder' 단계에서 빌드된 결과물(dist 폴더)을 복사합니다.
COPY --from=builder /usr/src/app/dist ./dist

# 애플리케이션이 3000번 포트를 사용함을 명시합니다.
EXPOSE 3000

# 컨테이너가 시작될 때 실행할 명령어를 정의합니다. (빌드된 JS 파일 실행)
CMD [ "node", "dist/main" ]