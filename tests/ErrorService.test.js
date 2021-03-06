const ErrorService = require('../src/ErrorService');

test('parses full error field', () => {
  expect(ErrorService.parseError({ error: 'hello world' })).not.toBe(null);
});

test('parses empty error field', () => {
  expect(ErrorService.parseError({ data: 'hello world' })).toBe(null);
});
