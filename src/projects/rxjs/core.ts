
export interface Observer {
    next: (value: any) => void
    complete: () => void
    error: (err: any) => void
}

export class Observable {

    constructor(private subscribeFn: (observer: Observer) => void) {
    }

    pipe(...operators: Array<(...args: any[]) => Observable>): Observable {
        return operators.reduce<Observable>((source, next) => next(source), this)
    }

    subscribe(observer: Observer | ((value: any) => void), error?: (err: any) => void, complete?: () => void): void {
        if (typeof observer === 'function') {
            this.subscribeFn({
                next: observer,
                error: (error || ((error) => {})),
                complete: (complete || (() => {}))
            })
            return
        }

        this.subscribeFn(observer)
    }
}




