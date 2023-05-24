
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

export class Subject<T = any> extends Observable implements Observer {
    constructor() {
        super(() => {});
    }

    protected observers: Observer[] = []

    subscribe(observer: Observer | ((value: any) => void), error?: (err: any) => void, complete?: () => void) {
        if (typeof observer === 'function') {
            this.observers.push({
                next: observer,
                error: (error || ((error) => {})),
                complete: (complete || (() => {}))
            })
            return
        }

        this.observers.push(observer)
    }

    next(value: T): void {
        this.observers.forEach(observer => observer.next(value))
    }

    error(value): void {
        this.observers.forEach(observer => observer.error(value))
    }

    complete(): void {
        this.observers.forEach(observer => observer.complete())
    }
}

export class ReplySubject<T = any> extends Subject {
    private buffer: T[] = []

    constructor(private bufferSize?: number) {
        super()
    }

    subscribe(observer: Observer | ((value: any) => void), error?: (err: any) => void, complete?: () => void) {
        if (typeof observer === 'function') {
            observer = {
                next: observer,
                error: (error || ((error) => {})),
                complete: (complete || (() => {}))
            }
        }

        this.observers.push(observer)
        this.buffer.forEach(value => (observer as Observer).next(value))
    }

    next(value: T): void {
        this.observers.forEach(observer => observer.next(value))
        if (!this.bufferSize || this.buffer.length < this.bufferSize) {
            if (this.bufferSize === 0) return
            this.buffer.push(value)
        } else {
            this.buffer.shift()
            this.buffer.push(value)
        }
    }
}

export class BehaviorSubject<T = any> extends Subject {
    constructor(private lastValue: T) {
        super()
    }

    subscribe(observer: Observer | ((value: any) => void), error?: (err: any) => void, complete?: () => void) {
        if (typeof observer === 'function') {
            observer = {
                next: observer,
                error: (error || ((error) => {})),
                complete: (complete || (() => {}))
            }
        }

        observer.next(this.lastValue)
        this.observers.push(observer)
    }

    next(value: T): void {
        this.observers.forEach(observer => observer.next(value))
        this.lastValue = value
    }

    getValue(): T {
        return this.lastValue
    }
}


