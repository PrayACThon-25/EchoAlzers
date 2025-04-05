import { useState, useRef, useEffect } from 'react';

function VideoConsult() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const jitsiRef = useRef();
  const apiRef = useRef();

  useEffect(() => {
    // Initialize Jitsi Meet
    const domain = 'meet.jit.si';
    const options = {
      roomName: 'healSync' + Math.random().toString(36).substring(7),
      width: '100%',
      height: '100%',
      parentNode: jitsiRef.current,
      userInfo: {
        displayName: 'Patient'
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      }
    };

    apiRef.current = new JitsiMeetExternalAPI(domain, options);

    // Add event listeners
    apiRef.current.addListener('videoMuteStatusChanged', ({ muted }) => {
      setIsVideoOff(muted);
    });

    apiRef.current.addListener('audioMuteStatusChanged', ({ muted }) => {
      setIsMuted(muted);
    });

    apiRef.current.addListener('participantJoined', () => {
      setIsConnected(true);
    });

    apiRef.current.addListener('participantLeft', () => {
      setIsConnected(false);
    });

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, []);

  const toggleAudio = () => {
    apiRef.current.executeCommand('toggleAudio');
  };

  const toggleVideo = () => {
    apiRef.current.executeCommand('toggleVideo');
  };

  const endCall = () => {
    apiRef.current.executeCommand('hangup');
    window.history.back();
  };

  return (
    <div className="w-full">
      <div className="bg-gray-900 rounded-xl aspect-video relative overflow-hidden" ref={jitsiRef} />
    </div>
  );
}

export default VideoConsult;
