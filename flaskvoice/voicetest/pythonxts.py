import pyttsx3

engine = pyttsx3.init()

engine.setProperty('rate', 200)

engine.say('무궁화 꽃이 피었습니다')

engine.runAndWait()