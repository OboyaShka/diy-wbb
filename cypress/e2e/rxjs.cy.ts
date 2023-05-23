import { of, http } from "../../src/projects/rxjs/utils";
import { map } from "../../src/projects/rxjs/operators";

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
})