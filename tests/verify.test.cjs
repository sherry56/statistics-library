const test = require('node:test');
const assert = require('node:assert/strict');

test('verification accepts the admin identifier only with its roster name', async () => {
  const { onRequestPost } = await import('../functions/api/verify.js');
  const env = {
    ROSTER_JSON: JSON.stringify([
      ['admin', 'Admin Test Name'],
      ['12345678', 'Student Test Name']
    ])
  };
  const verify = (studentId, studentName) => onRequestPost({
    request: new Request('https://example.test/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, studentName })
    }),
    env
  });

  assert.equal((await verify('admin', 'Admin Test Name')).status, 200);
  assert.equal((await verify('ADMIN', 'Admin Test Name')).status, 200);
  assert.equal((await verify('admin', 'Wrong Name')).status, 401);
  assert.equal((await verify('not-an-account', 'Admin Test Name')).status, 400);
  assert.equal((await verify('12345678', 'Student Test Name')).status, 200);
});
