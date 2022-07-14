import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Lobby from "./Lobby";
import Room from "./Room";
import Cluster from "./Cluster";
import { isReturnStatement } from "typescript";

const VideoChat = (props) => {
  const [isclustercreated, setisclustercreated] = useState("");
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [cluster, setCluster] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const mycluster = 'mycluster';
  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback((event) => {
    setRoomName(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setConnecting(true);
      const data = await fetch("/video/token", {
        method: "POST",
        body: JSON.stringify({
          identity: username,
          room: roomName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      Video.connect(data.token, {
        name: roomName,
      })
        .then((room) => {
          setConnecting(false);
          setRoom(room);
        })
        .catch((err) => {
          console.error(err);
          setConnecting(false);
        });
    },
    [roomName, username]
   
  );

  const handleLogout = useCallback( async () => {

    const data = await fetch("/video/completeevent", {
      method: "POST",
      body: JSON.stringify({
        room: mycluster         
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json()).then(()=> setRoom(""));

    const data2 = await fetch("/video/completeevent", {
      method: "POST",
      body: JSON.stringify({
        room: roomName         
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json()).then(()=> setRoom(""));

   

    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, [cluster]);

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, cluster, handleLogout]);

 
  

  // const onParticipantClick = useCallback(
    
    
  //   async (event, localParticipant, identity) => {
  //      event.preventDefault();
   
  //      alert(`Inviting `  + localParticipant +  `  to cluster `);
      
  //     setConnecting(true);
  //     const data = await fetch("/video/gettoken", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         identity: localParticipant          
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }).then((res) => res.json());

      

  //     const newCluster  = await fetch("/video/createroom", {
  //       method: "POST",
  //       body: JSON.stringify({         
  //         room: mycluster,
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }).then((resp) => resp.json());

   
  //     if (newCluster.clust) {
  //       var connectOptions = {
  //         name: mycluster,
  //         video: true,
  //         audio: false
  //       };
  //       alert(data.token);
  //     Video.connect(data.token, connectOptions)
  //       .then((cluster) => {
  //         setConnecting(false);
          
  //         setCluster(cluster);
  //       })
  //       .catch((err) => {
   
  //         console.error(err);
  //         setConnecting(false);
  //       }); 
  //      // addParticipant(identity);
      
  //   }},
  //   [cluster]
  // );

  const onParticipantClick = useCallback(
    async (event, localParticipant, identity) => {
      event.preventDefault();
      alert('Creating cluster and sending invite to ' + identity);
     
      setConnecting(true);
      const data = await fetch("/video/gettoken", {
        method: "POST",
        body: JSON.stringify({
          identity: localParticipant          
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

        
        var connectOptions = {
          name: mycluster,
          video: true,
          audio: false
        };
      Video.connect(data.token, connectOptions)
        .then((cluster) => {
          setConnecting(false);
          setCluster(cluster);
        })
        .catch((err) => {
         
          console.error(err);
          setConnecting(false);
        });        
    },
    [cluster]
  );


  const onJoinClusterClick = useCallback(
    async (event, identity) => {
      event.preventDefault();
      alert('Joining as ' + identity);
     
      setConnecting(true);
      const data = await fetch("/video/gettoken", {
        method: "POST",
        body: JSON.stringify({
          identity: identity          
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

        
        var connectOptions = {
          name: mycluster,
          video: true,
          audio: false
        };
      Video.connect(data.token, connectOptions)
        .then((cluster) => {
          setConnecting(false);
          setCluster(cluster);
        })
        .catch((err) => {
         
          console.error(err);
          setConnecting(false);
        });        
    },
    [cluster]
  );

  let render;
  let button;
  if (room) {
    render = (
      <div>
        <div>
        
        <Room roomName={roomName} room={room} handleLogout={handleLogout} onParticipantClick={onParticipantClick} onJoinClusterClick={onJoinClusterClick} />
      </div>
      <div>
      {(() => {
        if (cluster) {
          return (
            <Cluster roomName={mycluster} cluster={cluster} handleLogout={handleLogout} /> 
          )
        }
      })()}
      
      
      </div>      
      </div>
    );
  } else {
    render = (
      <Lobby
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
        connecting={connecting}
      />
    );
  }
  return render;
};

export default VideoChat;
