import logo from './logo.svg';
import './App.css';
import AgoraRTM from 'agora-rtm-sdk'
import Video from './comps/video/Video';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Client from './comps/client/Client';
import { Link } from 'react-router-dom';
import Rtm from './comps/rtm/Rtm';
//import RtmClient from 'rtm-client.js'




function App() {

  return (
    <div className="App">
      <BrowserRouter >
        <div className="row">
        <h1 className="left-align" id='mainiittle'>DHS Video Chat Demo</h1>
          <div className="col-8">
            <Routes>
              <Route path="/client" exact element={<Client />} />
              <Route path="/doctor" exact element={<Video />} />
            </Routes>
          </div>
          <div className="col-4">
            <Rtm />
          </div>
        </div>



      </BrowserRouter>
    </div>
  );
}

export default App;
