import React from 'react'

import { useOnlineAnswering } from 'online-answering'
import { useState } from 'react'

const App = () => {
  const [ready, setReady] = useState(false)
  useOnlineAnswering({
    keywords: { buzzin: 'Listen', buzzout: 'Submit' },
    audio: {
      buzzin:
        'https://assets.mixkit.co/sfx/download/mixkit-game-show-wrong-answer-buzz-950.wav',
      buzzout:
        'https://assets.mixkit.co/sfx/download/mixkit-game-show-wrong-answer-buzz-950.wav'
    },
    timeout: 10000,
    isReady: ready,
    onComplete: async (answer) => window.alert(answer)
  })

  return (
    <div>
      <button onClick={() => setReady(true)}>START</button>
      <button onClick={() => setReady(false)}>STOP</button>
    </div>
  )
}

export default App
