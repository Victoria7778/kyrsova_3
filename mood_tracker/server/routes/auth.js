const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); 

const isPasswordStrong = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return minLength && hasUpperCase && hasLowerCase && hasNumber;
};

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body; 

    if (!isPasswordStrong(password)) {
      return res.status(400).json({ 
        message: 'Пароль надто слабкий. Має бути мін. 8 символів, велика літера та цифра.' 
      });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Користувач вже існує' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ 
      email, 
      password: hashedPassword,
      name: name || email.split('@')[0] 
    });
    
    await user.save();

    res.status(201).json({ message: 'Користувача створено успішно' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Невірні дані' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Невірні дані' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name || '' } });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.put('/update-profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: { name } }, 
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Не вдалося оновити профіль' });
  }
});

router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!isPasswordStrong(newPassword)) {
      return res.status(400).json({ message: 'Новий пароль не відповідає вимогам безпеки.' });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Поточний пароль невірний' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Пароль успішно змінено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при зміні пароля' });
  }
});

module.exports = router;