import { it, expect, describe } from 'vitest'
import { db } from './mocks/db'

describe('group', () => {
    it('should', async () => {
        
       const product = db.product.create()
console.log(product)
        expect(1).toBeTruthy()
    })
})