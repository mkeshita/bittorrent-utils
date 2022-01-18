const config = require('config')
const BitTorrent = require('./libs/BitTorrent.js')

class Client extends BitTorrent {
    constructor(properties, index) {
        const {
            GUI_URL: guiUrl,
            USERNAME: username,
            PASSWORD: password,
            ...settings
        } = properties

        super({guiUrl, username, password})

        this.index = index
        this.settings = settings
    }
}

const clientsData = config.get('CLIENTS')
const clients = clientsData.map((credentials, index) => new Client(credentials, index))

module.exports = clients