import React, { useEffect, useState } from "react";
import Participant from "./Participant";


const Room = ({ roomName, room, handleLogout, onParticipantClick, onJoinClusterClick }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const participantConnected = (participant) => {
      console.log(participant);
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} localParticipant={room.localParticipant.identity} onParticipantClick={onParticipantClick} />
  ));

  return (
    <div className="room">
      <h2>Event: {roomName}</h2>
      <button onClick={handleLogout}>Leave Event</button>
      <div>
      <button onClick={(e) =>onJoinClusterClick(e, room.localParticipant.identity)}>Join Cluster</button>
      </div>
      <table>
        <tr>
        <td>
          <div>
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
             
          />
        ) : (
          ""
        )}
      </div>

          </td>
        </tr>
        <tr>
         
          <td>
          <h3>Venue</h3>
          <div className="remote-participants">{remoteParticipants}</div>
          <br></br>
          </td>
        </tr>
      </table>
     
     
    </div>
  );
};

export default Room;
