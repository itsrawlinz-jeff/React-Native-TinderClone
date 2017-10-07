import React, {Component} from 'react'
import Card from '../components/card'
import {View} from 'react-native'
import * as firebase from 'firebase'

export default class Home extends Component {
  state = {
    profileIndex: 0,
    profiles: []
  }

//loads data just once from our database. The once function takes 2 arguments. What events you are listening for and a function that will be executed once we recieve data from firebase
componentWillMount(){
  firebase.database().ref().child('users').once('value', (snap)=>{
    let profiles = []
    snap.forEach((profile)=> {
      const {name, bio, birthday, id} = profile.val()
      profiles.push({name, bio, birthday, id})
    })
    this.setState({profiles})
  })
}
  nextCard = () => {this.setState({profileIndex: this.state.profileIndex + 1})
  }

  render() {
    const {profileIndex} = this.state
    return (
      <View style={{flex:1}}>
        {this.state.profiles.slice(profileIndex, profileIndex + 3).reverse().map((profile) => {
          return (
            <Card
              key={profile.id}
              profile={profile}
              onSwipeOff={this.nextCard}
            />
          )
        })}
      </View>
    )
  }
}
