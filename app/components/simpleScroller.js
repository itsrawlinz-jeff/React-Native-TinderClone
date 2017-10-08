import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native'

const {width, height} = Dimensions.get('window')
export default class SimpleScroller extends Component {
  componentWillMount(){
    this.pan = new Animated.Value(0) //single animated Value

    this.scrollResponder = PanResponder.create({
      //below are all the responder callbacks
      //active responder when it is touched = true
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant:() => {
        this.pan.setOffset(this.pan._value)
        this.pan.setValue(0)
      },
      //setOffset allows us to set a base value on top of whatever our animated value is

      //executed everytime the touch moves. this is where we are going to hook up our responder to our animated value by creating an animated event
      onPanResponderMove: Animated.event([
        null,
        //connecting the distance along the x axis to this.pan. When the touch moved along the x axis it will update the animated value
        {dx:this.pan},
      ]),
      //this centers the screen on release
      //vx is the velocity along the x axis
      onPanResponderRelease: (e, {vx}) => {
        this.pan.flattenOffset() // this will take whatever value is in the offset and add it to the base animated value.
        let move = Math.round(this.pan._value / width) * width
        if (Math.abs(vx) > 0.25) {
          const direction = vx / Math.abs(vx) // will return either 1 for swipe right or -1 for swipe left
          const scrollPos = direction > 0 ? Math.ceil(this.pan._value / width) : Math.floor(this.pan._value / width) // will return either 0, -1 or -2
          move = scrollPos * width
        }
        const minScroll = (this.props.screens.length -1) * -width
        Animated.spring(this.pan, {
          toValue: this.clamp(move, minScroll, 0),
          bounciness: 0,
        }).start()
      },
    })
  }

  clamp = (num, min, max) => {
    return num <= min ? min : num >= max ? max : num
  }

  render(){
    const animatedStyles = {
      transform: [
        {translateX: this.pan},
      ],
    }
    const scrollerWidth = this.props.screens.length * width
    return (
      <Animated.View
        //connecting the handlers from our pan responder to the handlers of our view using the spread operator
        style ={[styles.scroller, animatedStyles, {width: scrollerWidth}]}
        {...this.scrollResponder.panHandlers}>
        {this.props.screens.map((screen, i) => <View key={i} style={{width, height}}>{screen}</View>)}
      </Animated.View>
    )
  }
}

/* enclosing each screen in its own parent container view by mapping through each screen in the screens prop and then surround them with a parent view. Each screen is the width and height of the current devices screen */

const styles = StyleSheet.create({
  scroller:{
    flex:1,
    backgroundColor: 'blue',
    flexDirection: 'row', //flex default is column
  }
})
