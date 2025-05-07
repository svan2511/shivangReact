import React, { useState, useRef, useEffect } from 'react';
import 'webrtc-adapter'; // WebRTC polyfill for browser compatibility
import './VideoRecorder.css';

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [stream, setStream] = useState(null);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Check permissions and enumerate audio devices
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const micPermission = await navigator.permissions.query({ name: 'microphone' });
        const camPermission = await navigator.permissions.query({ name: 'camera' });
        console.log('Microphone permission status:', micPermission.state);
        console.log('Camera permission status:', camPermission.state);
        if (micPermission.state === 'denied' || camPermission.state === 'denied') {
          setErrorMessage('Camera or microphone access is denied. Please allow access in your browser settings.');
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        console.log('Available audio inputs:', audioInputs.map(d => ({ label: d.label, deviceId: d.deviceId })));
        if (audioInputs.length === 0) {
          console.warn('No audio input devices found.');
          setErrorMessage('No microphones detected. Please connect a microphone and refresh the page.');
        }
        setAudioDevices(audioInputs);
        if (audioInputs.length > 0) {
          setSelectedDevice(audioInputs[0].deviceId);
        }
      } catch (error) {
        console.error('Error checking permissions:', error.name, error.message);
        setErrorMessage(`Error checking permissions: ${error.message}`);
      }
    };
    checkPermissions();
  }, []);

  // Initialize camera and microphone
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        console.log('Initializing media with audio deviceId:', selectedDevice);
        // Simplified getUserMedia call
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: selectedDevice ? { deviceId: { exact: selectedDevice } } : true
        });
        console.log('Stream tracks:', stream.getTracks().map(t => ({
          kind: t.kind,
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
          label: t.label
        })));

        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Video element srcObject set');
        }
      } catch (error) {
        console.error('Media device error:', error.name, error.message, error.stack);
        setErrorMessage(`Error accessing camera or microphone: ${error.message}`);
      }
    };

    if (selectedDevice) {
      initializeCamera();
    }

    return () => {
      if (stream) {
        console.log('Stopping stream tracks');
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDevice]);

  // Handle microphone selection
  const handleDeviceChange = (event) => {
    console.log('Selected microphone device:', event.target.value);
    setSelectedDevice(event.target.value);
  };

  // Start video recording
  const startRecording = () => {
    if (!stream) {
      console.error('No stream available for recording');
      setErrorMessage('Cannot start recording: No media stream available.');
      return;
    }

    console.log('Starting recording with stream tracks:', stream.getTracks());
    chunksRef.current = [];
    const options = {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm',
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000
    };
    console.log('MediaRecorder options:', options);

    try {
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Received chunk of size:', event.data.size);
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Recording stopped, creating blob');
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        console.log('Blob size:', blob.size);
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo(videoURL);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error.name, event.error.message);
        setErrorMessage(`Recording error: ${event.error.message}`);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      console.log('MediaRecorder started');
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting MediaRecorder:', error.name, error.message);
      setErrorMessage(`Error starting recording: ${error.message}`);
    }
  };

  // Stop video recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping MediaRecorder');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Download recorded video
  const downloadVideo = () => {
    if (recordedVideo) {
      console.log('Downloading video:', recordedVideo);
      const a = document.createElement('a');
      a.href = recordedVideo;
      a.download = `recorded-video-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Reset recording state
  const resetRecording = () => {
    console.log('Resetting recording');
    setRecordedVideo(null);
    chunksRef.current = [];
    setErrorMessage('');
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

      {errorMessage && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
          {errorMessage}
        </div>
      )}

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

      <div className="controls">
        {!isRecording && !recordedVideo && (
          <button
            onClick={startRecording}
            className="record-button"
            disabled={!stream}
          >
            Start Recording
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