const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { username, password } = req.body;

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  const secret    = process.env.JWT_SECRET;

  if (username !== validUser || password !== validPass) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username }, secret, { expiresIn: '8h' });

  res.status(200).json({ success: true, token });
};

module.exports = { login };