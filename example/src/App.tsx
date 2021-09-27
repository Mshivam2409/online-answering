import React from 'react'

import { useQuestion } from 'online-answering'
import { useState } from 'react'
// import { useState } from 'react'

const App = () => {
  const [rid, setRid] = useState<string>('66f044a0-6d8e-4462-b13f-382a50dff63e')
  useQuestion({
    onCue: (cue) => {
      var div = document.getElementById('disp')
      if (div) div.innerHTML = div.innerHTML + '  \n' + cue
    },
    backend_url: 'http://localhost:7000/get',
    recording_id: rid,
    token: '1TGUcC04a8ro6_obh6DKB',
    mediaId: 'hls',
    header: 'x-gostreamer-token',
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
      <button
        onClick={() => {
          var video = document.getElementById('hls') as HTMLVideoElement
          video.pause()
        }}
      >
        PAUSE
      </button>
      <button
        onClick={() => {
          setRid('8d8844dd-edf8-48b4-b460-95fc4fd6776e')
        }}
      >
        CHANGE
      </button>
      <div id='disp'></div>
    </div>
  )
}

export default App
