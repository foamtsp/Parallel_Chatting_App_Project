import React, { Component } from 'react';
import { Link } from "react-router-dom";




class GroupList extends Component {

  constructor(props) {
    super(props);
    this.name = props.name;
  
    this.state = {
      listing:['Group1','Group2']
    }
    this.renderList = this.renderList.bind(this);

  }

  // componentDidMount() {
  //   this.getalljob()
  // }

  // getalljob() {
  //   fetch("/user/groups/" + this.name, {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' },
  //     })
  //     .then(response => {
  //           this.setState({
  //               listing: response.data,
  //           })
  //       })
       
  // }

  renderList(){
    return (
      this.state.listing.map((group) => {
        return (
          <div>
            <Link to={`/chat?name=${this.name}&room=${group}`}>
                {group}
            </Link>
          </div>
          
          
        )
    })
    )
  }


  render() {
    return(<div>{this.renderList()}</div>)
  }


}
export default GroupList;