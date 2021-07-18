import * as React from 'react'
import { useEffect } from 'react'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'
import useSound from 'use-sound'

export interface opts {
  keywords: {
    buzzin: string
    buzzout: string
  }
  audio: {
    buzzin: string
    buzzout: string
  }
  timeout: number
  isReady: boolean
  onComplete: (answer: string, ...params: Array<any>) => Promise<void>
}

export const useOnlineAnswering = (options: opts) => {
  const [answer, setAnswer] = React.useState<Array<string>>([])
  const [listening, setListening] = React.useState<boolean>(false)
  const [playBuzzin] = useSound(options.audio.buzzin)
  const [playBuzzout] = useSound(options.audio.buzzout)

  SpeechRecognition.startListening()

  const complete = async (reason: string) => {
    if (listening) {
      console.log('Buzzed Out due to ', reason)
      setListening(false)
      playBuzzout()
      await options.onComplete(''.concat(...answer))
      setAnswer([])
    }
  }

  const commands = [
    {
      command: options.keywords.buzzin,
      callback: () => {
        if (options.isReady) {
          console.log('Buzzed In')
          setAnswer([])
          playBuzzin()
          setListening(true)
        }
        setTimeout(() => {
          complete('TimeOut')
        }, options.timeout)
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true
    },
    {
      command: options.keywords.buzzout,
      callback: () => {
        complete('BuzzOut')
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true
    }
  ]

  const recognizer = useSpeechRecognition({ commands })

  useEffect(() => {
    if (listening && options.isReady && recognizer.finalTranscript) {
      setAnswer([...answer, recognizer.finalTranscript])
    }
  }, [listening, recognizer.finalTranscript])

  return [answer, listening, SpeechRecognition.browserSupportsSpeechRecognition]
}
