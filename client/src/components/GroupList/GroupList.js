import React, { useState, useEffect } from "react";
import './GroupList.css'

const onCreateGroup = (name,group) => {
  window.location.href = "/chat?name="+name+'&room='+group;
}



const renderList = (name,listing) => {
    return (
      listing.map((group) => {// Create if(name in group['member'])
        return (

            <div>
              <li onClick={()=>onCreateGroup(name,group['groupName'])}>
                {group['groupName']}
                {/* <button>Join</button> */}
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
    console.log(groupList);
    for(var x in groupList){
      list.push(groupList[x])
    }
    setGroupNames(list);
  }

  useEffect(() => {
    fetchGroupName();
  },[name]);
  
  if(groupnames.length == 0){
    return(<h3 className = "loading">Loading...</h3>)
  }
  return(
  <ul>{renderList(name,groupnames)}</ul>)
}

export default GroupList;
