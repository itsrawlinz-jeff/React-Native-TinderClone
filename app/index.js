import * as firebase from 'firebase'
import {StackNavigator} from 'react-navigation'
import Home from './screens/home'
import Login from './screens/login'
import Chat from './screens/chat'

const firebaseConfig = {
    apiKey: "AIzaSyDiuhSIwJjuga-0IX7OqH__aGZA39SQexo",
    databaseURL: "https://clonetinder-f1b6e.firebaseio.com",
}

firebase.initializeApp(firebaseConfig)

const RouteConfigs = {
  Login: {screen:Login},
  Home: {screen:Home},
  Chat: {screen:Chat},
}

const StackNavigatorConfig = {
  headerMode:'none'
}

export default StackNavigator(RouteConfigs, StackNavigatorConfig)
