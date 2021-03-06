import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';
import GroupBar from '../GroupBar/GroupBar';
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [last_timestamp, setLast_TimeStamp] = useState('');
  const ENDPOINT = 'https://parallel-chatting-app.herokuapp.com/';

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
    fetchOldMessage(room,name);
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      console.log(message)
      setMessages(messages => [ ...messages, message ].sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1));
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);


const sendMessage = (event) => {
  event.preventDefault();
  var current_date = new Date();
  current_date = current_date.toLocaleString();

  const msg = {text:message, timestamp: new Date()};

  if(message) {
    socket.emit('sendMessage', msg, () => setMessage(''));
  }
  
}

const fetchOldMessage = async (groupname,name) => {

  if (groupname === "default") return;
  
  let messages = [];

  const apiCall = await fetch("/api/groups/"+groupname+"/message", {method: 'GET',});
  const apiCall2 = await apiCall.json()
  const apiCallLastTimeStamp = await fetch("/api/userRecords/"+name, {method: 'GET',});
  const apiCallLastTimeStamp2 = await apiCallLastTimeStamp.json()
  
  var msgs = apiCall2.data;
  var time_stamps = apiCallLastTimeStamp2.data;
  var time_stamp = null;
  var first_time_stamp = null;
  let last_index = time_stamps.length;

  for(var i = last_index-1;i>=0;i--){
    if(time_stamps[i]['group']['groupName'] == groupname){
      time_stamp = time_stamps[i]['leaveTimestamp']
      first_time_stamp = time_stamps[i]['joinAt']
      break;
    }
  }

  var once = true;

  msgs.forEach(msg => {
    let message = {
      text:msg.text,
      user:msg.author,
      timestamp:msg.createdAt
    
    }
    if(message['timestamp']>time_stamp && once && messages.length>0){
      let unread_message = {
        text:'------------------------------------------------------------Unread Message------------------------------------------------------------',
        user:'admin',
        timestamp:time_stamp
      }
      once = false;
      messages.push(unread_message)
    }
    if(msg.createdAt>first_time_stamp){
      messages.push(message)
    }
  });

  messages.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)

  setMessages(messages)
}

  if(room ==="default"){
    return(
    
    <div className="outerContainer">
      <div className="groupcontainer">
            <GroupBar name={name}/>
      </div>
      <div className="container">
        <h1 className="center">Select Group To Chat</h1>
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
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} name={name} groupname={room}/>
      </div>
    </div>
  );
  
}

export default Chat;

