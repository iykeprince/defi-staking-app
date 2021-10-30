const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')


require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('decentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    function tokens(num) {
        return web3.utils.toWei(num, 'ether')
    }

    before(async () => {
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        //Transfer all token to decntral bank
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        // Transfer mock tether to investor
        await tether.transfer(customer, tokens('100'), { from: owner })
    })

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, 'Mock Tether Token')
        })
    })
    describe('RWD Deployment', async () => {
        it('matches RWD name', async () => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches names successfully', async () => {
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yield Farming', async () => {
        let result
        it('reward token for staking', async () => {

            //check investor balance
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')

            //check staking for the customer of 100 tokens
            await tether.approve(decentralBank.address, tokens('100'), { from: customer })
            await decentralBank.depositToken(tokens('100'), { from: customer })

            //check updated balance of Customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance before staking')

            //check updated balance of Decentral bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), 'decentral bank mock wallet')

            // is Staking balance
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'true', 'customer is staking status after staking')

            //issue tokens
            await decentralBank.issueTokens({ from: owner })
            //ensure only the owner can issue token
            await decentralBank.issueTokens({ from: customer }).should.be.rejected
        })
        //
        it('customer should be able to unstake token', async () => {
            await decentralBank.unstakeTokens({from: customer})

            //check unstaking balances
            //check updated balance of Customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after staking')

            //check updated balance of Decentral bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('0'), 'decentral bank mock wallet')

            // is Staking balance
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'false', 'customer is staking status after staking')

        })
    })
})