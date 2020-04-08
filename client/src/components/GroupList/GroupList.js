import React, { useState, useEffect } from "react";
import './GroupList.css'

const onCreateGroup = (name,group) => {
  window.location.href = "/chat?name="+name+'&room='+group;
}



const renderList = (name,listing) => {
    return (
      listing.map((group) => {
        return (

              <li onClick={()=>onCreateGroup(name,group)}>
                {group}
              </li>
        )
    })
    )
  }

const GroupList = ({ name }) => {
  

  return(<ul>{renderList(name,['Group1','Group2'])}</ul>)
}

export default GroupList;
