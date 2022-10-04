import React, { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import "./client.css";
import Videplayer from "../Videplayer";
import useId from "react-use-uuid";
import axios from "axios";
import { useEffect } from "react";

/**const Player = (props) => {
  console.log(props);
  return (
    <>
      <video width="750" height="500" src={props.videoTrack}>
        <source src={props.videoTrack} type="video/mp4" />
      </video>
    </>
  );
};*/
const Client = () => {
  const [showlocalvideo, setShowlocalvideo] = useState(false);
  const [showscreenvideo, setShowscreenvideo] = useState(false);

  const [userlocalvideo, setUserlocalvideo] = useState();
  const [userlocalaudio, setUserlocalaudio] = useState();

  const [userscreenvideo, setUserscreenvideo] = useState();

  const [userremotevideo, setUserremotevideo] = useState([]);
  const [userremoteaudio, setUserremoteaudio] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const [remotepatients, setRemotepatients] = useState([]);
  const [showsessions, setShowsessions] = useState(false);
  let localTracks = {
    videoTrack: null,
    audioTrack: null,
  };
  let localTracks2 = {
    screenVideoTrack: null,
    audioTrack: null,
    screenAudioTrack: null,
  };
  let localTrackState = {
    videoTrackMuted: false,
    audioTrackMuted: false,
  };
  /*
   * On initiation no users are connected.
   */
  let remoteUsers = {};
  let remoteUsers2 = {};

  let channelid = useId();
  let userid = useId();

  /*
   * On initiation. `client` is not attached to any project or channel for any specific user.
   */
  let options = {
    appId: "f7fa34d8230d453abf31990fbdd20fe9",
    // Set the channel name.
    channel: "mahee",
    // Pass your temp token here.
    token:
      "007eJxTYPA9qG6wJ/OI8xoj59OmLf6GUSX3V5rn9rgFcPl1LDn5J0CBwcgoySzFwNIi1SLR1MQ4KSkxyTAp2SwpyTLF0iwx0cJoq45usmmdXrLL8eWsjAwQCOKzMuQmZqSmMjAAABvKH68=",
    // Set the user ID.
    uid: 2011,
  };

  let options2 = {
    appId: "f7fa34d8230d453abf31990fbdd20fe9",
    // Set the channel name.
    channel: "mahee",
    // Pass your temp token here.
    token:
      "007eJxTYPA9qG6wJ/OI8xoj59OmLf6GUSX3V5rn9rgFcPl1LDn5J0CBwcgoySzFwNIi1SLR1MQ4KSkxyTAp2SwpyTLF0iwx0cJoq45usmmdXrLL8eWsjAwQCOKzMuQmZqSmMjAAABvKH68=",
    // Set the user ID.
    uid: 2012,
  };

  let optionscommon = {
    // Pass your App ID here.
    appId: "f7fa34d8230d453abf31990fbdd20fe9",
    // Set the channel name.
    channel: "mahee",
    // Pass your temp token here.
    token:
      "007eJxTYPA9qG6wJ/OI8xoj59OmLf6GUSX3V5rn9rgFcPl1LDn5J0CBwcgoySzFwNIi1SLR1MQ4KSkxyTAp2SwpyTLF0iwx0cJoq45usmmdXrLL8eWsjAwQCOKzMuQmZqSmMjAAABvKH68=",
    // Set the user ID.
  };
  let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  let client2 = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  const getapps = async () => {
    let reqdata = {
      email: "test3@mail.com",
    };
    const apps = await axios.post(
      "http://localhost:5001/api/getappointments",
      reqdata
    );
    //setRemotepatients(apps.data);
    console.log("date", apps.data[0].meeting);
    let meetingtoken = JSON.parse(apps.data[0].meeting);
    console.log("json", meetingtoken);
    meetings.push(meetingtoken);
  };

  useEffect(() => {
    getapps().then(() => {
      setShowsessions(true);
    });
  }, []);
  const sendurl = async (email) => {
    let linkdata = {
      channel: "mahee",
      token: options.token,
      patientemail: email,
    };
    const senddatatoclient = await axios.post(
      "http://localhost:5001/api/updateclient",
      linkdata
    );
    console.log(senddatatoclient);
  };
  const createmeeting = async () => {
    let urlfortokens = `http://localhost:5001/rtc/mahee/publisher/uid/2320`;
    const tokenformeeting = await axios.get(urlfortokens);
    let newtoken = tokenformeeting.data.rtcToken;
    console.log(tokenformeeting.data.rtcToken);
    //axios.get(urlfortokens,)
    options.channel = "mahee";
    //options2.channel = channelid;
    options.token = newtoken;
    //options2.token = tokenformeeting.data.rtcToken;
    options.uid = "2320";
    console.log(options);
  };
  const join = async () => {
    console.log("updated", options);
    // Add an event listener to play remote tracks when remote user publishes.
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    // Join a channel and create local tracks. Best practice is to use Promise.all and run them concurrently.
    [options.uid, localTracks.audioTrack, localTracks.videoTrack] =
      await Promise.all([
        // Join the channel.
        client.join(options.appId, options.channel, options.token, options.uid),
        // Create tracks to the local microphone and camera.
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
      ]);

    // Play the local video track to the local browser and update the UI with the user ID.
    //localTracks.videoTrack.play("local-player");
    //let localplay = document.getElementById("local-player");
    //localTracks.videoTrack.play(localplay);
    setUserlocalvideo(localTracks.videoTrack);
    setUserlocalaudio(localTracks.audioTrack);
    setShowlocalvideo(true);
    //$("#local-player-name").text(`localVideo(${options.uid})`);

    // Publish the local video and audio tracks to the channel(default is published from client 1).
    await client.publish(Object.values(localTracks));
    console.log("publish 1 success");

  };

  const join2 = async () => {
    // add event listener to play remote tracks when remote user publishs.
    client2.on("user-published", handleUserPublished2);
    client2.on("user-unpublished", handleUserUnpublished2);

    let screenTrack;

    // join a channel and create local tracks, we can use Promise.all to run them concurrently
    [options2.uid, localTracks2.audioTrack, screenTrack] = await Promise.all([
      // join the channel
      client2.join(
        options.appId,
        options.channel,
        options.token || null,
        options2.uid || null
      ),
      // ** create local tracks, using microphone and screen
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: {
            framerate: 15,
            height: 720,
            width: 1280,
          },
        },
        "auto"
      ),
    ]);

    if (screenTrack instanceof Array) {
      localTracks2.screenVideoTrack = screenTrack[0];
      localTracks2.screenAudioTrack = screenTrack[1];
    } else {
      localTracks2.screenVideoTrack = screenTrack;
    }
    // play local video track
    setUserscreenvideo(localTracks2.screenVideoTrack);
    //setUserlocalaudio(localTracks.audioTrack);
    setShowscreenvideo(true);
    //let screenplay = document.getElementById("screen-player");
    //localTracks2.screenVideoTrack.play(screenplay);
    //$("#screen-player-name").text(`localVideo(${options2.uid})`);

    //bind "track-ended" event, and when screensharing is stopped, there is an alert to notify the end user.
    /*localTracks.screenVideoTrack.on("track-ended", () => {
       alert(`Screen-share track ended, stop sharing screen ` + localTracks.screenVideoTrack.getTrackId());
       localTracks.screenVideoTrack && localTracks.screenVideoTrack.close();
       localTracks.screenAudioTrack && localTracks.screenAudioTrack.close();
       localTracks.audioTrack && localTracks.audioTrack.close();
     });*/

    // publish local tracks to channel
    if (localTracks2.screenAudioTrack == null) {
      await client2.publish([
        localTracks2.screenVideoTrack,
        localTracks2.audioTrack,
      ]);
    } else {
      await client2.publish([
        localTracks2.screenVideoTrack,
        localTracks2.audioTrack,
        localTracks2.screenAudioTrack,
      ]);
    }
    console.log("publish 2 success");
  };

  /*
   * Stop all local and remote tracks then leave the channel.
   */
  const leave = async () => {
    localTracks.map((trackName) => {
      var track = localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
        localTracks[trackName] = undefined;
      }
    });

    // Remove remote users and player views.
    remoteUsers = {};

    //$("#remote-playerlists").html("");

    // leave the channel
    await client.leave();
    console.log("client 1 leaves channel success");
    await client2.leave();
    console.log("client 2 leaves channel success");
  };

  /*
   * Add the local use to a remote channel.
   *
   * @param  {IAgoraRTCRemoteUser} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to add.
   * @param {trackMediaType - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/itrack.html#trackmediatype | media type} to add.
   */
  const subscribe = async (user, mediaType, clientName) => {
    const uid = user.uid;
    // subscribe to a remote user
    await clientName.subscribe(user, mediaType);
    if (mediaType === "video") {
      let plyer = document.getElementById("remote-playerlists");
      user.videoTrack.play(plyer);
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
    /*if (mediaType === "video") {
      userremotevideo.push(user.videoTrack);
      //setUserlocalvideo(user.videoTrack);
      //setShowlocalvideo(true);
      //document.getElementById("remote-playerlists").append(player);
      //user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === "audio") {
      userremoteaudio.push(user.audioTrack);
    }*/
    console.log(userremotevideo);
    console.log("subscribe success");
  };

  function handleUserPublished(user, mediaType) {
    const id = user.uid;
    remoteUsers[id] = user;
    //setParticipants((current) => [...current, user]);
    //console.log(participants);
    //participants.map((user, i) => console.log(user.uid));
    subscribe(user, mediaType, client);
  }

  function handleUserPublished2(user, mediaType) {
    console.log(remoteUsers2);
    const id = user.uid;
    remoteUsers2[id] = user;
    subscribe(user, mediaType);
  }

  /*
   * Remove the user specified from the channel in the local interface.
   *
   * @param  {string} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to remove.
   */
  function handleUserUnpublished(user, mediaType) {
    console.log("user romoved");
    if (mediaType === "video") {
      const id = user.uid;
      delete remoteUsers[id];
      document.getElementById(`player-wrapper-${id}`).remove();
    }
  }

  function handleUserUnpublished2(user, mediaType) {
    console.log("user romoved");
    if (mediaType === "video") {
      const id = user.uid;
      delete remoteUsers2[id];
      document.getElementById(`player-wrapper-${id}`).remove();
    }
  }

  return (
    <React.Fragment>
      <h2 className="left-align" id="chattitle">Agora Patient</h2>
      <div className="row mx-1">
        <div>
          <button type="button" id="join" onClick={createmeeting}>
            Start
          </button>
          <button type="button" id="join" onClick={join}>
            Join
          </button>
          <button type="button" id="leave" onClick={leave}>
            Leave
          </button>
        </div>
        <div id="sessionsec">
          <p id="sessiontitle">My Sessions</p>
          {showsessions ? (
            meetings.map((session, i) => (
              <div key={i}>
                meeting <button onClick={createmeeting}>create client</button>{" "}
                <button onClick={join}>Join client</button>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div>
          {remotepatients.map((user, i) => (
            <div key={i}>
              {user.patientemail}
              <button
                onClick={() => {
                  sendurl("test3@mail.com");
                }}
                id="urlsender"
              >
                Send
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="row video-group">
        <div className="col" id="localvideo">
          <p id="local-player-name" className="player-name"></p>
          <div id="local-player" className="player">
            {showlocalvideo ? (
              <Videplayer
                videoTrack={userlocalvideo}
                audioTrack={userlocalaudio}
              />
            ) : (
              <></>
            )}
          </div>
          <button
            id="mute-audio"
            type="button"
            className="btn btn-primary btn-sm"
          >
            Mute Audio
          </button>
          <button
            id="mute-video"
            type="button"
            className="btn btn-primary btn-sm"
          >
            Mute Video
          </button>
          <button
            id="screen-share"
            type="button"
            className="btn btn-primary btn-sm"
            onClick={join2}
          >
            Share screen
          </button>
        </div>
        <div className="col">
          <p id="screen-player-name" className="player-name"></p>
          <div id="screen-player" className="player">
            {showscreenvideo ? (
              <Videplayer
                videoTrack={userscreenvideo}
                audioTrack={userlocalaudio}
              />
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="w-100"></div>
        <div className="col">
          <div id="remote-playerlists" className="player"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Client;
