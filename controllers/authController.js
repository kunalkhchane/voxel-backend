const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    
    if (!admin) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const payload = {
      admin: {
        id: admin.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '10h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.checkSetup = async (req, res) => {
  try {
    const count = await Admin.count();
    res.json({ isSetup: count > 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.setupAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const count = await Admin.count();
    if (count > 0) {
      return res.status(403).json({ error: 'Admin already setup. Use dashboard to add more admins.' });
    }
    
    const admin = await Admin.create({ email, password });
    res.status(201).json({ message: 'Initial Admin created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await Admin.findOne({ where: { email } });
    if (admin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    
    admin = await Admin.create({ email, password });
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
