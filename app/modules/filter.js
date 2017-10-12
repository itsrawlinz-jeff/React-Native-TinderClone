//filter exports a default function that takes profiles and user as arguments and returns a new filtered profile array.
import _ from 'lodash'
import moment from 'moment'

export default (profiles, user, swipedProfiles) => {
  // console.log('in filter', profiles, '??', user, '??', swipedProfiles);
  const rejectMe = _.reject(profiles, profile => profile.uid === user.uid) // rejects the user's profile
  // console.log('rejected', rejectMe);

  const filterGender = _.filter(rejectMe, profile => {
    const userShowMen = user.showMen && profile.gender === 'male'
    const userShowWomen = user.showWomen && profile.gender === 'female'

    const profileShowMen = profile.showMen && user.gender === 'male'
    const profileShowWomen = profile.showWomen && user.gender === 'female'

    return (userShowMen || userShowWomen) && (profileShowMen || profileShowWomen)
  })

  const birthday = user.birthday || "3/23/1991"

  const userBirthday = moment(birthday, 'MM/DD/YYYY')
  const userAge = moment().diff(userBirthday, 'years')

  // console.log('birthday, age', userBirthday, userAge);

  const filterAgeRange = _.filter(filterGender, profile => {
    const pBirthday = profile.birthday || "3/23/1991"
    const profileBirthday = moment(pBirthday, 'MM/DD/YYYY')
    const profileAge = moment().diff(profileBirthday, 'years')

    const withinRangeUser = _.inRange(profileAge, user.ageRange[0], user.ageRange[1] + 1)
    const withinRangeProfile = _.inRange(userAge, profile.ageRange[0], profile.ageRange[1] + 1)

    return withinRangeUser && withinRangeProfile
  })

  // console.log('filter age range', filterAgeRange);

  const filtered = _.uniqBy(filterAgeRange, 'uid')//returns only unique profiles by using uid to find duplicates
  // console.log('filtered', filtered);

  const filterSwiped = _.filter(filtered, profile => {
    const swiped = profile.uid in swipedProfiles //check to see if the profile uid is in the swipedProfiles object
    return !swiped //we dont want to see the profiles we have swiped on
  })

  return filterSwiped
}
