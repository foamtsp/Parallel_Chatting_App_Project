import React, { useState, useEffect } from "react";
import './GroupList.css'
import io from "socket.io-client";
const ENDPOINT = 'https://parallel-chatting-app.herokuapp.com/';

let socket = io(ENDPOINT);



const GroupList = ({ name}) => {

  const [groupnames, setGroupNames] = useState('');

  const fetchGroupName = async () => {
    var list = [];
    const apiCall = await fetch("/api/groups", { method: 'GET', });
    const apiCall2 = await apiCall.json()

    var groupList = apiCall2.data;
    for (var x in groupList) {
      list.push(groupList[x])
    }
    setGroupNames(list);
  }

  useEffect(() => {
    fetchGroupName();
  }, [name]);


  const onChangeGroupChat = async (name, group) => {
    window.location.href = "/chat?name=" + name + '&room=' + group;
  }
  
  const joinGroup = async (name, groupName) => {
  
    var timer = null;
  
    var sending_data = {
      groupName: groupName,
    }
  
    await fetch("/api/users/" + name + "/joingroup", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sending_data)
    })
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        socket.emit('join_group', { name, groupName }, (error) => {
          if (error) {
            alert(error);
          }
        });
        return response.json();
      })
      .then(timer = setTimeout(() => window.location.href = "/chat?name=" + name + '&room=' + groupName, 1500));
  
  }
  
  const leaveGroup = async (name, groupName) => {
  
    var timer = null;
  
    var sending_data = {
      groupName: groupName,
    }
    

  
    await fetch("/api/users/" + name + "/leavegroup", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sending_data)
    })
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(timer = setTimeout(() => window.location.href = "/chat?name=" + name + '&room=default', 1500))
  
      // .then(window.location.href = "/chat?name=" + name + '&room=default');
  
  
  }
  
  const renderList = (name, listing) => {
    return (
  
      listing.map((group) => {
        
        var list = []
        for (var x in group['members']) {
          list.push(group['members'][x]['name'])
        }
        if (list.includes(name)) {
          return (
  
            <div>
              <li className="group">
                <p onClick={() => onChangeGroupChat(name, group['groupName'])}>{group['groupName']}</p>
                <button className="leave" onClick={() => leaveGroup(name, group['groupName'])}>Leave</button>
              </li>
            </div>
          )
        }
        return (
  
          <div>
            <li className="group">
              <p>{group['groupName']}</p>
              <button className='join' onClick={() => joinGroup(name, group['groupName'])}>Join</button>
            </li>
          </div>
        )
  
      })
    )
  }

  if (groupnames.length == 0) {
    return (<h3 className="loading">Loading...</h3>)
  }
  return (
    
  <ul>{renderList(name, groupnames)}</ul>)
}

export default GroupList;
