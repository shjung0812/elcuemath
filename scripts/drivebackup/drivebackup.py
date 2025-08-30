import os
import datetime
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# ==================== 설정 값 (수정 필요) ====================
CREDENTIALS_FILE = '/home/morgan/web/elcuemath/scripts/drivebackup/credentials.json'
# 동기화할 서버 내 로컬 폴더 경로
LOCAL_FOLDER_PATH = '/home/morgan/web/backup'
# Google Drive의 대상 폴더 ID
FOLDER_ID = '19HlJHhQt15IRrcrzj1z92_i859nTQcFx'
# 동기화할 최신 파일의 개수 (예: 5개)
NUM_FILES_TO_SYNC = 2
# ==========================================================

def get_local_files_info(local_path):
    """로컬 폴더의 파일 목록을 수정 시간 순으로 정렬하여 반환합니다."""
    files_info = []
    for filename in os.listdir(local_path):
        filepath = os.path.join(local_path, filename)
        if os.path.isfile(filepath):
            mod_time = os.path.getmtime(filepath)
            files_info.append({'name': filename, 'path': filepath, 'mod_time': mod_time})
            
    # 수정 시간을 기준으로 내림차순 정렬 (가장 최근 파일이 맨 위로)
    files_info.sort(key=lambda x: x['mod_time'], reverse=True)
    return files_info

def get_drive_files_info(service, drive_folder_id):
    """Google Drive 폴더의 파일 목록과 수정 시간을 반환합니다."""
    files = {}
    query = f"'{drive_folder_id}' in parents and trashed=false"
    results = service.files().list(q=query, fields="files(id, name, modifiedTime)").execute()
    for item in results.get('files', []):
        mod_time = datetime.datetime.fromisoformat(item['modifiedTime'].replace('Z', '+00:00')).timestamp()
        files[item['name']] = {'id': item['id'], 'modifiedTime': mod_time}
    return files

def main():
    creds = None
    token_file = 'token.json'

    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            print("인증이 필요합니다. 아래 URL을 복사하여 웹 브라우저에 붙여넣으세요.")
            print("권한을 부여한 후, 받은 인증 코드를 여기에 입력하세요.")
            
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE, 
                scopes=['https://www.googleapis.com/auth/drive']
            )
            
            creds = flow.run_local_server(port=3005, open_browser=False)
        
        with open(token_file, 'w') as token:
            token.write(creds.to_json())
    
    try:
        service = build('drive', 'v3', credentials=creds)

        local_files_sorted = get_local_files_info(LOCAL_FOLDER_PATH)
        
        # 동기화할 파일 목록을 최신 N개로 제한
        files_to_sync = {file['name'] for file in local_files_sorted[:NUM_FILES_TO_SYNC]}
        
        drive_files = get_drive_files_info(service, FOLDER_ID)
        
        # 1. Google Drive에서 삭제할 파일 확인 (동기화 대상이 아닌 파일)
        for filename, file_info in drive_files.items():
            if filename not in files_to_sync:
                print(f"🗑️ Drive에서 '{filename}' 파일을 삭제합니다. (최신 {NUM_FILES_TO_SYNC}개에 포함되지 않음)")
                service.files().delete(fileId=file_info['id']).execute()

        # 2. Google Drive에 업로드/업데이트할 파일 확인 (최신 N개 중 Drive에 없거나 수정된 파일)
        for file in local_files_sorted[:NUM_FILES_TO_SYNC]:
            filename = file['name']
            filepath = file['path']
            mod_time = file['mod_time']
            
            if filename not in drive_files or mod_time > drive_files[filename]['modifiedTime']:
                file_metadata = {
                    'name': filename,
                    'parents': [FOLDER_ID]
                }
                
                media = MediaFileUpload(filepath, resumable=True)
                
                if filename in drive_files:
                    print(f"🔄 '{filename}' 파일을 업데이트합니다.")
                    service.files().update(
                        fileId=drive_files[filename]['id'],
                        media_body=media
                    ).execute()
                else:
                    print(f"⬆️ '{filename}' 파일을 새로 업로드합니다.")
                    service.files().create(
                        body=file_metadata,
                        media_body=media
                    ).execute()

        print("✅ 동기화 완료.")

    except Exception as e:
        print(f"❌ 오류가 발생했습니다: {e}")
        print("설정 값을 다시 확인해 주세요.")

if __name__ == '__main__':
    main()