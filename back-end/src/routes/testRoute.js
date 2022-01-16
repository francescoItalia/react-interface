export const testRoute = {
  path: '/api/test',
  method: 'get',
  handlers: [(req, res) => res.status(200).send('It works!')],
};
