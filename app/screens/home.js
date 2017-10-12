import Expo from 'expo'
import React, {Component} from 'react'
import {View, Image} from 'react-native'
import * as firebase from 'firebase'
import GeoFire from 'geofire'

import Profile from './profile'
import Matches from './match'

import Card from '../components/card'
import SimpleScroller from '../components/simpleScroller'

import filter from '../modules/filter'

import Nav from '../components/nav'

export default class Home extends Component {

  constructor(props) {
    super(props);
    // console.log('props', props);
    this.state = {
      profileIndex: 0,
      profiles: [],
      user: props.navigation.state.params.user, //to do with login
    }
  }



  componentWillMount() {
    const {uid} = this.state.user // same as const uid = this.state.user.uid
    this.updateUserLocation(uid)
    firebase.database().ref('users').child(uid).on('value', snap => {
      const user = snap.val()
      this.setState({
        user,
        profiles:[],
        profileIndex:0,
      })
      this.getProfiles(user.uid, user.distance)
    })
  }

//will query the firebase database at a specific uid that we pass it this is an aynchronous function
  getUser = (uid) => {
    return firebase.database().ref('users').child(uid).once('value')
  }

//filtering swiped profiles out of the cardstack
  getSwiped = (uid) => {
    return firebase.database().ref('relationships').child(uid).child('liked')
      .once('value')
      .then(snap => snap.val() || {}) // {} this is incase the relationships mode does not exist
  }

//get profiles that are in the distance specified by the user
  getProfiles = async (uid, distance) => {
    const geoFireRef = new GeoFire(firebase.database().ref('geoData'))
    const userLocation = await geoFireRef.get(uid)
    const swipedProfiles = await this.getSwiped(uid)
    const geoQuery = geoFireRef.query({
      center: userLocation,
      radius: distance, //km
    })
    //what will happen if it finds profiles within the distance parameter
    geoQuery.on('key_entered', async (uid, location, distance) => {
      const user = await this.getUser(uid)
      const profiles = [...this.state.profiles, user.val()]
      // console.log(profiles, 'profiles')
      const filtered = filter(profiles, this.state.user, swipedProfiles)
      // console.log('filtered', filtered);
      this.setState({profiles: filtered})
    })
  }

  updateUserLocation = async (uid) => {
    const {Permissions, Location} = Expo //function from exponent
    const {status} = await Permissions.askAsync(Permissions.LOCATION)
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({enableHighAccuracy: false})
      const {latitude, longitude} = location.coords
      const geoFireRef = new GeoFire(firebase.database().ref('geoData'))
      geoFireRef.set(uid, [latitude, longitude])
      console.log('Permission Granted', location)
    } else {
      console.log('Permission Denied')
    }
  }

//helper code for relationships function
  relate = (userUid, profileUid, status) => {
    let relationUpdate = {}
    relationUpdate[`${userUid}/liked/${profileUid}`] = status
    relationUpdate[`${profileUid}/likedBack/${userUid}`] = status

    firebase.database().ref('relationships').update(relationUpdate)
  }

//relationships
  nextCard = (swipedRight, profileUid) => {
    const userUid = this.state.user.uid
    this.setState({profileIndex: this.state.profileIndex + 1})
    if (swipedRight) {
      this.relate(userUid, profileUid, true) //both liked and likedback will be updated
    } else {
      this.relate(userUid, profileUid, false)
    }
  }

//creating new cards
  cardStack = () => {
    const {profileIndex} = this.state
    return (
      <View style={{flex:1}}>
        <Image style={{
            flex:1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }} source={require('../images/loveGif.gif')}>
          {this.state.profiles.slice(profileIndex, profileIndex + 3).reverse().map((profile) => {
            return (
              <Card
                key={profile.id} //each users facebook ID
                profile={profile}
                onSwipeOff={this.nextCard}
              />
            )
          })}
        </Image>
      </View>
    )
  }

  render() {
    return (
      <View>
        <Nav navigation={this.props.navigation} user={this.state.user}/>
        <SimpleScroller
          screens={[
            <Profile user={this.state.user} />,
            this.cardStack(),
            <Matches navigation={this.props.navigation} user={this.state.user}/>
            ]}
        />
      </View>
    )
  }
}
