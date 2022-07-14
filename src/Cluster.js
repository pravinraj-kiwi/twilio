import React, { useEffect, useState } from "react";
import Participant from "./Participant";


const Cluster = ({ roomName, cluster, handleLogout, onParticipantClick }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const clusterparticipantConnected = (participant) => {

     
      //alert('connected in cluster: ' + participant.sid);
      //participants.forEach(party => {
       // if (participant.identity != party.identity){
          setParticipants((prevParticipants) => [...prevParticipants, participant]);
        //}
    //});
    };

    const clusterparticipantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    cluster.on("participantConnected", clusterparticipantConnected);
    cluster.on("participantDisconnected", clusterparticipantDisconnected);
    cluster.participants.forEach(clusterparticipantConnected);
    return () => {
      cluster.off("participantConnected", clusterparticipantConnected);
      cluster.off("participantDisconnected", clusterparticipantDisconnected);
    };
  }, [cluster]);

 

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} localParticipant={cluster.localParticipant.identity} />
    // if (participant.sid != cluster.localParticipant.sid )
    // {
      
    // }
    
  ));

 

  return (
    <div className="room">
      <h2>Cluster</h2>
      <table>
        <tr>
          <td>
          <div className="divTable">
        {cluster ?  (
          <Participant
            key={cluster.localParticipant.sid}
            participant={cluster.localParticipant}
            
          />
        ) : (
          ""
        )}
      </div>
          </td>
          <td>
         
      <div className="remote-participants">{remoteParticipants}</div>
          </td>
        </tr>
      </table>
      {/* <button onClick={handleLogout}>Log out</button> */}
      
      
    </div>
  );
};

export default Cluster;
