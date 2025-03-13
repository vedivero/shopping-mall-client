# 쇼핑몰 프로젝트 

* 웹 페이지 링크 🖥
  - https://mens-closet.netlify.app/
* 관리자 계정 정보

  |account|password|
  |-------|--------|
  |admin@eamil.com|123|

<br>

## 프로젝트 목표 🎯

사용자가 상품을 검색하고, 장바구니를 이용해 편리하게 주문할 수 있는 **쇼핑몰 웹사이트** 구축

### 주요 기능:
- **사용자 회원가입 및 로그인** (이메일, 비밀번호, 구글 계정 로그인 지원)
- **상품 목록 및 상세 페이지 제공**
- **장바구니 기능** (상품 추가, 수량 변경, 삭제)
- **주문 기능** (배송지 및 결제 정보 입력)
- **관리자 기능** (상품 및 주문 관리)

<br>

## User Story 📖

### 유저
* 사용자는 랜딩페이지에서 상품을 볼 수 있다.
* 사용자는 상품 디테일 페이지를 볼 수 있다.
* 사용자는 상품을 이름으로 검색할 수 있다.
  
* 사용자는 회원가입을 할 수 있다.
* 사용자는 이메일과 비밀번호로 로그인을 할 수 있다.
* 사용자는 구글로 로그인을 할 수 있다.

### 상품
* 관리자는 상품을 등록할 수 있다.
* 관리자는 상품을 수정, 삭제할 수 있다. 
* 관리자는 관리자 페이지에서 상품리스트를 볼 수 있다.


### 카트
* 사용자는 사이즈를 선택 후 카트에 아이템을 담을 수 있다.
* 사용자는 카트페이지에서 담은 아이템 리스트를 볼 수 있다.
* 사용자는 카트에 각 아이템의 구매 개수를 수정할 수 있다.
* 사용자는 카트 아이템을 삭제할 수 있다.
* 사용자는 카트에 담긴 상품들의 총 가격을 볼 수 있다.

### 주문
#### 사용자
* 사용자는 상품주문시 연락처, 주소, 카드정보를 입력한다.
* 사용자는 주문하려는 상품들의 총 가격을 볼 수 있다.
* 사용자는 주문 완료후 주문 완료 페이지를 볼 수 있다.
* 사용자는 주문페이지에서 주문 내역을 볼 수 있다.

#### 관리자
* 관리자는 관리자 페이지에서 모든 유저의 주문 내역을 볼 수 있다.
* 관리자는 주문 디테일을 볼 수 있다.
* 관리자는 주문의 상태를 (준비중, 배송중, 완료, 환불) 수정할 수 있다.
* 관리자는 주문번호로 주문을 검색할 수 있다.

<br>

## 사용된 기술🏛
### FE
* React
* Redux-thunk
* Redux Toolkit

### Devops
* Netlify 
