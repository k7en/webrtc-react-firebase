import { Button } from '@material-ui/core';
import React from 'react';


const getMedia = async() => {
  const constraints = {audio: true, video: true}

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
    /* ストリームを使用 */
  } catch(err) {
    /* エラーを処理 */
    console.log(err)
  }
}

getMedia()

const  App = () => {
  return <Button color="primary" variant="outlined">HelloWorld</Button>;
}

export default App;
