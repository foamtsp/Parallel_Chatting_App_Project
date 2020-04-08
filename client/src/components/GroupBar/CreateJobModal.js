import React, { Component } from 'react';
import Modal from 'react-modal';
import './CreateJobModal.css';


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



class CreateJobModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onCreateGroup = this.onCreateGroup.bind(this);

  }

  onCreateGroup(){
    var name = document.getElementById('groupname').value
    name = name.trim()
    if(name.length == 0){
        alert('Please Fill Group Name')
    }
    else{
        fetch("/group/" + name, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

  

  openModal() {
    this.setState({ modalIsOpen: true });
  }



  closeModal() {
    this.setState({ modalIsOpen: false });
  }



  render() {

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
       
        <button onClick={this.openModal}>+</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <div>
            <h2>Group Name</h2>
            <input placeholder="Fill Group Name" id="groupname"/>
            <button onClick={()=>this.onCreateGroup()}>Create Group</button>
        </div>    

        </Modal>
      </div>
    )

  }


}
export default CreateJobModal;