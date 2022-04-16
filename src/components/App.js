import React from "react";
import useRtcClient from "./hooks/useRtcCient";
import VideoArea from "./VideoArea";
import InputForms from "./InputForms";

const App = () => {
  const rtcClient = useRtcClient();

  return (
    <>
      <InputForms rtcClient={rtcClient} />
      <VideoArea rtcClient={rtcClient} />
    </>
  );
};

export default App;
