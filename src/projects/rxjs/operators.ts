import { Observable } from "./core";

export const map = (cb: (value: any) => {}): ((source: Observable) => Observable) => {
    return (source: Observable) => new Observable(observer => {
        source.subscribe(value => observer.next(cb(value)))
    })
}