
module.exports = {
    // C check if a user is authenticated or not.
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/');
    }
}