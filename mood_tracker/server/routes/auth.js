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
    if (user) return res.status(400).json({ message: 'Користувач з таким email вже існує' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ 
      email, 
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: 'user' 
    });
    
    await user.save();
    res.status(201).json({ message: 'Акаунт створено успішно' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера при реєстрації' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Невірний email або пароль' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Невірний email або пароль' });

  
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера при вході' });
  }
});

router.post('/connect-psychologist', auth, async (req, res) => {
  try {
    const { psychoEmail } = req.body;

    const psychologist = await User.findOne({ email: psychoEmail, role: 'psychologist' });
    if (!psychologist) {
      return res.status(404).json({ message: "Верифікованого психолога з таким email не знайдено" });
    }

    if (psychologist.patients.includes(req.user.id)) {
      return res.status(400).json({ message: "Ви вже підключені до цього спеціаліста" });
    }

    // Додаємо пацієнта психологу
    psychologist.patients.push(req.user.id);
    await psychologist.save();

    await User.findByIdAndUpdate(req.user.id, { psychologistId: psychologist._id });

    res.json({ message: `Ви успішно надали доступ спеціалісту: ${psychologist.name}` });
  } catch (err) {
    res.status(500).json({ message: "Помилка при підключенні до бази даних" });
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
    res.status(500).json({ message: 'Не вдалося оновити дані профілю' });
  }
});

module.exports = router;