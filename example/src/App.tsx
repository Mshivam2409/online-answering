import React from 'react'

import { useQuestion } from 'online-answering'
// import { useState } from 'react'

const App = () => {
  useQuestion({
    onCue: (cue) => {
      var div = document.getElementById('disp')
      if (div) div.innerHTML = div.innerHTML + '  \n' + cue
    },
    backend_url: 'http://localhost:5000/hls',
    recording_id: '32fdfe78-a1a4-48b8-a2fc-d82021b6afd2',
    token: '1TGUcC04a8ro6_obh6DKB',
    mediaId: 'hls',
    header: 'x-gostreamer-token'
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
