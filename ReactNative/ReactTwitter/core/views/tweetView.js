// @flow

import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Navigator
} from 'react-native'
import AndroidBackNavigationMixin from './mixins/android-back-navigation'
const NovodaDataFormat = require('./common/data-format.js')
const TwitterRequestsService = require('../service/twitter-requests-service.js')
const AvatarView = require('./common/avatar-view.js')
const AutoLink = require('react-native-autolink')

var TweetsView = React.createClass({
  mixins: [AndroidBackNavigationMixin],

  statics: {
    navigatorID () {
      return 'tweet-view-identifier'
    },
    navigatorTitle () {
      return 'Tweet Detail'
    }
  },

  propTypes: {
    tweetId: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.instanceOf(Navigator).isRequired,
    twitterService: React.PropTypes.instanceOf(TwitterRequestsService).isRequired
  },

  getInitialState () {
    return {
      tweet: {}
    }
  },

  componentDidMount () {
    this._refreshData()
  },

  _refreshData () {
    let tweetId = this.props.tweetId
    this.props.twitterService.getTweet(tweetId)
      .then((rjson) => {
        this.setState({
          tweet: rjson
        })
      })
      .catch((error) => {
        console.warn(error)
      })
  },

  render () {
    if (!this.state.tweet.user) {
      return (<View />)
    }

    let formattedTime = NovodaDataFormat.elapsedTime(Date.parse(this.state.tweet.created_at))
    return (
      <View style={styles.mainContainer}>
        <AvatarView uri={this.state.tweet.user.profile_image_url} size={200}/>
        <Text style={styles.tweet_author}>{this.state.tweet.user.name}</Text>
        <Text style={styles.tweet_author_handle}>@{this.state.tweet.user.screen_name}</Text>
        <Text style={styles.tweet_time}>Tweeted {formattedTime}</Text>
        <AutoLink style={styles.tweet_text} text={this.state.tweet.text}/>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1
  },
  userInfoContainer: {
    flexDirection: 'row'
  },
  tweet_author: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },
  tweet_author_handle: {
    fontSize: 22,
    fontStyle: 'italic',
    color: 'grey',
    marginLeft: 8
  },
  tweet_time: {
    fontSize: 16,
    color: '#656565',
    marginTop: 8
  },
  tweet_text: {
    fontSize: 20,
    color: '#656565',
    marginTop: 8,
    flex: 1
  }
})

module.exports = TweetsView
