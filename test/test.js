'use strict';
const sign = require("..");
const sortSigner = require("../lib/sort_signer");
const keypairs = require("ripple-keypairs");
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
            console.log(r)
            assert( r.id === '510E2B78CE0BC14FA613136914BD101EBB2E125BE7E127E0D6ED48F52E75212A');
            assert( r.signedTransaction === '12001D228000000B68400000000000000A732103A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF74473045022100A8C35135BECFC51A3613151B5F6F6CE21F1F4AA20343E082DBE3AF54E3F142A102200F2C3BF7800BD34C54DD400809790A5CD5210C2D668E514DBF6B83867AEFE11081140A20B3C85F482532A9578DBB3950B85CA06594D1841495F14B0E44F78A264E41713C64B5F89242540EE2F9EA7C1F687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E657269637D0472656E74E1F1');
        })
    })
    describe('Multisig Signing', function () {
        it('2 sign', function(){
            const tx = {}
            const option = { signAs: accounts[4].address}
            tx.Account = accounts[4].address
            tx.Destination = accounts[3].address
            let txJson = JSON.stringify(tx)
            const r1 = sign(txJson, accounts[0].keypair, option)

            assert( r1.txJson.SigningPubKey === '')
            assert( r1.txJson.Signers.length === 1)
            assert( r1.txJson.Signers[0].Signer.Account === 'rLRbhx6myjsqVka72DXHgabpuWwxjNsZgW')
            assert( r1.txJson.Signers[0].Signer.SigningPubKey === '03A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF')
            assert( r1.txJson.Signers[0].Signer.TxnSignature === '3044022057CCE64E47626C7BC0C6714BD242DF56AA1D588B27FE15BFF852104D0074894702206AA882BCAE717FE9898DE7E4BAFDCAA64573C91D1F683ACFDD3F4AEB06428E76')
            assert( r1.id === 'F93E912B1162AC5139996ED211AB758FC49913A71CCFADE984C16402481AF070')
            assert( r1.signedTransaction === '73008114D510CFCE846FE3D1F54678C68D2CB5DDA1ED4B2283148ADC39882D3329D50E649B37B65EAF06703D9A67F3E010732103A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF74463044022057CCE64E47626C7BC0C6714BD242DF56AA1D588B27FE15BFF852104D0074894702206AA882BCAE717FE9898DE7E4BAFDCAA64573C91D1F683ACFDD3F4AEB06428E768114D510CFCE846FE3D1F54678C68D2CB5DDA1ED4B22E1F1')

            txJson = JSON.stringify(r1.txJson)
            const r2 = sign(txJson, accounts[1].keypair, option)

            assert( r2.txJson.SigningPubKey === '')
            assert( r2.txJson.Signers.length === 2)
            assert( r2.txJson.Signers[0].Signer.Account === 'rLRbhx6myjsqVka72DXHgabpuWwxjNsZgW')
            assert( r2.txJson.Signers[0].Signer.SigningPubKey === '0325BEF26FB404BC5D12C2BD9D4521F87BDCC2EE41F0CF5A6ADD0707EB5C1045AA')
            assert( r2.txJson.Signers[0].Signer.TxnSignature === '3045022100BFE29BD7936F1E891A2CD94A98066EB3726BB5B816F7602CC82E8EF1B6C6AE5702207479ECEC20FC67F9D4F957290B0B1D1FF1D2F87FE5131F15A6233B924B604CF4')
            assert( r2.txJson.Signers[1].Signer.Account === 'rLRbhx6myjsqVka72DXHgabpuWwxjNsZgW')
            assert( r2.txJson.Signers[1].Signer.SigningPubKey === '03A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF')
            assert( r2.txJson.Signers[1].Signer.TxnSignature === '3044022057CCE64E47626C7BC0C6714BD242DF56AA1D588B27FE15BFF852104D0074894702206AA882BCAE717FE9898DE7E4BAFDCAA64573C91D1F683ACFDD3F4AEB06428E76')
            assert( r2.id === 'E51508F6821300D5C9344FB37DDA982620DD5BC2BFC2AB44570D8423F18A00EA')
            assert( r2.signedTransaction === '73008114D510CFCE846FE3D1F54678C68D2CB5DDA1ED4B2283148ADC39882D3329D50E649B37B65EAF06703D9A67F3E01073210325BEF26FB404BC5D12C2BD9D4521F87BDCC2EE41F0CF5A6ADD0707EB5C1045AA74473045022100BFE29BD7936F1E891A2CD94A98066EB3726BB5B816F7602CC82E8EF1B6C6AE5702207479ECEC20FC67F9D4F957290B0B1D1FF1D2F87FE5131F15A6233B924B604CF48114D510CFCE846FE3D1F54678C68D2CB5DDA1ED4B22E1E010732103A80FB3AAC8F20ABAFB1758BBF8AF2B06AAB3182A1B4584F839BD4640587101FF74463044022057CCE64E47626C7BC0C6714BD242DF56AA1D588B27FE15BFF852104D0074894702206AA882BCAE717FE9898DE7E4BAFDCAA64573C91D1F683ACFDD3F4AEB06428E768114D510CFCE846FE3D1F54678C68D2CB5DDA1ED4B22E1F1')
        })
    })
})
