// isClient.js
module.exports = async function (req, res, proceed) {

    // const isUserClient = false;

    if (!req.session.username) {
        // console.log("isAdmin: "+req.wantsJSON);
        if (req.wantsJSON) {
            return res.forbidden();
        } else {
            alert("Please Login First");
            return res.view('user/login');
        }
        // return res.view('user/login'); 
    }

    var user = await User.findOne({ username: req.session.username });

    if (user) {
        if (user.role == 'client' || user.role == 'admin') {
            return proceed();
        }
    }

    // return res.forbidden();

};