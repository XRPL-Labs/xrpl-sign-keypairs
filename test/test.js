'use strict';
const sign = require("..");
// const sortSigner = require("../lib/sort_signer");
const keypairs = require("ripple-keypairs");
const {XrplDefinitions} = require('xrpl-binary-codec-prerelease');
const assert = require('assert');

const testkeys = [
    "sp8nE7459mWYQRQtXHvq17xm8tRyN",
    "snCdBeMquLRfoFLsJpSEM9atptPFX",
    "sn9UvPSEv5W5c95KHum5CcQ8S9WfG",
    "shqHRHUWFPkGPdUfKVTkFsfQsUe8Q",
    "sscUnb67uX5MCGBCCJTZaE4BamcVe"
]

const accounts = testkeys.map((v) => {
    const kp = keypairs.deriveKeypair(v)
    const address = keypairs.deriveAddress(kp.publicKey)
    return {
        keypair : kp,
        address : address,
    }
})

describe('Test Signing', function () {
    describe('Simple signing', function () {
        it('Simple signing', function(){
            const tx = {}
            tx.Account = accounts[0].address
            tx.Destination = accounts[1].address
            const txJSON = JSON.stringify(tx)
            const r = sign(txJSON, accounts[0].keypair)
            assert( r.id === 'CE9DC82C5AD2BACF34B8CED3F238B7F48432287301901337C36D62A5A261C086');
            assert( r.signedTransaction === '732103A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF74473045022100CF8984011CD85AA00516F0FEFDD48DC337ABF4D394C55ADECA4F86220217BD0602200882DEE7D55D95F58D83B46D4FF00070FC6B524355D952D623B985A632178B3D8114A71156E659A1078C600E195386C159610AA280D88314DE1F8C18D86B47BE860B4868905CA4E45450A45A');
        })
        it('Xahau + Memo', function(){
            const tx = {
                "TransactionType": "TrustSet",
                "Account": "rXUMMaPpZqPutoRszR29jtC8amWq3APkx",
                "Flags": 131072,
                "NetworkID": 21337,
                "LimitAmount": {
                    "currency": "USD",
                    "issuer": "r9PfV3sQpKLWxccdg3HL2FXKxGW2orAcLE",
                    "value": "0.2833"
                },
                "Memos": [
                    {
                        "Memo": {
                            "MemoData": "302E323833333B302E323833333B302E323833333B302E323831363B302E32383136",
                            "MemoFormat": "746578742F637376",
                            "MemoType": "72617465733A426974727565"
                        }
                    }
                ],
                "Sequence": 755009641,
                "LastLedgerSequence": 1006389,
                "Fee": "10"
            }
            const txJSON = JSON.stringify(tx)
            const r = sign(txJSON, accounts[0].keypair)
            assert( r.id === 'AA4F93607177D67E9E5E85E9AD631AB80779352225AB5A4543CA473D720B096C');
            assert( r.signedTransaction === '12001421000053592200020000242D008869201B000F5B3563D44A109936A6100000000000000000000000000055534400000000005BEF921A217D57FDA5B56D5B40BEE40D1AC1127F68400000000000000A732103A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF744630440220445F6A809BE3EFAE6133E615274C4CC84E72F45CE07C124CD58754E556730010022055619116919C27072E2D8F8A224954E9F612D70C77749F750D6B99E717294EA1811405B5F43AF717B81948491FB7079E4F173F4ECEB3F9EA7C0C72617465733A4269747275657D22302E323833333B302E323833333B302E323833333B302E323831363B302E323831367E08746578742F637376E1F1');
        })
    })
    describe('NFT signing', function () {
        it('Simple NFT signing', function(){
            const tx = {
                TransactionType: 'NFTokenAcceptOffer',
                Account: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
                Issuer: 'rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2',
                Flags: 2147483659,
                Fee: '10',
                Memos: [
                    {
                        Memo: {
                            MemoType: '687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963',
                            MemoData: '72656E74'
                        }
                    }
                ]
            }
            const txJSON = JSON.stringify(tx)
            const r = sign(txJSON, accounts[0].keypair)
            // console.log(r)
            assert( r.id === '510E2B78CE0BC14FA613136914BD101EBB2E125BE7E127E0D6ED48F52E75212A');
            assert( r.signedTransaction === '12001D228000000B68400000000000000A732103A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF74473045022100A8C35135BECFC51A3613151B5F6F6CE21F1F4AA20343E082DBE3AF54E3F142A102200F2C3BF7800BD34C54DD400809790A5CD5210C2D668E514DBF6B83867AEFE11081140A20B3C85F482532A9578DBB3950B85CA06594D1841495F14B0E44F78A264E41713C64B5F89242540EE2F9EA7C1F687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E657269637D0472656E74E1F1');
        })
    })
    describe('Multisig Signing', function () {
        it('2 sign', function(){
            const tx = {}
            let option = { signAs: accounts[0].address }
            tx.Account = accounts[4].address
            tx.Destination = accounts[3].address
            let txJson = JSON.stringify(tx)
            const r1 = sign(txJson, accounts[0].keypair, option)

            assert( r1.txJson.SigningPubKey === '')
            assert( r1.txJson.Signers.length === 1)
            assert( r1.txJson.Signers[0].Signer.Account === 'rGN4coWmKX5cqXyGmvL1Ac6FukttfwXqbu')
            assert( r1.txJson.Signers[0].Signer.SigningPubKey === '03A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF')
            assert( r1.txJson.Signers[0].Signer.TxnSignature === '304502210085FC484F25DC642917A7BE04EF07784558F4352CD9690D440DA7AE45A5D38D8402204942500CED4FEE1DC2954B7382B21B0247E37099734EED735FF0C724BC2B437F')
            assert( r1.id === '67DF001D96C3C03FC7ECD11B7D4905F5479B9B27EE64D5EB31B7A958DAD96BCA')
            assert( r1.signedTransaction === '73008114D510CFCE846FE3D1F54678C68D2CB5DDA1ED4B2283148ADC39882D3329D50E649B37B65EAF06703D9A67F3E010732103A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF7447304502210085FC484F25DC642917A7BE04EF07784558F4352CD9690D440DA7AE45A5D38D8402204942500CED4FEE1DC2954B7382B21B0247E37099734EED735FF0C724BC2B437F8114A71156E659A1078C600E195386C159610AA280D8E1F1')

            option = { signAs: accounts[1].address }
            txJson = JSON.stringify(r1.txJson)
            const r2 = sign(txJson, accounts[1].keypair, option)

            assert( r2.txJson.SigningPubKey === '')
            assert( r2.txJson.Signers.length === 2)
            assert( r2.txJson.Signers[0].Signer.Account === 'rGN4coWmKX5cqXyGmvL1Ac6FukttfwXqbu')
            assert( r2.txJson.Signers[0].Signer.SigningPubKey === '03A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF')
            assert( r2.txJson.Signers[0].Signer.TxnSignature === '304502210085FC484F25DC642917A7BE04EF07784558F4352CD9690D440DA7AE45A5D38D8402204942500CED4FEE1DC2954B7382B21B0247E37099734EED735FF0C724BC2B437F')
            assert( r2.txJson.Signers[1].Signer.Account === 'rME7oXdB4V9tHDHHb1j3db6q5jyfiAeuD4')
            assert( r2.txJson.Signers[1].Signer.SigningPubKey === '0325BEF26FB404BC5D12C2BD9D4521F87BDCC2EE41F0CF5A6ADD0707EB5C1045AA')
            assert( r2.txJson.Signers[1].Signer.TxnSignature === '304402204BF57060A85C446941A0433B8F1AB8DDE0D4D7AE2AC08ED3BDB03E8F6088E201022015DEA16D10AC04B96AB85CBCAC072D5075AC38F3DD0E492F13DFC15E958086C4')
            assert( r2.id === '38F140EBD0B16646B0604C1628074C9E3BDBE0CF4F905D126B2FA0C72D633EEC')
            assert( r2.signedTransaction === '73008114D510CFCE846FE3D1F54678C68D2CB5DDA1ED4B2283148ADC39882D3329D50E649B37B65EAF06703D9A67F3E010732103A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF7447304502210085FC484F25DC642917A7BE04EF07784558F4352CD9690D440DA7AE45A5D38D8402204942500CED4FEE1DC2954B7382B21B0247E37099734EED735FF0C724BC2B437F8114A71156E659A1078C600E195386C159610AA280D8E1E01073210325BEF26FB404BC5D12C2BD9D4521F87BDCC2EE41F0CF5A6ADD0707EB5C1045AA7446304402204BF57060A85C446941A0433B8F1AB8DDE0D4D7AE2AC08ED3BDB03E8F6088E201022015DEA16D10AC04B96AB85CBCAC072D5075AC38F3DD0E492F13DFC15E958086C48114DE1F8C18D86B47BE860B4868905CA4E45450A45AE1F1')
        })
    })
})
