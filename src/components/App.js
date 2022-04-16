import React, { useReducer, useState } from "react";
import RtcClient from "../utils/RtcClient";
import InputFormLocal from "./InputFormLocal";
import InputFormRemote from "./InputFormRemote";
import VideoArea from "./VideoArea";

const App = () => {
  const [rtcClient, _setRtcClient] = useState(new RtcClient());
  const [, forceRender] = useReducer((boolean) => !boolean, false);

  const setRtcClient = (rtcClient) => {
    _setRtcClient(rtcClient);
    forceRender();
  };
  return (
    <>
      <InputFormLocal rtcClient={rtcClient} setRtcClient={setRtcClient} />
      <InputFormRemote rtcClient={rtcClient} setRtcClient={setRtcClient} />
      <VideoArea rtcClient={rtcClient} />
    </>
  );
};

export default App;
