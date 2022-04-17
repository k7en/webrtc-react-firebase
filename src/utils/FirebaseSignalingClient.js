import firebase from "firebase/app";

// import "firebase/auth"
import "firebase/database";

export default class FirebaseSignalingClient {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyDtq2L_tH6hmYDgzGnyRAWfo3hK_s9xnPk",
      authDomain: "webrtc-react-firebase-ken.firebaseapp.com",
      databaseURL:
        "https://webrtc-react-firebase-ken-default-rtdb.firebaseio.com",
      projectId: "webrtc-react-firebase-ken",
      storageBucket: "webrtc-react-firebase-ken.appspot.com",
      messagingSenderId: "720405174765",
      appId: "1:720405174765:web:1185b321ffe30457932fe4",
    };
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    this.database = firebase.database();
    this.localPeerName = "";
    this.remotePeerName = "";
  }

  get taragetRef() {
    return this.database.ref(this.remotePeerName);
  }

  async sendOffer(sessionDescription) {
    await this.taragetRef.set({
      type: "offer",
      sender: this.localPeerName,
      sessionDescription,
    });
  }

  setPeerNames(localPeerName, remotePeerName) {
    this.localPeerName = localPeerName;
    this.remotePeerName = remotePeerName;
  }

  async sendAnswer(sessionDescription) {
    await this.taragetRef.set({
      type: "answer",
      sender: this.localPeerName,
      sessionDescription,
    });
  }
}
