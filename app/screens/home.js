import Expo from 'expo'
import React, {Component} from 'react'
import Card from '../components/card'
import SimpleScroller from '../components/simpleScroller'
import Profile from './profile'
import {View} from 'react-native'
import * as firebase from 'firebase'
import GeoFire from 'geofire'

import filter from '../modules/filter'

export default class Home extends Component {
  state = {
    profileIndex: 0,
    profiles: [],
    user: this.props.navigation.state.params.user

  }

  //loads data just once from our database. The once function takes 2 arguments. What events you are listening for and a function that will be executed once we recieve data from firebase
  componentWillMount() {
    const{uid} = this.state.user
    this.updateUserLocation(uid)
    //the on method creates a listener for the specified user, so when an update to our user occurs in firebase then a callback function is fired within our app
    firebase.database().ref('users').child(uid).on('value', snap => {
      //on each callback firebase sends us the updated user in the form of a snapshot or a snap.
      //converting the snap into some usable data
      const user = snap.val()
      this.setState({
        user,
        profiles:[],
        profileIndex: 0,
      })
      this.getProfiles(user.uid, user.distance )
    })
  }
  //this is an asynchronous function and the 'once' function is used to only make the query one time for each get user call
  getUser = (uid) => {
    return firebase.database().ref('users').child(uid).once('value')
  }
//this is going to get our users current location from Firebase and assign it to the user location variable
getProfiles = async (uid, distance) => {
  const geoFireRef = new GeoFire(firebase.database().ref('geoData'))
  const userLocation = await geoFireRef.get(uid)
  const geoQuery = geoFireRef.query({
    center: userLocation,
    radius: distance, //km
    })
    geoQuery.on('key_entered', async (uid, location, distance) => {
      const user = await this.getUser(uid)
      const profiles = [...this.state.profiles, user.val()]
      const filtered = filter(profiles, this.state.user)
      //filter
      this.setState({profiles: filtered})
      //spread operator to deconstruct the profiles that are currently in our state and then we are going to add our users to the end of the array. This creates a new array of all the existing users from state plus the user that just entered the geoquery.
    })
  }
  //gets user location and stores it in firebase
  updateUserLocation = async (uid) => {
    const {Permissions, Location} = Expo
    const {status} = await Permissions.askAsync(Permissions.LOCATION)
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({enableHighAccuracy: false})
      // const {latitude, longitude} = location.coords
      const latitude = 37.39239 //demo lat
      const longitude = -122.09072 //demo lon

      const geoFireRef = new GeoFire(firebase.database().ref('geoData'))
      geoFireRef.set(uid, [latitude, longitude])

      console.log('Permission Granted', location)
    } else {
      console.log('Permission Denied')
    }
  }

  nextCard = () => {
      this.setState({profileIndex: this.state.profileIndex + 1})
    }

    cardStack = () => {
      const {profileIndex} = this.state
      return(
        <View style={{
          flex: 1
        }}>
          {this.state.profiles.slice(profileIndex, profileIndex + 3).reverse().map((profile) => {
            return (<Card key={profile.id} profile={profile} onSwipeOff={this.nextCard}/>)
          })}
        </View>
      )
    }

  render() {
    return (
      <SimpleScroller
      screens={[
        <Profile user={this.state.user}/>,
        this.cardStack()
      ]}/>
    )
  }
}
