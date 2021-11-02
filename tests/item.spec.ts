import { expect } from 'chai';
import 'mocha';

describe('Item Unit Tests', () =>{

  it('add', async () => {
    //const promise: IItem[] = await itemService.findAll();
    // eslint-disable-next-line no-console
   // console.log(promise)
    let result = 3+4;
    expect(result).to.eq(7);
  });
});
