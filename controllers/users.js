const User = require('../models/user')

const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', `Welcome to yelpcamp, ${username}!`)
            res.redirect('/campgrounds')
        })

    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}

const registerForm = (req, res) => {
    res.render('users/register')
}

const login = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

const loginForm = (req, res) => {
    res.render('users/login')
}

const logout = (req, res) => {
    req.logout()
    req.flash('success', "Goodbye!")
    res.redirect('/campgrounds')
}

module.exports = {
    logout,
    login,
    register,
    registerForm,
    loginForm
}