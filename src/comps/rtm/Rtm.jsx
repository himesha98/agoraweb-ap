import AgoraRTM from "agora-rtm-sdk";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useId from "react-use-uuid";
import { Link } from "react-router-dom";
import React from "react";
import Video from "../video/Video";
import axios from "axios";
import "./rtm.css"
const Rtm = () => {
  let userforchat = useId();
  let options = {
    uid: userforchat,
    token:
      "",
  };

  // Your app ID
  const appID = "f7fa34d8230d453abf31990fbdd20fe9";
  // Your token
  //options.token = "006f7fa34d8230d453abf31990fbdd20fe9IABoA+G4/wnwmeoYPdCZYvpcwBVYG7jBv4ZFIZZ0NDipJj+vpJ4AAAAAEACtG0/LWGskYwEA6ANYayRj"

  // Initialize client
  const client = AgoraRTM.createInstance(appID);
  // Display messages from peer
  client.on("MessageFromPeer", function (message, peerId) {
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append("Message from: " + peerId + " Message: " + message);
  });
  // Display connection state changes
  client.on("ConnectionStateChanged", function (state, reason) {
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append("State changed To: " + state + " Reason: " + reason);
  });

  let channel = client.createChannel("mahee");

  channel.on("ChannelMessage", function (message, memberId) {
    console.log(message);
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append("Message received from: " + memberId + " Message: " + message.text);
  });
  // Display channel member stats
  channel.on("MemberJoined", function (memberId) {
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append(memberId + " joined the channel");
  });
  // Display channel member stats
  channel.on("MemberLeft", function (memberId) {
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append(memberId + " left the channel");
  });

  const login = async () => {
    let urlfortokens = `http://localhost:5001/rtc/publisher/uid/${options.uid}`;
    const tokenforchat = await axios.get(urlfortokens);
    let newtoken = tokenforchat.data.rtmToken;
    console.log("token or chat",tokenforchat.data);
    options.token = newtoken;
    await client.login(options);
    console.log("object");
  };
  const logout = async () => {
    await client.logout();
    console.log("log out");
  };
  const join = async () => {
    await channel.join().then(() => {
      document
        .getElementById("log")
        .appendChild(document.createElement("div"))
        .append("You have successfully joined channel " + channel.channelId);
    });
  };
  const leave = async () => {
    if (channel != null) {
      await channel.leave();
    } else {
      console.log("Channel is empty");
    }
  };
  const send_peer_message = async () => {
    let peerId = document.getElementById("peerId").value.toString();
    let peerMessage = document.getElementById("peerMessage").value.toString();

    await client
      .sendMessageToPeer({ text: peerMessage }, peerId)
      .then((sendResult) => {
        if (sendResult.hasPeerReceived) {
          document
            .getElementById("log")
            .appendChild(document.createElement("div"))
            .append(
              "Message has been received by: " +
                peerId +
                " Message: " +
                peerMessage
            );
        } else {
          document
            .getElementById("log")
            .appendChild(document.createElement("div"))
            .append("Message sent to: " + peerId + " Message: " + peerMessage);
        }
      });
  };

  const send_channel_message = async () => {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();

    if (channel != null) {
      await channel.sendMessage({ text: channelMessage }).then(() => {
        document
          .getElementById("log")
          .appendChild(document.createElement("div"))
          .append(
            "Channel message: " + channelMessage + " from " + channel.channelId
          );
      });
    }
  };
  return (
    <React.Fragment>
      <>
        <p className="left-align" id="chattitle">Real Time Chat</p>
        <Link id="mainbutton" to="/client">Client</Link>
        {"  "}
        <Link id="mainbuttondoc" to="/doctor">Doctor </Link>
        <form id="loginForm">
          <div className="col">
            <div className="card">
              <div className="row card-content">
               
                <div className="row" id="chatbtnrow">
                  <div id="chatainbtnsec">
                    <button type="button" id="login" onClick={login}>
                      Start Chat
                    </button>
                    <button type="button" id="logout" onClick={logout}>
                      End Chat
                    </button>
                  </div>
                </div>
                <div className="input-field" id="channeltitle">
                  <label>Channel name: DHS Demo</label>
                </div>
                <div className="row" id="channelbtns">
                  <div id="channelbtnsec">
                    <button type="button" id="join" onClick={join}>
                      Join
                    </button>
                    <button type="button" id="leave" onClick={leave}>
                      Leave
                    </button>
                  </div>
                </div>
                <div className="input-field channel-padding" id="messagesec">
                  <input
                    type="text"
                    placeholder="Type Here"
                    id="channelMessage"
                  />
                  <button
                    type="button"
                    id="send_channel_message"
                    onClick={send_channel_message}
                  >
                    SEND
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </form>
        <hr />
        <div id="log"></div>
      </>
    </React.Fragment>
  );
};

export default Rtm;
