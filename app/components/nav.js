import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as firebase from 'firebase'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/Ionicons';


export default class Nav extends Component {

  home(){
    return (
      <View  style={styles.container}>
      <TouchableOpacity onPress ={() => this.props.navigation.navigate('Home', {user: this.props.user})}>
      <Iconz name="ios-person" color ="#888" size={25} style={{margin:10}} />
      </TouchableOpacity>
      <Image source ={require('../images/logo.png')} resizeMode = "contain" style={{width:100, height:30}} />
      <TouchableOpacity onPress ={() => {firebase.auth().signOut()}}>
      <Iconz name="ios-chatboxes-outline" color ="#555" size={25} style={{margin:10}} />
      </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
        <View>{this.home()}</View>
        )
  }
}

const styles = StyleSheet.create({
  container: {
    height:60,
    flexDirection:'row',
    paddingTop:10,
    justifyContent: 'space-between',
    alignItems:'center',
    backgroundColor: '#fff',
    borderBottomWidth:1,
    borderColor:'rgba(0,0,0,0.1)'
  },
});
