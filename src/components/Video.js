import React from "react";

import { Card, CardActions, CardContent, Typography } from "@mui/material";

const Video = ({ isLocal, name, videoRef }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <video autoPlay muted={isLocal} ref={videoRef} />
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
