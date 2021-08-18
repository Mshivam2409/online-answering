import React from 'react';
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
        function playListener(_) {
            this.textTracks[0].mode = "hidden";
            this.textTracks[0].addEventListener("cuechange", function (e: any) {
                if (e.currentTarget && e.currentTarget.activeCues && e.currentTarget.activeCues[0] && e.currentTarget.activeCues[0].text) {
                    options.onCue(e.currentTarget.activeCues[0].text);
                }
            });
        }

        function timeUpdateListener(_) {
            if (!video.seeking) {
                supposedCurrentTime = video.currentTime;
            }
        }

        function seekingListener (_) {
            // guard agains infinite recursion:
            // user seeks, seeking is fired, currentTime is modified, seeking is fired, current time is modified, ....
            var delta = video.currentTime - supposedCurrentTime;
            if (Math.abs(delta) > 0.01) {
                console.log("Seeking is disabled");
                video.currentTime = supposedCurrentTime;
            }
        }

        function endedListener (_) {
            // reset state in order to allow for rewind
            supposedCurrentTime = 0;
        }

        if (Hls.isSupported()) {
            var video = document.getElementById(options.mediaId) as HTMLVideoElement;
            video.controls = false;
            hls.attachMedia(video);

            video.addEventListener('play', playListener);

            video.addEventListener('timeupdate', timeUpdateListener);
            // prevent user from seeking
            video.addEventListener('seeking', seekingListener);
            // delete the following event handler if rewind is not required
            video.addEventListener('ended', endedListener);

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
                video.removeEventListener('seeking', seekingListener);
                video.removeEventListener('ended', endedListener);
            }
        }
    }, [options.recording_id]);

    return [Hls]
}

export default useQuestion;

