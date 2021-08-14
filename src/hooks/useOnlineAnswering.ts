import * as React from 'react'
import { useEffect } from 'react'
import SpeechRecognition, {
    useSpeechRecognition
} from 'react-speech-recognition'
import useSound from 'use-sound'
import { useReactMediaRecorder } from "react-media-recorder";
import useCountDown from 'react-countdown-hook';

export interface opts {
    audio: {
        buzzin: string
        buzzout: string
    }
    timeout: number
    isReady: boolean
    onAudioData: (data: Array<number>, ...params: Array<any>) => void
    onBuzzin: (...params: Array<any>) => void
    onComplete: (answer: string, audioBlob: Blob, ...params: Array<any>) => void
}

const useOnlineAnswering = (options: opts) => {
    const [answer, setAnswer] = React.useState<Array<string>>([])
    const [listening, setListening] = React.useState<boolean>(false)
    const [audioBlob, setAudioBlob] = React.useState<Blob>();
    const [playBuzzin] = useSound(options.audio.buzzin)
    const [playBuzzout] = useSound(options.audio.buzzout)
    const [timeLeft, { start, reset }] = useCountDown(options.timeout, 100);

    const {
        status,
        startRecording,
        stopRecording,
    } = useReactMediaRecorder({
        audio: true,
        onStop: ((_: string, blob: Blob) => {
            setAudioBlob(blob)
        })
    });


    SpeechRecognition.startListening()

    const complete = () => {
        if ([...answer, recognizer.finalTranscript].length > 0 && audioBlob) {
            playBuzzout()
            setListening(false)
            options.onComplete(
                [...answer, recognizer.finalTranscript]
                    .join(' ')
                    .toLowerCase()
                    .replace("go".toLowerCase(), '')
                    .replace(/[^\w\s]|_/g, ''),
                audioBlob
            )
        }
    }


    const commands = [
        {
            command: "go",
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
            }
        }
    }, [timeLeft])

    useEffect(() => {
        complete()
    }, [audioBlob])


    return [answer, listening, SpeechRecognition.browserSupportsSpeechRecognition, status, timeLeft]
}

export default useOnlineAnswering;
