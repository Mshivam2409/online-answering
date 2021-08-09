import * as React from 'react'
import { useEffect } from 'react'
import SpeechRecognition, {
    useSpeechRecognition
} from 'react-speech-recognition'
import useSound from 'use-sound'
import { useReactMediaRecorder } from "react-media-recorder";
import useCountDown from 'react-countdown-hook';



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
    onAudioData: (data: Array<number>, ...params: Array<any>) => void
    onBuzzin: (...params: Array<any>) => void
    onComplete: (answer: string, ...params: Array<any>) => void
}

export const useOnlineAnswering = (options: opts) => {
    const [answer, setAnswer] = React.useState<Array<string>>([])
    const [listening, setListening] = React.useState<boolean>(false)
    const [playBuzzin] = useSound(options.audio.buzzin)
    const [playBuzzout] = useSound(options.audio.buzzout)
    const [timeLeft, { start, reset }] = useCountDown(10000, 100);

    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
    } = useReactMediaRecorder({
        audio: true,
        onStop: (blobUrl) => {
            console.log(answer, blobUrl)
        }
    });


    SpeechRecognition.startListening()

    const complete = () => {

        SpeechRecognition.stopListening()
        playBuzzout()
        setListening(false)
        console.log(answer)
        options.onComplete(
            [...answer, recognizer.finalTranscript]
                .join(' ')
                .toLowerCase()
                .replace(options.keywords.buzzin.toLowerCase(), '')
                .replace(/[^\w\s]|_/g, '')

        )
    }


    const commands = [
        {
            command: options.keywords.buzzin,
            callback: () => {
                if (options.isReady) {
                    reset()
                    start()
                    console.log('Buzzed In')
                    options.onBuzzin()
                    startRecording()
                    console.log(status)
                    setAnswer([])
                    playBuzzin()
                    setListening(true)
                }

            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.2,
            bestMatchOnly: true
        },
    ]

    const recognizer = useSpeechRecognition({ commands })

    useEffect(() => {
        if (listening && options.isReady && recognizer.finalTranscript) {
            setAnswer([...answer, recognizer.finalTranscript])
        }
    }, [listening, recognizer.finalTranscript])

    useEffect(() => {
        if (timeLeft === 100) {
            if (listening) {
                stopRecording()
                complete()
            }
        }
    }, [timeLeft])

    if (1000000 === timeLeft)
        console.log(answer, listening, SpeechRecognition.browserSupportsSpeechRecognition, status, mediaBlobUrl, timeLeft)
    return [mediaBlobUrl]
}
