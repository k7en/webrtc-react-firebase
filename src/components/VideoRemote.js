import React from "react";
import Video from "./Video";

const VideoRemote = ({ rtcClient }) => {
  // TODO: videoRefをリモートから受け取る　rtcClientに持たせる。
  const videoRef = rtcClient.remoteVideoRef;
  return (
    <Video
      isLocal={false}
      name={rtcClient.remotePeerName}
      videoRef={videoRef}
    />
  );
};

export default VideoRemote;
