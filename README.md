# online-answering

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/online-answering.svg)](https://www.npmjs.com/package/online-answering) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save online-answering
```

## Usage

```tsx
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
```

## License

MIT © [Mshivam2409](https://github.com/Mshivam2409)
