
export type Resolver = (...args: unknown[]) => unknown
export type IoCHandler<T = unknown> = (ctx: { instance: T, ioc: IoC }) => unknown

export class IoC {
    private _resolvers: Map<unknown, Resolver> = new Map()
    private _isSingleton: Map<unknown, boolean> = new Map()
    private _resolvingHandlers: Map<unknown, IoCHandler[]> = new Map()
    private _resolvedInstances: Map<unknown, unknown> = new Map()

    use<T = unknown>(token: unknown): T {
        const resolver = this._resolvers.get(token)
        if (resolver === undefined) throw Error(`Resolver for token ${token} doesnt exist`)

        const resolvedInstance = this._resolvedInstances.get(token)
        if (resolvedInstance) return <T>resolvedInstance

        let instance = resolver(this)

        const handlers = this._resolvingHandlers.get(token) || []

        for (let handler of handlers) {
            instance = handler({ instance, ioc: this })
        }

        if (this._isSingleton.get(token)) this._resolvedInstances.set(token, instance)

        return <T>instance
    }

    bind<T = unknown>(token: unknown, resolver: Resolver) : void {
        this._resolvers.set(token, resolver)
    }

    singleton<T = unknown>(token: unknown, resolver: Resolver): void {
        this._isSingleton.set(token, true)
        this.bind(token, resolver)
    }

    resolving<T = unknown>(token: unknown, handler: IoCHandler<T>): void {
        this._resolvingHandlers.set(token, [...this._resolvingHandlers.get(token) || [], <IoCHandler>handler])
    }

    register(provider: Provider): void {
        provider.register(this)
    }
}


export interface Provider {
    register(ioc: IoC): void
}