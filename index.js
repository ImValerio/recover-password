const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

require('./db/connection') //Connect to DB
const app = express();

app.use(morgan('tiny'));
app.use(express.json());

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const cryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: cryptedPassword });
        await newUser.save();

        res.status(200).json({ msg: "User signed in!" })
    } catch (err) {
        console.log(err);

        res.status(400).json({ msg: 'Error with the sign in' });
    }

})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect) {
            return res.status(200).json({ msg: 'Logged in!' })
        }

        res.status(400).json({ msg: 'Login failed' })

    } catch (error) {
        console.log(error);

        res.status(400).json({ msg: 'Error with login' });
    }
})

app.post('/lost-password', (req, res) => {
    const { username } = req.body;

    const token = jwt.sign({ data: username }, 'secret', { expiresIn: '15min' });

    res.status(200).json({ token });
})

app.post('/lost-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body

    try {
        const decoded = jwt.verify(token, 'secret');
        const password = await bcrypt.hash(newPassword, 10);
        console.log(`Generated new password: ${password}`)
        const ris = await User.updateOne({ username: decoded.data }, { password })
        console.log(ris.modifiedCount)
        res.status(200).json({ msg: 'Password changed correctly!' })

    } catch (err) {
        console.log(err)
        res.status(404).json({ msg: 'Page not found' })
    }
})

const PORT = process.env.PORT || 3030;

app.listen(PORT, console.log(`Listening on port ${PORT}`))