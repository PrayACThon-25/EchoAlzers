import { useState, useRef, useEffect } from 'react';
import AppointmentBooking from '../components/AppointmentBooking';

const VideoConsult = () => {
  const [showAppointment, setShowAppointment] = useState(true);
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

  const handleAppointmentComplete = () => {
    setShowAppointment(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Video container */}
      <div className="w-full h-screen">
        <div className="bg-gray-900 w-full h-full" ref={jitsiRef} />
      </div>

      {/* Overlay */}
      {showAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Book Video Consultation
              </h1>
              <AppointmentBooking onComplete={handleAppointmentComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsult;
