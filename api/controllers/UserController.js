/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 * @type {{ [name: string]: import('express').RequestHandler }}
 */

module.exports = {

    login: async function (req, res) {

        // console.log(req.headers.referer);
        // console.log("login "+req.body);

        if (req.method == "GET") return res.view('user/login');

        if (!req.body.username || !req.body.password) return res.badRequest();

        var user = await User.findOne({ username: req.body.username });

        if (!user) return res.status(401).send("User not found");

        // if (user.password != req.body.password)
        // return res.status(401).send("Wrong Password");

        const match = await sails_bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(401).send("Wrong Password");

        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.username = req.body.username;
            req.session.role = user.role;
            req.session.userid = user.id;

            // sails.log("[Session] ", req.session);

            // return res.ok("Login successfully.");
            // return res.json({url: req.headers.referer, message: "Login successfully."});
            return res.json({ url: req.body.url, message: "Login successfully." });
        });
    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {
            if (err) return res.serverError(err);

            // return res.ok("Log out successfully.");
            return res.json({ url: req.headers.referer, message: "Login successfully." });
        });
    },

    register: async function (req, res) {
        if (req.method == "GET") {
            return res.view("user/register");
        }

        if (!req.body)
            return res.badRequest("Form-data not received.");

        var model = req.body;
        model.password = await sails_bcrypt.hash(model.password, 10);

        // console.log(model);

        thatUser = await User.find({
            where: { username: model.username }
        });

        // console.log(thatUser.length)
        if (thatUser.length == 0) {
            await User.create(model);
            return res.ok("Successfully register!");
        } else {
            return res.status(401).send("userName has exist");
        }
    },

};

