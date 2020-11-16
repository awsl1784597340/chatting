import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MainLayout from './MainLayout';
import Home from './Home';
import Loader from './Loader';
import UserSelection from './UserSelection';
import Chatroom from './Chatroom';
import socket from './socket';


import One2one from './One2one';


injectTapEventPlugin()

export default class Root extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      user: null,
      isRegisterInProcess: false,
      client: socket(),
      chatrooms: null,
      // eslint-disable-next-line react/no-unused-state
      one2one: [{ name: 'none', userList: ['jojo1', 'jojo2'], numMembers: 0 }],
      one2oneAfterFilter: [{ name: 'none', userList: ['jojo1', 'jojo2'], numMembers: 0 }]
    }

    this.onEnterChatroom = this.onEnterChatroom.bind(this)
    this.onLeaveChatroom = this.onLeaveChatroom.bind(this)
    this.getChatrooms = this.getChatrooms.bind(this)
    this.getOne2One = this.getOne2One.bind(this)
    this.register = this.register.bind(this)
    this.renderUserSelectionOrRedirect = this.renderUserSelectionOrRedirect.bind(this)
    this.filter = this.filter.bind(this)

    this.getChatrooms()
    this.getOne2One()
    this.filter()
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.user !== this.state.user || prevState.one2one !== this.state.one2one)
      this.filter()
  }

  onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {
    if (!this.state.user)
      return onNoUserSelected()

    return this.state.client.join(chatroomName, (err, chatHistory) => {
      if (err)
        return console.error(err)
      return onEnterSuccess(chatHistory)
    })
  }

  onLeaveChatroom(chatroomName, onLeaveSuccess) {
    this.state.client.leave(chatroomName, (err) => {
      if (err)
        return console.error(err)
      return onLeaveSuccess()
    })
  }

  getChatrooms() {
    this.state.client.getChatrooms((err, chatrooms) => {
      this.setState({ chatrooms })
    })
  }

  getOne2One() {
    this.state.client.getOne2One((err, one2one) => {
      this.setState({ one2one })
    })
    this.filter()
  }

  filter() {
    const arr = []
    if (!this.state.user)
      this.setState({ one2oneAfterFilter: new Array(this.state.one2one[0]) })
    else {
      for (let i = 0; i < this.state.one2one.length; i++) {
        if (this.state.one2one[i].userList.indexOf(this.state.user.name) > -1)
          arr.push(this.state.one2one[i])
      }
      this.setState({ one2oneAfterFilter: arr })
    }
  }

  register(name) {
    const onRegisterResponse = user => this.setState({ isRegisterInProcess: false, user })
    this.setState({ isRegisterInProcess: true })
    this.state.client.register(name, (err, user) => {
      if (err) return onRegisterResponse(null)
      return onRegisterResponse(user)
    })
  }

  renderUserSelectionOrRedirect(renderUserSelection) {
    if (this.state.user) {
      return <Redirect to="/" />
    }

    return this.state.isRegisterInProcess
      ? <Loader />
      : renderUserSelection()
  }

  renderChatroomOrRedirect(chatroom, { history }) {
    if (!this.state.user) {
      return <Redirect to="/" />
    }

    const { chatHistory } = history.location.state

    return (
      <Chatroom
        chatroom={chatroom}
        chatHistory={chatHistory}
        user={this.state.user}
        onLeave={
          () => this.onLeaveChatroom(
            chatroom.name,
            () => history.push('/')
          )
        }
        onSendMessage={
          (message, cb) => this.state.client.message(
            chatroom.name,
            message,
            cb
          )
        }
        registerHandler={this.state.client.registerHandler}
        unregisterHandler={this.state.client.unregisterHandler}
      />
    )
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <MainLayout
            user={this.state.user}
          >
            {
              !this.state.chatrooms
                ? <Loader />
                : (
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={
                        props => (
                          <div>
                            <One2one
                              user={this.state.user}
                              chatrooms={this.state.one2oneAfterFilter}
                              onChangeUser={() => props.history.push('/user')}
                              onEnterChatroom={
                                chatroomName => this.onEnterChatroom(
                                  chatroomName,
                                  () => props.history.push('/user'),
                                  chatHistory => props.history.push({
                                    pathname: chatroomName,
                                    state: { chatHistory }
                                  })
                                )
                              }
                            />
                            <Home
                              user={this.state.user}
                              chatrooms={this.state.chatrooms}
                              onChangeUser={() => props.history.push('/user')}
                              onEnterChatroom={
                                chatroomName => this.onEnterChatroom(
                                  chatroomName,
                                  () => props.history.push('/user'),
                                  chatHistory => props.history.push({
                                    pathname: chatroomName,
                                    state: { chatHistory }
                                  })
                                )
                              }
                            />
                          </div>
                        )
                      }
                    />
                    <Route
                      exact
                      path="/user"
                      render={
                        (props) => {
                          const toHome = () => props.history.push('/')
                          return this.renderUserSelectionOrRedirect(() => (
                            <UserSelection
                              getAvailableUsers={this.state.client.getAvailableUsers}
                              close={toHome}
                              register={name => this.register(name, toHome)}
                            />
                          ))
                        }
                      }
                    />
                    {
                      this.state.chatrooms.map(chatroom => (
                        <Route
                          key={chatroom.name}
                          exact
                          path={`/${chatroom.name}`}
                          render={
                            props => this.renderChatroomOrRedirect(chatroom, props)
                          }
                        />
                      ))
                    }
                    {
                      this.state.one2one.map(chatroom => (
                        <Route
                          key={chatroom.name}
                          exact
                          path={`/${chatroom.name}`}
                          render={
                            props => this.renderChatroomOrRedirect(chatroom, props)
                          }
                        />
                      ))
                     }
                  </Switch>
                )
            }
          </MainLayout>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}
