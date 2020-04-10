import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';
import GroupBar from '../GroupBar/GroupBar';
import GroupList from "../GroupList/GroupList";
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:4000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      console.log(message)
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);


const sendMessage = (event) => {
  event.preventDefault();
  var current_date = new Date();
  current_date = current_date.toLocaleString();

  if(message) {
    socket.emit('sendMessage', message, current_date, () => setMessage(''));
    onSendMessage(name,message,current_date,room)
  }
}

const onSendMessage = (name,text,current_date,groupname) =>{
 
  let timer = null;

  var sending_data = {
    name:name,
    time_stamp:current_date,
    messages:text,

  }

  fetch("http://localhost:4000/api/groups/"+groupname+"/message" , {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sending_data)
  })
}

  

  if(room=="default"){
    return(
    
    <div className="outerContainer">
      <div className="groupcontainer">
            <GroupBar name={name}/>
      </div>
      <div className="container">
        <h1>Select Group To Chat</h1>
      </div>
      {/* <TextContainer users={users}/> */}
    </div>
    )
  }
  return (
    
    <div className="outerContainer">
      <div className="groupcontainer">
            <GroupBar name={name}/>
      </div>
      <div className="container">
          {console.log(room)}
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} name={name} groupname={room}/>
      </div>
      {/* <TextContainer users={users}/> */}
    </div>
  );
  
}

export default Chat;

