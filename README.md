# oversize_project

## Functions

### 로그인

 ![1](https://user-images.githubusercontent.com/29852523/29557820-3e435814-8765-11e7-8165-8a9293ce83ee.jpg)
![2](https://user-images.githubusercontent.com/29852523/29557990-bd49ed44-8765-11e7-8990-646252287756.jpg)

 위 그림은 로그인 동작을 보여줍니다. 사용자는 로그인을 할 때 자신의 계정 권한을 선택할 수 있습니다. 
 계정 권한은 관리자, 구매자, 판매자가 있으며 입력 받은 아이디와 비밀 번호의 해당하는 계정 권한을 확인하여 
 일치하면 로그인에 성공하고 일치하지 않으면 다시 로그인을 하게 됩니다.



### 리스트

![3](https://user-images.githubusercontent.com/29852523/29558067-fe546832-8765-11e7-8d30-3f18ae9b3130.jpg)
![4](https://user-images.githubusercontent.com/29852523/29558073-ffbde1c6-8765-11e7-8738-c61ef0655f70.jpg)
![5](https://user-images.githubusercontent.com/29852523/29558075-010dba9c-8766-11e7-8941-dd7cbf1b6e2a.jpg)
![6](https://user-images.githubusercontent.com/29852523/29558077-02387a9c-8766-11e7-99f6-41f4f8ef4e29.jpg)
![7](https://user-images.githubusercontent.com/29852523/29558079-0424de40-8766-11e7-8df3-7b5f283bcbc3.jpg)
![8](https://user-images.githubusercontent.com/29852523/29558081-04e6782a-8766-11e7-8272-d86f91f95b62.jpg)

 위 그림은 게시판의 동작을 보여줍니다. 게시판은 Q&A, 공지사항이 있습니다. 
 Q&A 게시판의 경우 모든 계정이 글을 게시, 삭제와 수정을 할 수 있지만 공지사항의 경우 관리자를 제외한 사용자는 
 게시글을 읽는 동작 외에는 하지 못하게 됩니다. 게시글은 게시판 column 가장 위에 존재하는 버튼을 통해 오름차순 정렬하여결과를 출력할 수 있습니다.



### 구매

![9](https://user-images.githubusercontent.com/29852523/29558113-2542eb62-8766-11e7-95ce-030d7eaf5f86.jpg)
![10](https://user-images.githubusercontent.com/29852523/29558114-254ef042-8766-11e7-874c-f7bc31f1c3ee.jpg)

 위 그림은 상품 구매 화면입니다. 상품을 위한 item database가 존재하는데 item db의 여러 정보를 select해 주문 관리를 할 수 있는 database인
 order_board database에 삽입 함으로써 처리 했습니다. 상품에는 재고라는 column이 있으므로, 
 상품을 구매하게 되면 구매된 item의 재고값이 –1씩 줄어듭니다.

### 장바구니

![11](https://user-images.githubusercontent.com/29852523/29558156-3dda8d2e-8766-11e7-8dfa-67d3d46161af.jpg)
![12](https://user-images.githubusercontent.com/29852523/29558157-3debc4e0-8766-11e7-9c8b-a2ed9501fcb7.jpg)
![13](https://user-images.githubusercontent.com/29852523/29558158-3e087978-8766-11e7-925b-b59fdb6abe12.jpg)

 장바구니 기능은 사용자가 구매하기 위해 저장해 놓은 상품들의 목록을 보여줍니다. 모든 유저들의 장바구니 상품이 등록되어 있는 데이터베이스 테이블에서
 사용자의 id를 통해 현재 사용자의 장바구니 목록을 보여주게 됩니다. 장바구니의 담겨 있는 상품을 구매 버튼을 통해 구매할 수 있으며 삭제 버튼을 통해
 해당 상품을 장바구니 데이터베이스에서 삭제할 수 있습니다.



### 관리

![15](https://user-images.githubusercontent.com/29852523/29558182-5097e042-8766-11e7-8f59-896da1bc3110.jpg)
![14](https://user-images.githubusercontent.com/29852523/29558181-5096a77c-8766-11e7-94f7-b3a246961f5d.jpg)

 댓글은 게시글의 번호를 이용하여 관리됩니다. 사용자가 게시글에 댓글을 남기게 되면 해당 댓글은 댓글들의 저장들을 모아놓은 데이터베이스에 저장됩니다.
 댓글을 read하는 동작은 댓글 데이터베이스에서 해당 게시글 번호를 가지는 댓글들을 출력해줍니다.

