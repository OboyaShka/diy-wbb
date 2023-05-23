
// TODO reject + typing
export class Deferred<T = unknown> {
    private callbacks: ((result: any) => void)[] = []

    constructor(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void) {
        executor(this.resolve.bind(this), this.reject.bind(this))
    }

    public then<T = unknown>(cb: (result: T) => any): Deferred<T> {
        return new Deferred((resolve, reject) => {
            this.callbacks.push((prevValue) => {
                const result = cb(prevValue)
                if (result instanceof Deferred) {
                    result.then(resolve)
                } else {
                    resolve(result)
                }
            })
        })
    }

    private resolve<T>(value: T): void {
        this.callbacks.forEach(cb => cb(value))
    }

    private reject<T>(value: T): void {
    }
}