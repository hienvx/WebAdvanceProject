const bcrypt = require('bcrypt');
const db = require("./db");
const jwtHelper = require("./jwt.helper");
const AssociatedBank = require("../secrets/associated-bank.json");
let code = "KAT";

// Thời gian sống của access-token
const accessTokenLife = "1h";

const accessTokenSecret = AssociatedBank[code].secretKey;

// Thời gian sống của refreshToken
const refreshTokenLife = "3650d";

const refreshTokenSecret = AssociatedBank[code].secretKey;

/**
 * controller login
 * @param {*} req
 * @param {*} res
 */
let login = async (req, res) => {
        try {
            const userData = {
                account: req.body.account,
            };

            const userLogin = await db.Find("employees", {account: userData.account});
            if (userLogin.length > 0) {
                let hash = userLogin[0].pass;
                let loginSuccess = bcrypt.compareSync(req.body.password, hash); // true
                if (!loginSuccess) {
                    return res.status(200).json({"message": "Password Incorrect", status: false});
                }
            } else {
                return res.status(200).json({"message": "User invalid", status: false});
            }

            const accessToken = await
                jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);

            const refreshToken = await
                jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);
            const isUserHadToken = await
                db.Find("tokens", {account: userData.account});
            if (isUserHadToken.length == 0) {
                await
                    db.Insert("tokens", [{account: userData.account, accessToken, refreshToken}]);
            } else {
                await
                    db.Update("tokens", {accessToken, refreshToken}, {account: userData.account});
            }

            return res.status(200).json({accessToken, refreshToken, status: true});
        } catch (error) {
            return res.status(500).json({error, status: false});
        }
    }
;

module.exports = {
    login: login
};