# online-answering

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/online-answering.svg)](https://www.npmjs.com/package/online-answering) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save online-answering
```

## Usage

### UseOnlineAnswering

```tsx
import React from 'react'

import { useOnlineAnswering } from 'online-answering'
import { useState } from 'react'

const App = () => {
  const [ready, setReady] = useState(false)
  useOnlineAnswering({
    audio: {
      buzzin:
        'https://assets.mixkit.co/sfx/download/mixkit-game-show-wrong-answer-buzz-950.wav',
      buzzout:
        'https://assets.mixkit.co/sfx/download/mixkit-game-show-wrong-answer-buzz-950.wav'
    },
    onAudioData: () => {},
    timeout: 7000,
    isReady: ready,
    onComplete: async (answer, blob) => {
      console.log(answer, blob)
    },
    onBuzzin: () => console.log('Buzzin')
  })

  return (
    <div>
      <button onClick={() => setReady(true)}>START</button>
      <button onClick={() => setReady(false)}>STOP</button>
    </div>
  )
}

export default App
```

### UseQuestion

```tsx
const App = () => {
  useQuestion({
    onCue: (cue) => {
      var div = document.getElementById('disp')
      if (div) div.innerHTML = div.innerHTML + '  \n' + cue
    },
    backend_url: 'http://localhost:5000/hls',
    recording_id: '4824d613-3e40-4445-ab14-9086bfa4a7a5',
    token: 'token',
    header: 'header',
    mediaId: 'hls',
    listeners: {
      seeking: false
    }
  })

  return (
    <div>
      <video id='hls' hidden />
      <button
        onClick={() => {
          var video = document.getElementById('hls') as HTMLVideoElement
          video.play()
        }}
      >
        PLAY
      </button>
      <div id='disp'></div>
    </div>
  )
}

export default App
```

## License

MIT © [Mshivam2409](https://github.com/Mshivam2409)
