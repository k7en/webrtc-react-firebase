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

  async offer() {
    const sessionDescription = await this.createOffer();
    await this.setLocalDesription(sessionDescription);
    await this.sendOffer();
  }
  async createOffer() {
    try {
      return await this.rtcPeerConnection.createOffer();
    } catch (e) {
      console.error(e);
    }
  }
  async setLocalDesription(sessionDescription) {
    try {
      await this.rtcPeerConnection.setLocalDescription(sessionDescription);
    } catch (e) {
      console.error(e);
    }
  }

  async sendOffer() {
    this.FirebaseSignalingClient.setPeerNames(
      this.localPeerName,
      this.remotePeerName
    );
    await this.FirebaseSignalingClient.sendOffer(this.localDescription);
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

  async answer(sender, sessionDescription) {
    try {
      this.remotePeerName = sender;
      this.setOnicecandidateCallback();
      this.setOntrack();
      await this.setRemoteDescription(sessionDescription);
      const answer = await this.rtcPeerConnection.createAnswer();
      this.rtcPeerConnection.setLocalDescription(answer);
      await this.sendAnswer();
    } catch (e) {
      console.error(e);
    }
  }

  async connect(remotePeerName) {
    console.log({ remotePeerName });
    this.remotePeerName = remotePeerName;
    this.setOnicecandidateCallback();
    this.setOntrack();
    await this.offer();
    this.setRtcClient();
  }

  async setRemoteDescription(sessionDescription) {
    await this.rtcPeerConnection.setRemoteDescription(sessionDescription);
  }

  async sendAnswer() {
    this.FirebaseSignalingClient.setPeerNames(
      this.localPeerName,
      this.remotePeerName
    );

    await this.FirebaseSignalingClient.sendAnswer(this.localDescription);
  }

  get localDescription() {
    return this.rtcPeerConnection.localDescription.toJSON();
  }
  setOnicecandidateCallback() {
    this.rtcPeerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        // TODO: remoteへcandidateを通知する。
      }
    };
  }

  async saveReceivedSessionDescription(sessionDescription) {
    try {
      await this.setRemoteDescription(sessionDescription);
    } catch (e) {
      console.error(e);
    }
  }
  async startListening(localPeerName) {
    this.localPeerName = localPeerName;
    this.setRtcClient();
    await this.FirebaseSignalingClient.remove(localPeerName);
    // ここでシグナリングサーバーをListenする。https://firebase.google.com/docs/database/web/read-and-write?hl=ja#web_value_events
    this.FirebaseSignalingClient.database
      .ref(localPeerName)
      .on("value", async (snapshot) => {
        const data = snapshot.val();
        console.log({ data });
        if (data === null) {
          return;
        }
        const { sender, sessionDescription, type } = data;
        switch (type) {
          case "offer":
            await this.answer(sender, sessionDescription);
            break;
          case "answer":
            await this.saveReceivedSessionDescription(sessionDescription);
            break;
          default:
            break;
        }
      });
  }
}
