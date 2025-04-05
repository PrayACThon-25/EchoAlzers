import { useState, useRef, useEffect } from 'react';

function VideoConsult() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    // Request camera and microphone permissions
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    startVideo();

    // Cleanup
    return () => {
      const stream = localVideoRef.current?.srcObject;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleAudio = () => {
    const stream = localVideoRef.current?.srcObject;
    stream?.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject;
    stream?.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="section-title mb-0">Video Consultation</h2>
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isConnected ? 'Connected' : 'Waiting for doctor...'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-gray-900 rounded-xl aspect-video relative overflow-hidden">
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
            />
            <div className="absolute bottom-4 right-4 w-48 aspect-video">
              <video
                ref={localVideoRef}
                className="w-full h-full rounded-lg border-2 border-white shadow-lg"
                playsInline
                autoPlay
                muted
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="section-title mb-6">Controls</h3>
          <button
            onClick={toggleAudio}
            className={`btn w-full ${isMuted ? 'bg-red-100 text-red-700' : 'btn-secondary'}`}
          >
            {isMuted ? '🔇 Unmute' : '🎤 Mute'}
          </button>
          <button
            onClick={toggleVideo}
            className={`btn w-full ${isVideoOff ? 'bg-red-100 text-red-700' : 'btn-secondary'}`}
          >
            {isVideoOff ? '📵 Turn On Video' : '📹 Turn Off Video'}
          </button>
          <button
            onClick={() => window.history.back()}
            className="btn w-full bg-red-600 text-white hover:bg-red-700"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoConsult;
