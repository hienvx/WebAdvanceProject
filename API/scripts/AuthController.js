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

            const userLogin = await db.Find("administrators", {account: userData.account});
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
/**
 * controller logout
 * @param {*} req
 * @param {*} res
 */
let logout = async (req, res) => {
        try {

            const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
            console.log(tokenFromClient);
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);

            await db.Delete("tokens", {account: decoded.data.account});

            return res.status(200).json({"message": "User logged", "status": true});
        } catch (error) {
            return res.status(500).json({error, "status": false});
        }
    }
;
/**
 * controller refreshToken
 * @param {*} req
 * @param {*} res
 */
let refreshToken = async (req, res) => {
        // User gửi mã refresh token kèm theo trong body
        const refreshTokenFromClient = req.body.refreshToken;
        const refreshTokensFromServer = await
            db.Find("tokens", {refreshToken: refreshTokenFromClient});
        if (refreshTokensFromServer.length == 0) {
            return res.status(403).send({
                message: 'No token from server.',
            });
        }
        // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList
        if (refreshTokenFromClient && refreshTokensFromServer[0]) {
            try {
                // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
                const decoded = await
                    jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);

                // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
                const userData = decoded.data;
                const accessToken = await
                    jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
                await
                    db.Update("tokens", {accessToken}, {refreshToken: refreshTokenFromClient});
                // gửi token mới về cho người dùng
                return res.status(200).json({accessToken});
            } catch (error) {
                res.status(403).json({
                    message: 'Invalid refresh token.',
                });
            }
        } else {
            // Không tìm thấy token trong request
            return res.status(403).send({
                message: 'No token provided.',
            });
        }
    }
;


module.exports = {
    login: login,
    refreshToken: refreshToken,
    logout: logout
};