import FirebaseSignalingClient from "./FirebaseSignalingClient";

export default class RtcClient {
  constructor(setRtcClient) {
    const config = {
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    };
    this.rtcPeerConnection = new RTCPeerConnection(config);
    this.FirebaseSignalingClient = new FirebaseSignalingClient();
    this.localPeerName = "";
    this.remotePeerName = "";
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
