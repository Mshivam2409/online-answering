import React from 'react'

import { Recorder, useOnlineAnswering } from 'online-answering'
import { useState } from 'react'
import { useEffect } from 'react'

const App = () => {
  const [ready, setReady] = useState(false)
  const [url] = useOnlineAnswering({
    keywords: { buzzin: 'Listen', buzzout: 'Submit' },
    audio: {
      buzzin:
        'https://assets.mixkit.co/sfx/download/mixkit-game-show-wrong-answer-buzz-950.wav',
      buzzout:
        'https://assets.mixkit.co/sfx/download/mixkit-game-show-wrong-answer-buzz-950.wav'
    },
    onAudioData: () => {},
    timeout: 5000,
    isReady: ready,
    onComplete: async (answer) => {
      console.log(answer, url)
      setTimeout(() => console.log(url), 1000)
    },
    onBuzzin: () => console.log('Buzzin')
  })

  useEffect(() => {
    // null , blob::http
    console.log(url)
  }, [url])

  return (
    <div>
      <button onClick={() => setReady(true)}>START</button>
      <button onClick={() => setReady(false)}>STOP</button>
      <Recorder />
      <Recorder />
      <audio id='aud' controls src={url as string} />
    </div>
  )
}

export default App
