import React, { useState, useRef, useEffect } from 'react';
import './VideoRecorder.css';

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [stream, setStream] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showAudioWarning, setShowAudioWarning] = useState(false);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Check permissions and list audio devices
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        console.log('Microphone permission status:', permissionStatus.state);

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        console.log('Available audio inputs:', audioInputs.map(device => ({
          deviceId: device.deviceId,
          label: device.label,
          groupId: device.groupId
        })));
        setAudioDevices(audioInputs);

        if (audioInputs.length > 0) {
          setSelectedDevice(audioInputs[0].deviceId);
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    };

    checkPermissions();
  }, []);

  // Initialize camera and audio
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        // First get audio stream with specific constraints
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            channelCount: 1,
            sampleRate: 44100,
            latency: 0
          }
        });

        // Get video stream
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });

        // Log audio track details before combining
        const audioTracks = audioStream.getAudioTracks();
        console.log('Audio tracks before combining:', audioTracks.map(track => ({
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          settings: track.getSettings(),
          constraints: track.getConstraints()
        })));

        // Combine streams
        const combinedStream = new MediaStream([
          ...audioStream.getAudioTracks(),
          ...videoStream.getVideoTracks()
        ]);

        // Set up audio analysis
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(audioStream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 1024;
        analyserRef.current.smoothingTimeConstant = 0.3;
        source.connect(analyserRef.current);

        // Log audio track details after combining
        const combinedAudioTracks = combinedStream.getAudioTracks();
        console.log('Audio tracks after combining:', combinedAudioTracks.map(track => ({
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          settings: track.getSettings(),
          constraints: track.getConstraints()
        })));

        setStream(combinedStream);
        if (videoRef.current) {
          videoRef.current.srcObject = combinedStream;
        }

        // Monitor audio levels
        const checkAudioLevel = () => {
          if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average);
            
            if (average > 0) {
              console.log('Audio detected:', {
                level: average,
                maxLevel: Math.max(...dataArray),
                minLevel: Math.min(...dataArray),
                timestamp: new Date().toISOString()
              });
            }
          }
        };
        const audioInterval = setInterval(checkAudioLevel, 100);

        return () => {
          clearInterval(audioInterval);
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }
        };
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Error accessing camera or microphone. Please make sure you have granted the necessary permissions and your microphone is not being used by another application.');
      }
    };

    if (selectedDevice) {
      initializeCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDevice]);

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  const startRecording = () => {
    if (!stream) return;

    // Show warning if no audio is detected
    if (audioLevel === 0) {
      setShowAudioWarning(true);
      const proceed = window.confirm('No audio input detected. Do you want to proceed with recording anyway?');
      if (!proceed) {
        return;
      }
    }

    chunksRef.current = [];

    // Create MediaRecorder with specific options
    const options = {
      mimeType: 'video/webm;codecs=vp8,opus',
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000
    };

    // Log available MIME types
    console.log('Available MIME types:', MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ? 'Supported' : 'Not supported');

    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log('Received chunk of size:', event.data.size);
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: 'video/webm'
      });
      console.log('Recording stopped. Final blob size:', blob.size);
      const videoURL = URL.createObjectURL(blob);
      setRecordedVideo(videoURL);
      setShowAudioWarning(false);
    };

    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      alert('Error during recording. Please try again.');
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = () => {
    if (recordedVideo) {
      const a = document.createElement('a');
      a.href = recordedVideo;
      a.download = `recorded-video-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetRecording = () => {
    setRecordedVideo(null);
    chunksRef.current = [];
  };

  return (
    <div className="video-recorder">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="preview-video"
        />
        {recordedVideo && (
          <video
            src={recordedVideo}
            controls
            className="recorded-video"
          />
        )}
      </div>

      {audioDevices.length > 0 && (
        <div className="device-selector">
          <label htmlFor="audioDevice">Select Microphone:</label>
          <select
            id="audioDevice"
            value={selectedDevice}
            onChange={handleDeviceChange}
            className="device-select"
          >
            {audioDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {showAudioWarning && (
        <div className="audio-warning">
          Warning: No audio input detected. Your recording may not include audio.
        </div>
      )}

      <div className="controls">
        {!isRecording && !recordedVideo && (
          <button
            onClick={startRecording}
            className="record-button"
          >
            Start Recording {audioLevel === 0 && '(No Audio Input)'}
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="stop-button"
          >
            Stop Recording
          </button>
        )}

        {recordedVideo && (
          <>
            <button
              onClick={downloadVideo}
              className="download-button"
            >
              Download Video
            </button>
            <button
              onClick={resetRecording}
              className="reset-button"
            >
              Record Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder; 