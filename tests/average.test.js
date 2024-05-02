const { average } = require('../utils/for_testing');
const { test, describe } = require('node:test');
const assert = require('node:assert');

describe('average', () => {

  test('of 3, 4, 8 is 5', () => {
    const result = average([3, 4, 8]);
    assert.strictEqual(result, 5);
  });

  test('of one value is the value itself', () => {
    assert.strictEqual(average([8]), 8);
  });
  
  test('of empty array is zero', () => {
    assert.strictEqual(average([]), 0);
  });

});




