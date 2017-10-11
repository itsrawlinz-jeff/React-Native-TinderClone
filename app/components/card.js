import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native'

import moment from 'moment'

const {width, height} = Dimensions.get('window')

export default class Card extends Component {
  componentWillMount() {
    this.pan = new Animated.ValueXY() // Animated.ValueXY is a special type of value that we use for driving 2d animation
    this.cardPanResponder = PanResponder.create({ // object with responder callbacks
      onStartShouldSetPanResponder: () => true, //responder should become the responder when it is touched
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: Animated.event([ // executed everytime the gesture moves
        null, //ignore the native event
        {dx:this.pan.x, dy:this.pan.y}, // gesture
      ]),
      onPanResponderRelease: (e, {dx}) => { // runs when the gesture is released
        const absDx = Math.abs(dx)
        const direction = absDx / dx // this will return either -1 or 1
        const swipedRight = direction > 0

        if (absDx > 120) {
          Animated.decay(this.pan, {
            velocity: {x:3 * direction, y:0},
            deceleration: 0.995,
          }).start(() => this.props.onSwipeOff(swipedRight, this.props.profile.uid))// start is passed a function once the animation is done
        } else {
          Animated.spring(this.pan, { //centering the card
            toValue: {x:0, y:0},
            friction: 4.5,
          }).start()
        }
      },
    })
  }

  render() {
    const {birthday, first_name, work, id} = this.props.profile
    //check to see if the work node exists
    const bio = (work && work[0] && work[0].position) ? work[0].position.name : null
    const profileBday = moment(birthday, 'MM/DD/YYYY')
    const profileAge = moment().diff(profileBday, 'years')
    const fbImage = `https://graph.facebook.com/${id}/picture?height=500`

    const rotateCard = this.pan.x.interpolate({ //interpolating the x value of our pan to degrees so that we can use it to rotate our card
      inputRange: [-200, 0, 200],
      outputRange: ['10deg', '0deg', '-10deg'],
    })

    const changeColor = this.pan.x.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: ['red', 'white', 'rgb(0, 255, 18)'],
    })

    const borderchangeColor = this.pan.x.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: ['red', 'lightgrey', 'rgb(0, 255, 18)'],
    })

    const borderchangeWidth = this.pan.x.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [5, 1, 5],
    })


    const animatedStyle = {
      transform: [
        {translateX: this.pan.x},
        {translateY: this.pan.y},
        {rotate: rotateCard},
      ],
    }

    return (
      <Animated.View
        {...this.cardPanResponder.panHandlers}
        style={[styles.card, animatedStyle, {backgroundColor:changeColor, borderColor:borderchangeColor, borderWidth:borderchangeWidth}]}>
        <Image
          style={{flex:1}}
          source={{uri: fbImage}}
        />
        <View style={{margin:20}}>
          <Text style={{fontSize:20}}>{first_name}, {profileAge}</Text>
          {bio ? <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text> : <View />}
        </View>
      </Animated.View>
    )
  }
}
// will only return the bio component only if it is not null or else it will just return an empty view component

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.7,
    top: (height * 0.2) / 2,
    overflow: 'hidden',
    margin: 10,
    borderRadius: 8,
  },
})
