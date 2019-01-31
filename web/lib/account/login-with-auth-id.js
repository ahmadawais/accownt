import request from 'superagent';

/**
 * Check if auth token linked to `userId` and `authId` has been verified.
 * Redirect to provided link if token has been verified.
 * @param {number} userId
 * @param {string} authId
 */
export default function(userId, authId) {
  // 10 minutes in the future
  const stopAfter = Date.now() + 60 * 10 * 1000;

  const check = () =>
    request
      .post('/api/login/auth-id')
      .send({
        userId,
        authId
      })
      .end((err, res) => {
        if (!err) location.replace(res.body.redirect);
        else if (Date.now() < stopAfter) check();
        else location.href = '/login';
      });
  check();
}