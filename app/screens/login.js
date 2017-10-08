import Expo from 'expo'
import firebase from 'firebase'
import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import {NavigationActions} from 'react-navigation'
import FacebookButton from '../components/facebookButton'


export default class Login extends Component {

  //login authentication
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({
              routeName: 'Home',
              params: {
                uid: user.uid
              }
            })]
        })
        this.props.navigation.dispatch(resetAction)
      }
    })
  }

  //facebook authentication setup
  authenticate = (token) => {
    const provider = firebase.auth.FacebookAuthProvider
    const credential = provider.credential(token)
    return firebase.auth().signInWithCredential(credential)
  }
  //firebase.google.com/docs/database.web/read-write
  createUser = (uid, userData) => {
    firebase.database().ref('users').child(uid).update(userData)
  }

  //taken from https://docs.expo.io/versions/latest/sdk/facebook.html
  login = async() => {
    const APP_ID = '314966862304637'
    const options = {
      permissions: ['public_profile', 'email', 'user_birthday', 'user_work_history']
    }
    const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(APP_ID, options)
    if (type === 'success') {
      const fields = [
        'id',
        'first_name',
        'last_name',
        'gender',
        'birthday',
        'work'
      ]
      const response = await fetch(`https://graph.facebook.com/me?fields=${fields.toString()}&access_token=${token}`)
      const userData = await response.json()
      const {uid} = await this.authenticate(token)
      this.createUser(uid, userData)
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <FacebookButton onPress={this.login}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
