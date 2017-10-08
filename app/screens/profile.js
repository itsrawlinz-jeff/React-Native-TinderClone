import React, {Component} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import CircleImage from '../components/circleImage'
import Slider from 'react-native-multislider'

export default class Profile extends Component {

  state = {
    ageRangeValues: [18, 24],
    distanceValue: [5],
  }
  render(){
    const{first_name, work, id} = this.props.user
    const{ageRangeValues, distanceValue} = this.state
    const bio = (work && work[0] && work[0].position)? work[0].position.name : null
    return(
      <View style={styles.container}>
        <View style={styles.profile}>
          <CircleImage facebookID={id} size={120}/>
          <Text style={{fontSize:20}}>{first_name}</Text>
          <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text>
        </View>
        <View style={styles.label}>
          <Text>Distance</Text>
          <Text style={{color: 'darkgrey'}}>{distanceValue}km</Text>
        </View>
        <Slider
          min={1}
          max={30}
          values={distanceValue}
          onValuesChange={val => this.setState({distanceValue:val})}
        />
        <View style={styles.label}>
          <Text>Age Range</Text>
          <Text style={{color: 'darkgrey'}}>{ageRangeValues.join('-')}</Text>
        </View>
        <Slider
          min={18}
          max={70}
          values={ageRangeValues}
          onValuesChange={val => this.setState({ageRangeValues:val})}
        />
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
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 20,
    marginLeft: 20,
  }
})