module.exports = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        req.session.returnTo = req.originalUrl;
        req.session.method = req.method; // Store the HTTP method
        req.session.body = req.body; // Store the request body
        console.log('Redirecting to password confirmation page');
        console.log('Method:', req.method);
        console.log('Body:', req.body);
        console.log('Original URL:', req.originalUrl);
        const returnTo = req.originalUrl;
        res.redirect(`/confirm-password?returnTo=${returnTo}`);
    }
};