const config = require('config')
const ledgerRPC = require('./ledgerRPC.js')
const { numberToPercent } = require('./utils.js')

const devFeePercent = numberToPercent(config.get('DEV_FEE_PERCENT'))
const devPublicKey = 'BHGaoDov6gsuHbfk2Tc0cAyHABw3hoKS2Cv1uBpA+/nVc1JikV6IxqEZ/5NlizPGFpvMtONMyBeJcXOIb4Jdnjk='

module.exports = async function({payerPrivateKey, recipientKey, amount}){
    const payerBalance = (await ledgerRPC.createAccount({
        key: payerPrivateKey
    })).account.balance

    const processTransfer = async (paymentAmount, devFeeAmount) => {
        const transactions = []
        if (paymentAmount) transactions.push(ledgerRPC.transfer({
            payerPrivateKey: payerPrivateKey,
            recipientKey: recipientKey,
            amount: paymentAmount
        }))
        if (devFeeAmount) transactions.push(ledgerRPC.transfer({
            payerPrivateKey: payerPrivateKey,
            recipientKey: devPublicKey,
            amount: devFeeAmount
        }))
        const result = await Promise.all(transactions)
        return {
            paymentAmount,
            payerNewBalance: result[0].balance
        }
    }

    if (payerBalance <= 0) throw new Error('empty balance')
    else if (typeof amount === 'string' && amount === 'all') {
        const devFeeAmount = Math.round(payerBalance * devFeePercent)
        const paymentAmount = payerBalance - devFeeAmount
        return await processTransfer(paymentAmount, devFeeAmount)
    } else if (typeof amount === 'number') {
        const devFeeAmount = Math.round(amount * devFeePercent)
        const paymentAmount = amount
        const requestedAmount = paymentAmount + devFeeAmount
        if (payerBalance < requestedAmount) throw new Error(`not enough balance`)
        else return await processTransfer(paymentAmount, devFeeAmount)
    } else throw new Error(`wrong amount specified`)
}