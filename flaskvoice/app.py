
# -*- coding: utf-8 -*-
from flask import Flask, request, send_from_directory,render_template
from gtts import gTTS
from flask_cors import CORS  # CORS 라이브러리 추가

import os
app = Flask(__name__)
CORS(app)  # CORS 미들웨어를 애플리케이션에 추가

# 음성 파일을 저장할 디렉토리 경로
output_dir = "static/output"
app.static_folder = 'static'

# 음성 파일을 생성하는 함수
def create_audio(text,index, lang='ko'):
    tts = gTTS(text, lang=lang)
    # output_path = output_dir+ "/output_"+index+".mp3"
    output_path = f"{output_dir}/output_{index}.mp3"

    # output_path = os.path.join(output_dir, "output.mp3")
    tts.save(output_path)
    return output_path

@app.route('/kk')
def kkt():
    # print('voicetesthi')
    return 'hihi'

@app.route('/content/voicetest')
def voicetest():
    print('voicetesthi')

    return render_template('voicetest/voicetest.html')
@app.route('/')
def hello():
    return 'Hello, Worl22d!'

@app.route('/generate_audio2', methods=['POST'])
def test():
    print('tessttt')
@app.route('/generate_audio', methods=['POST'])
def generate_audio():
    print('here dddddddddddddddddddddddddddddddddddpost')
    data = request.get_json()
    text = data['text']
    print(text)
    output_path = create_audio(text,data['index'], lang='ko')  # 'ko'는 한국어 언어 코드
    # tts.save(output_dir+'/output.mp3')  # 음성 파일을 저장

    # return send_from_directory(output_dir, 'output.mp3')
    return {'result':'success','filepath':output_path}

if __name__ == '__main__':
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    app.run(host='0.0.0.0',port='3000')