import { request, test, expect } from '@playwright/test';
let baseRequestUrl = 'http://localhost:2002/api';

test('Simple Get', async({request})=>{
    const resp = await request.get('http://localhost:2002/api/products/6');
    try{
        expect(resp.status()).toBe(200);
    } catch (error) {
        console.log(`Simple GET failed with ${resp.statusText()}` );
        throw error;
    }
});

test('Check GET response body', async({request})=>{
    const resp = await request.get(baseRequestUrl + '/products/1')
    try {
        expect.soft(resp.status()).toEqual(200) //soft asserts to allow multiple checks
        expect.soft(await resp.json()).toHaveProperty('price')
        expect.soft(await resp.json()).toMatchObject({
            "id": 1,
            "name": "iPad",
            "price": 500
          })

    } catch(error){
        console.log("Simple GET request failed with status :" + resp.statusText())
        throw error
    }
})