import { Deferred } from "../../src/projects/promise/core";

describe(('test Deferred class'), () => {
    let deferred: Deferred

    beforeEach(() => {
        deferred = new Deferred((resolve, reject) => {
            setTimeout(() => {
                resolve('test')
            })
        })
    })

    it('Deferred is created',() => {
        expect(deferred instanceof Deferred).to.equal(true)
    })

    it('first then value',() => {
        deferred.then(res => expect(res).to.equal('test'))
        cy.wait(0)
    })

    it('chain of then', () => {
        deferred.then(res => `${res} test`).then(res => expect(res).to.equal('test test'))
        cy.wait(0)
    })

    it('return Deferred', () => {
        deferred.then(res => new Deferred((resolve, reject) => {
            setTimeout(() => {
                resolve(`${res} test test`)
            })
        })).then(res => expect(res).to.equal('test test test'))
        cy.wait(0)
        cy.wait(0)
    })
})




