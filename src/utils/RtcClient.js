import { ThirtyFpsSelect } from "@mui/icons-material";
import FirebaseSignalingClient from "./FirebaseSignalingClient";

export default class RtcClient {
  constructor(remoteVideoRef, setRtcClient) {
    const config = {
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    };
    this.rtcPeerConnection = new RTCPeerConnection(config);
    this.FirebaseSignalingClient = new FirebaseSignalingClient();
    this.localPeerName = "";
    this.remotePeerName = "";
    this.remoteVideoRef = remoteVideoRef;
    this._setRtcClient = setRtcClient;
    this.mediaStream = null;
  }
  setRtcClient() {
    this._setRtcClient(this);
  }

  async getUserMedia() {
    try {
      const constrains = { audio: true, video: true };
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constrains);
    } catch (error) {
      console.log(error);
    }
  }

  async setMediaStream() {
    await this.getUserMedia();
    this.addTracks();
    this.setRtcClient();
  }

  addTracks() {
    this.addAudioTrack();
    this.addVideoTrack();
  }

  addAudioTrack() {
    this.rtcPeerConnection.addTrack(this.audioTrack, this.mediaStream);
  }

  addVideoTrack() {
    this.rtcPeerConnection.addTrack(this.videoTrack, this.mediaStream);
  }

  get audioTrack() {
    return this.mediaStream.getAudioTracks()[0];
  }
  get videoTrack() {
    return this.mediaStream.getVideoTracks()[0];
  }

  connect(remotePeerName) {
    this.remotePeerName = remotePeerName;
    this.setOnicecandidateCallback();
    this.setOntrack();
    this.setRtcClient();
  }

  setOntrack() {
    this.rtcPeerConnection.ontrack = (rtcTrackEvent) => {
      if (rtcTrackEvent.track.kind !== "video") return;
      const remoteMediaStream = rtcTrackEvent.streams[0];
      this.remoteVideoRef.current.srcObject = remoteMediaStream;
      this.setRtcClient();
    };
    this.setRtcClient();
  }
  setOnicecandidateCallback() {
    this.rtcPeerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        // TODO: remoteへcandidateを通知する。
      }
    };
  }
  startListening(localPeerName) {
    this.localPeerName = localPeerName;
    this.setRtcClient();
    // ここでシグナリングサーバーをListenする。https://firebase.google.com/docs/database/web/read-and-write?hl=ja#web_value_events
    this.FirebaseSignalingClient.database
      .ref(localPeerName)
      .on("value", (snapshot) => {
        const data = snapshot.val();
      });
  }
}
