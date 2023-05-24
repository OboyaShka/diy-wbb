import { of, http } from "../../src/projects/rxjs/utils";
import { map, tap } from "../../src/projects/rxjs/operators";
import { BehaviorSubject, ReplySubject, Subject } from "../../src/projects/rxjs/core";

describe(('rxjs'), () => {

    beforeEach(() => {
    })

    it('of Observable', () => {
        let index = 0
        const array = [1, 5, 6]

        of(array).subscribe({
            next: (value => {
                expect(value).to.equal(array[index])
                index++
            }),
            complete: () => {
            },
            error: () => {
            },
        })

        index = 0
        of(array).subscribe((value => {
            expect(value).to.equal(array[index])
            index++
        }))
    })

    it('of Observable', () => {
        let index = 0
        const array = [1, 5, 6]

        of(array).subscribe({
            next: (value => {
                expect(value).to.equal(array[index])
                index++
            }),
            complete: () => {
            },
            error: () => {
            },
        })

        index = 0
        of(array).subscribe((value => {
            expect(value).to.equal(array[index])
            index++
        }))
    })

    it('http Observable', () => {
        http('https://jsonplaceholder.typicode.com/posts').subscribe((value => {
            expect(value?.length).to.equal(100)
        }))
    })

    it('map operator', () => {
        let index = 0
        const array = [1, 5, 6]
        const arrayResult = [2, 6, 7]

        of(array).pipe(map(value => value + 1)).subscribe((value => {
            expect(value).to.equal(arrayResult[index])
            index++
        }))
    })

    it('tap operator', () => {
        let index = 0
        const array = [1, 5, 6]
        const arrayResult = [1, 5, 6]
        let tapValue = 0

        of(array).pipe(tap(() => tapValue = tapValue + 1)).subscribe((value => {
            expect(value).to.equal(arrayResult[index])
            index++
        }))

        expect(tapValue).to.equal(3)
    })

    it('Subject', () => {
        let index = 0
        const array = [1, 2, 3]

        const subject = new Subject()

        subject.subscribe(value => {
            expect(value).to.equal(array[index])
            index++
        })
        subject.next(1)
        subject.next(2)

        subject.subscribe(value => {
            expect(value).to.equal(3)
        })
        subject.next(3)
    })

    it('ReplySubject', () => {
        let index = 0
        const array = [1, 2, 3]
        let indexTest = 0

        const replySubject = new ReplySubject()

        replySubject.subscribe(value => {
            expect(value).to.equal(array[index])
            index++
        })
        replySubject.next(1)
        replySubject.next(2)

        replySubject.subscribe(value => {
            expect(value).to.equal(array[indexTest])
            indexTest++
        })
        replySubject.next(3)
    })

    it('ReplySubject bufferSize', () => {
        let index = 0
        const array = [1, 2, 3]
        const arrayTest = [2, 3]
        let indexTest = 0

        const replySubject = new ReplySubject(1)

        replySubject.subscribe(value => {
            expect(value).to.equal(array[index])
            index++
        })
        replySubject.next(1)
        replySubject.next(2)

        replySubject.subscribe(value => {
            expect(value).to.equal(arrayTest[indexTest])
            indexTest++
        })
        replySubject.next(3)
    })

    it('BehaviorSubject bufferSize', () => {
        let index = 0
        const array = [12, 1, 2, 3]
        const arrayTest = [2, 3]
        let indexTest = 0

        const behaviorSubject = new BehaviorSubject(12)
        expect(behaviorSubject.getValue()).to.equal(12)

        behaviorSubject.subscribe(value => {
            expect(value).to.equal(array[index])
            index++
        })
        behaviorSubject.next(1)
        behaviorSubject.next(2)

        behaviorSubject.subscribe(value => {
            expect(value).to.equal(arrayTest[indexTest])
            indexTest++
        })
        behaviorSubject.next(3)
        expect(behaviorSubject.getValue()).to.equal(3)
    })
})