const app = require('../app')
const subserver = require('http').createServer(app)
const server = require('http').createServer()
const io = require('socket.io')(server)
const path = require('path')
const ClientManager = require('./ClientManager')
const ChatroomManager = require('./ChatroomManager')
const One2OneManager = require('./one2oneManager')
const makeHandlers = require('./handlers')
const Clientmod = require('../config/clientMod')

const one2OneManager = One2OneManager()
const clientManager = ClientManager()
const chatroomManager = ChatroomManager()
const clientMod = Clientmod()

io.on('connection', function (client) {
  const {
    handleRegister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetChatrooms,
    handleGetAvailableUsers,
    handleDisconnect,
    handleOne2One
  } = makeHandlers(client, clientManager, chatroomManager, one2OneManager)
  console.log('client connected...', client.id)
  clientMod.addClient(client.id, 0)


  clientManager.addClient(client)

  client.on('register', handleRegister)

  client.on('join', handleJoin)

  client.on('leave', handleLeave)

  client.on('message', handleMessage)

  client.on('chatrooms', handleGetChatrooms)

  client.on('One2One', handleOne2One)

  client.on('availableUsers', handleGetAvailableUsers)

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id)
    handleDisconnect()
  })

  client.on('error', function (err) {
    console.log('error! client:', client.id)
    console.log(err)
  })
})

server.listen(3000, function (err) {
  if (err) throw err
  console.log('socket 服务端已经启动，位于3000端口')
})

subserver.listen(4000, function (err) {
  if (err) throw err
  console.log('客户端已经启动,请访问 4000 端口')
})
