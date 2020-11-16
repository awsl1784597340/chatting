module.exports = function () {
  const clientId = []

  function addClient(clientNumber, mode1) {
    clientId.push({ client: clientNumber, mode: mode1 })
  }
  function changeClient(clientNumber, mode1) {
    for (let i = 0; i < clientId.length; i += 1) {
      if (clientId[i].client === clientNumber)
        clientId[i].mode = mode1
    }
  }

  function getClient(clientNumber) {
    for (let i = 0; i < clientId.length; i += 1) {
      if (clientId[i].client === clientNumber)
        return clientId[i].mode
    }
  }

  return {
    addClient,
    changeClient,
    getClient
  }
}
