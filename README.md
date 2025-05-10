# ElcueMath# elcuemath

Elcue Math First Test

배포방식


코드변경사항은 github에 올려서 내려 받는 방식으로 동기화 됨. 

정적파일 동기화: 서버에서 로컬로 동기화 해야함. 
1. spam
2. public/prismpics
3. public/usernote
4. public/jscontent


log 폴더는 필요함. 
- webrtc 통신할때 통신 상황을 보여주는 데이터 가 있음. 




.my.cnf 파일 생성: 스크립트를 실행하는 사용자 계정의 홈 디렉토리 (/home/$USER_ID/)로 이동하여 .my.cnf 파일을 생성합니다.
cd /home/$USER_ID/
touch .my.cnf


.my.cnf 파일 권한 설정
chmod 600 .my.cnf

만약 db 계정과  ubuntu 계정의 이름이 다르다면 .my.cnf를 ubuntu계정으로 실행시키기 위해 아래 명령어로 실행해야 함

su - morgan -c "/home/shjung/web/elcuemath/scripts/backup_script.sh"


.my.cnf 파일 내용
# /home/shjung/.my.cnf
[client]
user=shjung
password="@soojunglove@"

[mysqldump] # mysqldump 명령에만 적용
user=shjung
password="@soojunglove@"

