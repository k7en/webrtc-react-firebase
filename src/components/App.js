import React, { useState } from "react";
import RtcClient from "../utils/RtcClient";
import InputFormLocal from "./InputFormLocal";
import InputFormRemote from "./InputFormRemote";
import VideoArea from "./VideoArea";

// const getMedia = async () => {
//   const constraints = { audio: true, video: true };
//   try {
//     return await navigator.mediaDevices.getUserMedia(constraints);
//     /* ストリームを使用 */
//   } catch (err) {
//     /* エラーを処理 */
//     console.log(err);
//   }
// };

// getMedia();

const App = () => {
  const rtcClient = new RtcClient();
  console.log({ rtcClient });

  return (
    <>
      <InputFormLocal rtcClient={rtcClient} />
      <InputFormRemote rtcClient={rtcClient} />
      <VideoArea rtcClient={rtcClient} />
    </>
  );
};

export default App;
