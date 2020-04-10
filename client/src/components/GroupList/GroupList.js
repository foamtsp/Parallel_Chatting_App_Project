import React, { useState, useEffect } from "react";
import './GroupList.css'

const onChangeGroupChat = (name,group) => {

  window.location.href = "/chat?name="+name+'&room='+group;
}

const joinGroup = (name,groupName) => {

  var timer = null;
  
  var sending_data = {
    groupName:groupName,
  }

  fetch("http://localhost:4000/api/users/"+name+"/joingroup" , {
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
    .then(timer = setTimeout(() => window.location.reload(false), 1000));
    
}

const leaveGroup = (name,groupName) => {

  var timer = null;
  
  var sending_data = {
    groupName:groupName,
  }

  fetch("http://localhost:4000/api/users/"+name+"/leavegroup" , {
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
    .then(timer = setTimeout(() => window.location.reload(false), 1500));
    
}

const renderList = (name,listing) => {
    return (
      
      listing.map((group) => {
        var list = []
        for(var x in group['members']){
          list.push(group['members'][x]['name'])
        }
        if(list.includes(name)){
          return (

            <div>
              <li onClick={()=>onChangeGroupChat(name,group['groupName'])}>
                {group['groupName']}
                <button onClick={()=>leaveGroup(name,group['groupName'])}>Leave</button>
              </li>
            </div>
        )
        }
        return (

          <div>
            <li>
              {group['groupName']}
              <button onClick={()=>joinGroup(name,group['groupName'])}>Join</button>
            </li>
          </div>
      )
        
    })
    )
  }

const GroupList = ({ name }) => {

  const [groupnames, setGroupNames] = useState('');

  const fetchGroupName = async () => {
    var list = [];
    const apiCall = await fetch("http://localhost:4000/api/groups", {method: 'GET',});
    const apiCall2 = await apiCall.json()

    var groupList = apiCall2.data;
    for(var x in groupList){
      list.push(groupList[x])
    }
    setGroupNames(list);
  }

  useEffect(() => {
    fetchGroupName();
  },[]);
  
  if(groupnames.length == 0){
    return(<h3>Loading...</h3>)
  }
  return(
  <ul>{renderList(name,groupnames)}</ul>)
}

export default GroupList;
