import React, {Component} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import CircleImage from '../components/circleImage'
export default class Profile extends Component {
  render(){
    const{first_name, work, id} = this.props.user
    const bio = (work && work[0] && work[0].position)? work[0].position.name : null
    return(
      <View style={styles.container}>
        <View style={styles.profile}>
          <CircleImage facebookID={id} size={120}/>
          <Text style={{fontSize:20}}>{first_name}</Text>
          <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
