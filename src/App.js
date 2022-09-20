import logo from './logo.svg';
import './App.css';
import AgoraRTM from 'agora-rtm-sdk'
import Video from './comps/video/Video';
//import RtmClient from 'rtm-client.js'




function App() {
  let options = {
    uid: "himesha",
    token: "006f7fa34d8230d453abf31990fbdd20fe9IAAO5e8/yTt3gbr7BiFZZZZXWGby9nBAyX3OckCCCKwUxMtRsqYAAAAAEAB+TtVuV90qYwEA6ANX3Spj"
  }

  // Your app ID
  const appID = "f7fa34d8230d453abf31990fbdd20fe9"
  // Your token
  //options.token = "006f7fa34d8230d453abf31990fbdd20fe9IABoA+G4/wnwmeoYPdCZYvpcwBVYG7jBv4ZFIZZ0NDipJj+vpJ4AAAAAEACtG0/LWGskYwEA6ANYayRj"

  // Initialize client
  const client = AgoraRTM.createInstance(appID)
  // Display messages from peer
  client.on('MessageFromPeer', function (message, peerId) {

    document.getElementById("log").appendChild(document.createElement('div')).append("Message from: " + peerId + " Message: " + message)
  })
  // Display connection state changes
  client.on('ConnectionStateChanged', function (state, reason) {

    document.getElementById("log").appendChild(document.createElement('div')).append("State changed To: " + state + " Reason: " + reason)

  })

  let channel = client.createChannel("mahee")

  channel.on('ChannelMessage', function (message, memberId) {

    document.getElementById("log").appendChild(document.createElement('div')).append("Message received from: " + memberId + " Message: " + message)

  })
  // Display channel member stats
  channel.on('MemberJoined', function (memberId) {

    document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")

  })
  // Display channel member stats
  channel.on('MemberLeft', function (memberId) {

    document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " left the channel")

  })


  const login = async () => {
    await client.login(options)
    console.log("object");
  }
  const logout = async () => {
    await client.logout();
    console.log("log out")
  }
  const join = async () => {
    await channel.join().then(() => {
      document.getElementById("log").appendChild(document.createElement('div')).append("You have successfully joined channel " + channel.channelId)
    })
  }
  const leave = async () => {
    if (channel != null) {
      await channel.leave()
    }

    else {
      console.log("Channel is empty")
    }
  }
  const send_peer_message = async () => {
    let peerId = document.getElementById("peerId").value.toString()
    let peerMessage = document.getElementById("peerMessage").value.toString()

    await client.sendMessageToPeer(
      { text: peerMessage },
      peerId,
    ).then(sendResult => {
      if (sendResult.hasPeerReceived) {

        document.getElementById("log").appendChild(document.createElement('div')).append("Message has been received by: " + peerId + " Message: " + peerMessage)

      } else {

        document.getElementById("log").appendChild(document.createElement('div')).append("Message sent to: " + peerId + " Message: " + peerMessage)

      }
    })
  }

  const send_channel_message = async () => {
    let channelMessage = document.getElementById("channelMessage").value.toString()

    if (channel != null) {
      await channel.sendMessage({ text: channelMessage }).then(() => {

        document.getElementById("log").appendChild(document.createElement('div')).append("Channel message: " + channelMessage + " from " + channel.channelId)

      }

      )
    }
  }
  return (
    <div className="App">
      <h1 className="left-align">RTM Quickstart</h1>
      <form id="loginForm">
        <div className="col" >
          <div className="card" >
            <div
              className="row card-content"

            >
              <div className="input-field">
                <label>User ID</label>
                <input type="text" placeholder="User ID" id="userID" />
              </div>
              <div className="row">
                <div>
                  <button type="button" id="login" onClick={login}>LOGIN</button>
                  <button type="button" id="logout" onClick={logout}>LOGOUT</button>
                </div>
              </div>
              <div className="input-field">
                <label>Channel name: demoChannel</label>
              </div>
              <div className="row">
                <div>
                  <button type="button" id="join" onClick={join}>JOIN</button>
                  <button type="button" id="leave" onClick={leave} >LEAVE</button>
                </div>
              </div>
              <div className="input-field channel-padding">
                <label>Channel Message</label>
                <input
                  type="text"
                  placeholder="channel message"
                  id="channelMessage"
                />
                <button type="button" id="send_channel_message" onClick={send_channel_message} >SEND</button>
              </div>
              <div className="input-field">
                <label>Peer Id</label>
                <input type="text" placeholder="peer id" id="peerId" />
              </div>
              <div className="input-field channel-padding">
                <label>Peer Message</label>
                <input type="text" placeholder="peer message" id="peerMessage" />
                <button type="button" id="send_peer_message" onClick={send_peer_message}>SEND</button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div id="log"></div>
      <Video/>
    </div>
  );
}

export default App;
