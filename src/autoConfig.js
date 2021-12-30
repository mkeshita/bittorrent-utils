const config = require('config')
const bitTorrentSpeed = require('./libs/BitTorrentSpeed.js')
const log = require('./libs/log.js')
const clients = require ('./clients.js')

const autoconfigSettings = config.get('AUTOCONFIG_SETTINGS')

const setSettings = async (client, clientIndex) => {
    try {
        await client.setSettings(autoconfigSettings)
        log.info(`Client #${clientIndex}: settings applied`)

        if (client.settings.BITTORRENT_SPEED_PORT_FILE_PATH) {
            await bitTorrentSpeed.disableTokensSpending()
            log.info(`Client #${clientIndex}: tokens spending disabled`)
        }
    } catch (error) {
        log.error(`Client #${clientIndex}: ${error.message}`)
    }
}

module.exports.start = () => Promise.all(clients.map(setSettings))