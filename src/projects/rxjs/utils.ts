import { Observable } from "./core";


export function of(values: unknown[]): Observable {
    return new Observable((observer) => {
        values.forEach(value => observer.next(value))
    })
}

type MethodType = "GET" | "POST" | "PUT" | "DELETE"

export function http(url: string, method: MethodType = "GET"): Observable {
    return new Observable((observer) => {

        const xhr = new XMLHttpRequest()
        xhr.addEventListener('load', () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                observer.next(JSON.parse(xhr.responseText));
                observer.complete();
            }
        })
        xhr.open(method, url)
        xhr.send()

        return () => xhr.abort()
    })
}