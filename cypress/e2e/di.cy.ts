import { IoC, Provider } from "../../src/projects/di/core";

describe(('IoC'), () => {
    let ioc: IoC

    beforeEach(() => {
        ioc = new IoC()
    })

    it('nonexistent token error',() => {
        try {
            ioc.use('test')
        } catch (err: any) {
            expect(err.toString()).to.equal('Error: Resolver for token test doesnt exist')
        }
    })

    it('provide default string',() => {
        const token = 'TEST1'
        const provider: Provider = {
            register(ioc: IoC) {
                ioc.bind(token, () => 'testValue')
            }
        }
        ioc.register(provider)
        expect(ioc.use(token)).to.equal('testValue')
    })

    it('provide object',() => {
        const token = 'TEST2'

        const provider: Provider = {
            register(ioc: IoC) {
                ioc.bind(token, () => ({ value: '123' }))
            }
        }
        ioc.register(provider)
        expect(ioc.use<{ value: string }>(token).value).to.equal('123')
    })

    it('provide object as singleton',() => {
        const token1 = 'TEST3.1'
        const token2 = 'TEST3.2'

        const provider: Provider = {
            register(ioc: IoC) {
                ioc.bind(token1, () => ({ value: '123' }))
                ioc.singleton(token2, () => ({ value: '123' }))
            }
        }
        ioc.register(provider)

        const instance1 = ioc.use(token1)
        const instance2 = ioc.use(token1)
        expect(instance1 !== instance2 ).to.equal(true)

        const singletonInstance1 = ioc.use(token2)
        const singletonInstance2 = ioc.use(token2)
        expect(singletonInstance1 === singletonInstance2 ).to.equal(true)
    })

    it('provide with handlers',() => {
        const token = 'TEST4'

        const provider: Provider = {
            register(ioc: IoC) {
                ioc.bind(token, () => 'test')
                ioc.resolving(token, (ctx => `${ctx.instance} test`))
            }
        }
        ioc.register(provider)
        expect(ioc.use(token)).to.equal('test test')

        const providerUpperCase: Provider = {
            register(ioc: IoC) {
                ioc.bind(token, () => 'test')
                ioc.resolving<string>(token, (ctx => ctx.instance.toUpperCase()))
            }
        }

        ioc.register(providerUpperCase)
        expect(ioc.use(token)).to.equal('TEST TEST')
    })

    it('provide nested dependencies',() => {
        const token = 'TEST5'
        const showToken = 'TEST6'

        class Test {
            constructor(private ioc: IoC) {

            }

            returnToken() {
                return this.ioc.use(showToken)
            }
        }

        const provider: Provider = {
            register(ioc: IoC) {
                ioc.singleton(showToken, () => 'showToken')
                ioc.singleton(token, () => new Test(ioc))
            }
        }
        ioc.register(provider)

        const testClass = ioc.use<Test>(token)
        expect(testClass.returnToken()).to.equal('showToken')
    })
})



