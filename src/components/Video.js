import React from "react";

const Video = ({ isLocal, name, videoRef }) => {
  return (
    <div>
      <video autoPlay muted={isLocal} ref={videoRef} />
      {name}
    </div>
  );
};

export default Video;
