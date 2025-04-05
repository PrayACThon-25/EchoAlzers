import { useEffect, useRef } from 'react';

const VideoCall = () => {
    const jitsiContainer = useRef(null);

    useEffect(() => {
        const domain = 'meet.jit.si';
        const options = {
            roomName: 'healthConsultation' + Date.now(),
            width: '100%',
            height: '100%',
            parentNode: jitsiContainer.current,
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop',
                    'fullscreen', 'fodeviceselection', 'hangup', 'chat',
                ],
            }
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        return () => {
            api.dispose();
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <div ref={jitsiContainer} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default VideoCall;
