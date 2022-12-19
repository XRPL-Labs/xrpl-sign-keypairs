const addresscodec = require('ripple-address-codec')
const BigInteger = require('big-integer')

function sortSigners(signers) {
  if (signers.length === 1) return signers
  var hashInts = signers.map(function(signer) {
    return BigInteger('00' + addresscodec.decodeAccountID(signer.Signer.Account).toString('hex'), 16)
  })
  for (var i = 1; i < hashInts.length; i++) {
    if (hashInts[0].greaterOrEquals(hashInts[i])) {
      hashInts = [hashInts[i]].concat(hashInts.slice(0,i)).concat(hashInts.slice(i+1))
      signers = [signers[i]].concat(signers.slice(0,i)).concat(signers.slice(i+1))
    }
  }
  return signers
}

module.exports = sortSigners
