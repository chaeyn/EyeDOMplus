const URL = 'https://teachablemachine.withgoogle.com/models/fa_cTmivb/'

let model, webcam, labelContainer, maxPredictions
let lastPrediction = ''

window.onload = async function init() {
  const modelURL = URL + 'model.json'
  const metadataURL = URL + 'metadata.json'

  document.getElementById('loading').style.display = 'flex'

  model = await tmImage.load(modelURL, metadataURL)
  maxPredictions = model.getTotalClasses()

  const flip = true
  webcam = new tmImage.Webcam(200, 200, flip)
  await webcam.setup()
  await webcam.play()
  window.requestAnimationFrame(loop)

  document.getElementById('webcam-container').appendChild(webcam.canvas)
  labelContainer = document.getElementById('label-container')
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement('div'))
  }

  document.getElementById('loading').style.display = 'none'
}

async function loop() {
  webcam.update()
  await predict()
  setTimeout(() => {
    window.requestAnimationFrame(loop)
  }, 500)
}

async function predict() {
  const prediction = await model.predict(webcam.canvas)
  let message = '사진이 인식되지 않았거나, 정보가 등록되지 않음'

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability.toFixed(2) >= 0.9) {
      if (lastPrediction !== prediction[i].className) {
        lastPrediction = prediction[i].className
        switch (lastPrediction) {
          case '코카콜라':
            message =
              '이름: 코카콜라<br>칼로리: 92kcal<br>종류: 탄산음료<br>맛: 상쾌하고 달콤한 탄산 맛에 은은한 바닐라와 카라멜 향이 어우러진 맛'
            break
          case '레쓰비':
            message =
              '이름: 레쓰비<br>칼로리: 55kcal<br>종류: 커피<br>맛: 부드럽고 고소한 맛에 적당한 산미가 있는 맛'
            break
          case '2%':
            message =
              '이름: 2%<br>칼로리: 65kcal<br>종류: 혼합음료<br>맛: 상큼하고 부드러운 과일 맛이 특징으로, 달콤함과 복숭아 맛이 조화를 이루는 맛'
            break
          case '스프라이트':
            message =
              '이름: 스프라이트<br>칼로리: 112kcal<br>종류: 탄산음료<br>맛: 청량한 레몬맛이 특징으로, 달콤하면서도 깔끔한 목넘김이 매력적인 맛'
            break
        }
        labelContainer.childNodes[0].innerHTML = message
        break
      }
    }
  }
}
