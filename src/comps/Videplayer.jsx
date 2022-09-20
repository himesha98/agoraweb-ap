import {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import "./videoplayer.css"
import React, { useRef, useEffect } from "react";

const Videplayer = (props) => {
  let container = document.getElementById("video-player");
  useEffect(() => {
    props.videoTrack?.play("video-player");
    return () => {
      props.videoTrack?.stop();
    };
  }, [props.videoTrack]);
  useEffect(() => {
    if (props.audioTrack) {
      //props.audioTrack?.play();
    }
    return () => {
      props.audioTrack?.stop();
    };
  }, [props.audioTrack]);
  return (
    <div className="player" width="640px" height="480px"  id="video-player">
    
   </div>
  );
};

export default Videplayer;
