// isAdmin.js
module.exports = async function (req, res, proceed) {

    // const isUserAdmin = false;
    // if (isUserAdmin) {
    //     return proceed();   //proceed to the next policy,
    // }

    // if (req.session.username == 'admin') {
    //     return proceed();
    // }

    console.log("username",req.session.username);
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
        if (user.role == 'admin') {
            return proceed();
        }
    }

    //--•
    // Otherwise, this request did not come from a logged-in user.
    // return res.forbidden();

};