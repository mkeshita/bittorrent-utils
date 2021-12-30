const config = require('config')
const BitTorrent = require('./libs/BitTorrent.js')

class Client extends BitTorrent {
    constructor(credentials, clientIndex) {
        const {
            GUI_URL: guiUrl,
            USERNAME: username,
            PASSWORD: password,
            ...settings
        } = credentials

        super({guiUrl, username, password})

        this.index = clientIndex
        this.settings = settings
    }
}

const clientsCredentials = config.get('CLIENTS')
const clients = clientsCredentials.map((credentials, index) => new Client(credentials, index))

module.exports = clients