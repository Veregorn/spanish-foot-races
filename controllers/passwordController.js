const dotenv = require('dotenv');
dotenv.config();

exports.showPasswordForm = (req, res) => {
    res.render('password', { returnTo: req.query.returnTo, error: null });
};

exports.confirmPassword = (req, res) => {
    const { password, returnTo } = req.body;
    if (password === process.env.PASSWORD) {
        // Password is correct, proceed with the operation
        req.session.authenticated = true; // Store session info
        res.redirect(307, returnTo); // Redirect to the intended page
    } else {
        // Password is incorrect, show error message
        res.render('password', { returnTo, error: 'Incorrect password. Please try again.' })
    }
};