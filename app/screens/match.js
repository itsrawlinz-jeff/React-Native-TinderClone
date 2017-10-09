import React, {Component} from 'react'
import {
  ListView,
  Text,
  View,
} from 'react-native'

import * as firebase from 'firebase'
import _ from 'lodash'

import CircleImage from '../components/circleImage'

export default class Matches extends Component {

  state = {
    dataSource: new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow !== newRow}),
    matches:[],
  }

  componentWillMount(){
    // this.setState({dataSource: this.state.dataSource.cloneWithRows(demoProfiles)})
    this.getMatches(this.props.user.uid)
  }

  getOverlap = (liked, likedBack) => {
    const likedTrue = _.pickBy(liked, value => value)
    const likedBackTrue = _.pickBy(likedBack, value => value)
    return _.intersection(_.keys(likedTrue), _.keys(likedBackTrue))
  }


    getUser = (uid) => {
      return firebase.database().ref('users').child(uid).once('value')
        .then(snap => snap.val())
    }

    getMatches = (uid) => {
      firebase.database().ref('relationships').child(uid).on('value', snap => {
        const relations = snap.val() || []
        const allMatches = this.getOverlap(relations.liked, relations.likedBack)
        console.log('allMatches', allMatches)
        const promises = allMatches.map(profileUid => {
          const foundProfile = _.find(this.state.matches, profile => profile.uid === profileUid)
          return foundProfile ? foundProfile : this.getUser(profileUid)
        })
        Promise.all(promises).then(data => this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data),
          matches: data,
        }))
      })
    }

renderRow = (rowData) => {
  const {id, first_name, work} = rowData
  const bio = (work && work[0] && work[0].position) ? work[0].position.name : null
  return (
    <View style={{flexDirection:'row', backgroundColor:'white', padding:10}}>
     <CircleImage size={80} facebookID={id} />
       <View style={{justifyContent:'center', marginLeft:10}}>
        <Text style={{fontSize:18}}>{first_name}</Text>
        <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text>
      </View>
    </View>
  )
}

renderSeparator = (sectionID, rowID) => {
  return (
    <View key={rowID} style={{height:1, backgroundColor:'whitesmoke', marginLeft:100}}/>
  )
}

  render(){
    return (
      <ListView style={{flex:1, backgroundColor:'white'}}
        dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          enableEmptySections={true}>
        </ListView> // listview is a core react native component designed to efficiently display vertically scrolling lists of changing data. Every listview needs a datasource
    )
  }
}



// id: '727957756',
// first_name: 'jayNat',
//
// id: '678220507',
// first_name: 'Mitzy',
//
// id: '100005106304238',
// first_name: 'Sam',
//
// id: '643723857',
// first_name: 'Jackson',
//
// id: '577300564',
// first_name: 'Pedro',
//
// id: '740949342',
// first_name: 'Michael',
//
//
// id: '884600234',
// first_name: 'Valentine',
//
// id: '615006411',
// first_name: 'Gene',
//
// id: 'Chris',
// first_name: '521323281',
//
// id: '800628451',
// first_name: 'Stammy',
