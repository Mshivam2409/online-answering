import React, { useCallback } from 'react';
import Hls from "hls.js";

export interface opts {
    backend_url: string
    recording_id: string
    token: string
    mediaId: string
    header: string
    onCue: (cue: string) => void
    useCredentials?: boolean
}

const useQuestion = (options: opts) => {

    var supposedCurrentTime = 0;


    const hls = new Hls({
        xhrSetup: function (xhr, _) {
            xhr.withCredentials = options.useCredentials || false
            xhr.setRequestHeader(options.header, options.token)
        },
    });



    React.useEffect(() => {
        if (Hls.isSupported()) {
            var video = document.getElementById(options.mediaId) as HTMLVideoElement;
            video.controls = false;
            hls.attachMedia(video);

            const playListener = useCallback((e: any) => {
                e.currentTarget.textTracks[0].mode = "hidden";
                e.currentTarget.textTracks[0].addEventListener("cuechange", function (e: any) {
                    if (e.currentTarget && e.currentTarget.activeCues && e.currentTarget.activeCues[0] && e.currentTarget.activeCues[0].text) {
                        options.onCue(e.currentTarget.activeCues[0].text);
                    }
                });
            }, [])

            const timeUpdateListener = useCallback((e: any) => {
                if (!e.currentTarget.seeking) {
                    supposedCurrentTime = video.currentTime;
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

            video.addEventListener('play', playListener);
            video.addEventListener('timeupdate', timeUpdateListener);
            video.addEventListener('seeking', seekListener);
            video.addEventListener('ended', endListener);

            hls.on(Hls.Events.MEDIA_ATTACHED, function (_) {
                console.log("video and hls.js are now bound together !");
                hls.loadSource(`${options.backend_url}/${options.recording_id}/index.m3u8`);
                hls.on(Hls.Events.MANIFEST_PARSED, function (_, data) {
                    console.log(
                        "manifest loaded, found " + data.levels.length + " quality level"
                    );
                    video.textTracks[0].mode = "hidden";
                });
            });

            return () => {
                video.removeEventListener('play', playListener);
                video.removeEventListener('timeupdate', timeUpdateListener);
                video.removeEventListener('seeking', seekListener);
                video.removeEventListener('ended', endListener);
                hls.detachMedia()
            }
        }

        return () => {
            hls.detachMedia()
        }
    }, [options.recording_id]);

    return [Hls]
}

export default useQuestion;

