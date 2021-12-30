const config = require('config')
const colors = require('colors')
const fetch = require('node-fetch')
const inAppTransfer = require('./libs/inAppTransfer.js')
const ledgerRPC = require('./libs/ledgerRPC.js')
const bitTorrentSpeed = require('./libs/BitTorrentSpeed.js')
const {UBTTtoBTT, iteration} = require('./libs/utils.js')
const log = require('./libs/log.js')

const recipientKey = config.get('AUTOTRANSFER_TO')
const historyAgeHours = config.get('AUTOTRANSFER_HISTORY_AGE_HOURS')

const getBttPrice = async () => {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTTUSDT')
    const json = await response.json()
    const value = parseFloat(json.price)
    return value
}

const getPayers = async () => {
    try {
        const configValue = config.get('AUTOTRANSFER_FROM')
        if (configValue === 'auto') {
            const payer = await bitTorrentSpeed.getPrivateKey()
            log.info(`Local client private key: ${payer}`)
            return [payer]
        } else return configValue
    } catch (error) {
        log.error(error)
        return []
    }
}

const Hisotry = class {
    constructor(historyAgeHours) {
        this.transactions = []
        this.historyAgeMS = historyAgeHours * 60 * 60 * 1000
    }

    push(transaction) {
        this.transactions.push(transaction)
        for (let i = this.transactions.length - 1; i >= 0; i--) {
            const transactionAgeMS = Date.now() - this.transactions[i].timestamp
            if (transactionAgeMS > this.historyAgeMS) this.transactions.splice(i, 1)
        }
    }

    getGlobalProfitability = () => this.transactions.reduce((acc, transaction) => acc + transaction.paymentAmount, 0)
    getPayerProfitability = payerIndex => this.transactions.reduce((acc, transaction) => transaction.payerIndex === payerIndex ? acc + transaction.paymentAmount : acc, 0)
}

const history = new Hisotry(historyAgeHours)

const autoTransfer = async (payerPrivateKey, payerIndex, payers) => {
    try {
        const transferResult = await inAppTransfer({
            payerIndex,
            payerPrivateKey,
            recipientKey: recipientKey,
            amount: 'all'
        })

        history.push({
            payerIndex,
            paymentAmount: transferResult.paymentAmount,
            timestamp: Date.now()
        })
        
        const recipientBalance = (await ledgerRPC.createAccount({
            key: recipientKey
        })).account.balance

        const bttPrice = await getBttPrice()

        const paymentAmountStr = UBTTtoBTT(transferResult.paymentAmount).toLocaleString()
        const recipientBalanceStr = UBTTtoBTT(recipientBalance).toLocaleString()
        const recipientBalancePriceStr = (UBTTtoBTT(recipientBalance) * bttPrice).toLocaleString()
        const transferLogStr = `Payer #${payerIndex}: ${(paymentAmountStr).brightMagenta} -> ${(recipientBalanceStr + ' BTT').brightMagenta} (${(recipientBalancePriceStr + ' USDT').brightGreen})`
        
        if (!historyAgeHours) log.info(transferLogStr)
        else if (historyAgeHours) {
            const payerProfit = UBTTtoBTT(history.getPayerProfitability(payerIndex))
            const globalProfit = UBTTtoBTT(history.getGlobalProfitability())
            const payerProfitPercent = Math.round(payerProfit/globalProfit*10000) / 100

            const payerProfitStr = payerProfit.toLocaleString()
            const payerProfitPriceStr = (payerProfit * bttPrice).toLocaleString()
            const globalProfitStr = globalProfit.toLocaleString()
            const globalProfitPriceStr = (globalProfit * bttPrice).toLocaleString()
            
            const payerProfitLogStr = `, last ${historyAgeHours} hour(s) profit: ${(payerProfitStr + ' BTT').brightMagenta} (${(payerProfitPriceStr + ' USDT').brightGreen})`
            if (payers.length === 1) {
                log.info(transferLogStr + payerProfitLogStr)
            } else {
                log.info(transferLogStr + payerProfitLogStr + ` - ${payerProfitPercent}% of global ${(globalProfitStr + ' BTT').brightMagenta} (${(globalProfitPriceStr + ' USDT').brightGreen})`)
            }
        }

        return
        
    } catch (error) {
        if (error.message === 'empty balance') log.debug(`Payer #${payerIndex}: ${error.message}`)
        else log.error(error)
        return
    }
}

const autoTransferIteration = (...args) => iteration(autoTransfer, config.get('AUTOTRANSFER_INTERVAL_SECONDS') * 1000, ...args)

module.exports.start = async () => {
    const payers = await getPayers()
    await Promise.all(payers.map(autoTransferIteration))
}

