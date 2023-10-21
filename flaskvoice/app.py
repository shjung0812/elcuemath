from flask import Flask, request, send_file
from gtts import gTTS
import os

app = Flask(__name__)

# 음성 파일을 저장할 디렉토리 경로
output_dir = "output"

# 음성 파일을 생성하는 함수
def create_audio(text, lang='ko'):
    tts = gTTS(text, lang=lang)
    output_path = os.path.join(output_dir, "output.mp3")
    tts.save(output_path)
    return output_path

@app.route('/generate_audio', methods=['POST'])
def generate_audio():
    data = request.get_json()
    text = data.get('text')
    lang = data.get('lang', 'ko')

    if text:
        output_path = create_audio(text, lang)
        return send_file(output_path, as_attachment=True)
    else:
        return "텍스트를 제공해야 합니다.", 400

if __name__ == '__main__':
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    app.run(debug=True)
