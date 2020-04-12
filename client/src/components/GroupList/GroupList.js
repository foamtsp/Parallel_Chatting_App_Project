import React, { useState, useEffect } from "react";
import './GroupList.css'
import io from "socket.io-client";
const ENDPOINT = 'localhost:4000';

let socket = io(ENDPOINT);

const onChangeGroupChat = (name, group) => {
  window.location.href = "/chat?name=" + name + '&room=' + group;
}

const joinGroup = async (name, groupName) => {

  var timer = null;

  var sending_data = {
    groupName: groupName,
  }

  await fetch("http://localhost:4000/api/users/" + name + "/joingroup", {
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
    .then(timer = setTimeout(() => window.location.reload(false), 1000));

}

const leaveGroup = async (name, groupName) => {

  var timer = null;

  var sending_data = {
    groupName: groupName,
  }


  await fetch("http://localhost:4000/api/users/" + name + "/leavegroup", {
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
    .then(timer = setTimeout(() => window.location.reload(false), 1000))

    .then(window.location.href = "/chat?name=" + name + '&room=default');


}

const renderList = (name, listing) => {
  return (

    listing.map((group) => {
      var list = []
      for (var x in group['members']) {
        list.push(group['members'][x]['name'])
      }
      if (list.includes(name)) {// when click leave Btn onChange will active
        return (

          <div>
            <li className="group">
              <p onClick={() => onChangeGroupChat(name, group['groupName'])}>{group['groupName']}</p>
              <button className="leave" onClick={() => leaveGroup(name, group['groupName'])}>Leave</button>
            </li>
            {/* <button onClick={() => leaveGroup(name, group['groupName'])}>Leave</button> */}
          </div>
        )
      }
      return (

        <div>
          <li className="group">
            <p>{group['groupName']}</p>
            <button className='join' onClick={() => joinGroup(name, group['groupName'])}>Join</button>
          </li>
          {/* <button onClick={() => joinGroup(name, group['groupName'])}>Join</button> */}
        </div>
      )

    })
  )
}

const GroupList = ({ name, onSendLeaveMessage }) => {

  const [groupnames, setGroupNames] = useState('');

  const fetchGroupName = async () => {
    var list = [];
    const apiCall = await fetch("http://localhost:4000/api/groups", { method: 'GET', });
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

  if (groupnames.length == 0) {
    return (<h3 className="loading">Loading...</h3>)
  }
  return (
    <ul>{renderList(name, groupnames)}</ul>)
}

export default GroupList;
