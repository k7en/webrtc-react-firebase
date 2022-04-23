import React, { useRef } from "react";

import { Card, CardActions, CardContent, Typography } from "@mui/material";

import useDimentions from "./hooks/useDimentions";

const Video = ({ isLocal, name, videoRef }) => {
  const refCard = useRef(null);
  const dimentionsCard = useDimentions(refCard);

  return (
    <Card ref={refCard}>
      <video
        autoPlay
        muted={isLocal}
        ref={videoRef}
        // width={300}
        width={dimentionsCard.width}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
};

export default Video;
