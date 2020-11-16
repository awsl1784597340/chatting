const One2One = require('./one2one')
const One2OneTemplates = require('../config/onetoone')

module.exports = function () {
  const singleChatroom = new Map(
    One2OneTemplates.map(c => [
      c.name,
      One2One(c)
    ])
  )

  function removeClient(client) {
    singleChatroom.forEach(c => c.removeUser(client))
  }

  function getSingleByName(one2One) {
    return singleChatroom.get(one2One)
  }

  function serializeSingle() {
    return Array.from(singleChatroom.values()).map(c => c.serialize())
  }

  return {
    removeClient,
    getSingleByName,
    serializeSingle
  }
}
