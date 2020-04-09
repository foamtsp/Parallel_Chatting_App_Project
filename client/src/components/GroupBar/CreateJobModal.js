import React, { useState,Component } from 'react';
import Modal from 'react-modal';
import './CreateJobModal.css';






const CreateJobModal = ({ name }) => {

  const [modalIsOpen, setmodalIsOpen] = useState('');

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      justifyContent: 'center',
    }
  };
  

  const onCreateGroup = (name) =>{
    var groupname = document.getElementById('groupname').value
    groupname = groupname.trim()
    if(groupname.length == 0){
        alert('Please Fill Group Name')
    }
    else{

        var sending_data = {
          name:name,
          groupName:groupname
        }

        fetch("http://localhost:4000/api/groups" , {
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
        .then(window.location.reload(false))
    }
    
  }

  

  const openModal = async () => {
    await setmodalIsOpen(true);
  }
  // useEffect(() => {
  //   fetchGroupName();
  // },[]);


  const closeModal = async () => {
    await setmodalIsOpen(false);
  }



  

    return (
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={openModal}>+</button>
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal()}
          onRequestClose={()=>closeModal()}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <div>
            <h2>Group Name</h2>
            <input placeholder="Fill Group Name" id="groupname"/>
            <button onClick={()=>onCreateGroup(name)}>Create Group</button>
        </div>    

        </Modal>
      </div>
    )

  


}
export default CreateJobModal;