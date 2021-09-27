import { useCallback, useEffect, useState } from 'react';
import Hls from "hls.js";
import useCountDown from 'react-countdown-hook';

export interface listeners {
    seeking: boolean
}

export interface opts {
    backend_url: string
    recording_id: string
    token: string
    mediaId: string
    header: string
    onCue: (cue: string) => void
    useCredentials?: boolean
    listeners: listeners
    deadlockTimeout: number
    onDeadlock: (...params: Array<any>) => void
}

const useQuestion = (options: opts) => {
    const [deadlockTimeleft, { start: startDeadlockCountdown, reset: resetDeadlockCountdown }] = useCountDown(options.deadlockTimeout, 100);
    const [active, setActive] = useState<boolean>(false)


    var supposedCurrentTime = 0;

    const hls = new Hls({
        xhrSetup: function (xhr, _) {
            xhr.withCredentials = options.useCredentials || false
            xhr.setRequestHeader(options.header, options.token)
        },
    });

    const playListener = useCallback((e: any) => {
        try {
            e.currentTarget.textTracks[0].mode = "showing";
            e.currentTarget.textTracks[0].addEventListener("cuechange", function (e: any) {
                if (e.currentTarget && e.currentTarget.activeCues && e.currentTarget.activeCues[0] && e.currentTarget.activeCues[0].text) {
                    try {
                        options.onCue(e.currentTarget.activeCues[0].text);
                    } catch (_) {

                    }
                }
            });
        } catch (error) {
            console.log(error)
        }

    }, [])



    const timeUpdateListener = useCallback((e: any) => {
        if (!e.currentTarget.seeking) {
            supposedCurrentTime = e.currentTarget.currentTime;
        }
        if (supposedCurrentTime > 0.1) {
            resetDeadlockCountdown()
        }
    }, [])

    const seekListener = useCallback((e: any) => {
        var delta = e.currentTarget.currentTime - supposedCurrentTime;
        if (Math.abs(delta) > 0.01) {
            console.log("Seeking is disabled");
            e.currentTarget.currentTime = supposedCurrentTime;
        }
    }, [])

    const endListener = useCallback(() => {
        supposedCurrentTime = 0;
    }, [])

    useEffect(() => {

        var video = document.getElementById(options.mediaId) as HTMLVideoElement;
        if (video) {
            video.addEventListener('play', playListener);
            video.addEventListener('pause', function (_) {
                try {
                    this.removeEventListener('play', playListener)
                } catch (_) {

                }
                finally {
                    if (active) {
                        video.play()
                    }
                }
            })
            video.addEventListener('ended', function (_) {
                this.removeEventListener('play', playListener)
            })
            if (options.listeners.seeking)
                video.addEventListener('seeking', seekListener)
            video.addEventListener('timeupdate', timeUpdateListener);
            video.addEventListener('ended', endListener);
        }
        return () => {
            if (video) {
                video.removeEventListener('play', playListener);
                video.removeEventListener('seeking', seekListener);
                video.removeEventListener('ended', endListener);
            }
        }
    }, [])



    useEffect(() => {
        var video = document.getElementById(options.mediaId) as HTMLVideoElement;

        if (video && options.recording_id) {
            hls.attachMedia(video);

            hls.on(Hls.Events.MEDIA_ATTACHED, function (_) {
                console.log("video and hls.js are now bound together !");
                hls.loadSource(`${options.backend_url}/${options.recording_id}/index.m3u8`);
                hls.on(Hls.Events.MANIFEST_PARSED, function (_, data) {
                    try {
                        console.log(
                            "manifest loaded, found " + data.levels.length + " quality level"
                        );
                        supposedCurrentTime = 0
                        setActive(true)
                        video.play()
                        console.log("Playing...")
                        startDeadlockCountdown()
                    } catch (error) {
                        console.log(error)
                    }
                });
            });
        }

        return () => {
            hls.detachMedia()
        }
    }, [options.recording_id]);

    useEffect(() => {
        if (deadlockTimeleft == 100) {
            options.onDeadlock()
        }
    }, [deadlockTimeleft])

    return [Hls, setActive, active]
}

export default useQuestion;

