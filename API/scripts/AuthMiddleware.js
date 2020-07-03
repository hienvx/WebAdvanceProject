const jwtHelper = require("./jwt.helper");
const AssociatedBank = require("../secrets/associated-bank.json");
let code = "KAT";
let db = require("../scripts/db");
const accessTokenSecret = AssociatedBank[code].secretKey;

/**
 * Middleware: Authorization user by Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let isAuth = async(req, res, next) =>
{
    // Lấy token được gửi lên từ phía client
    const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];

    if (tokenFromClient) {
        // Nếu tồn tại token
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await
            jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);

            const userLogin = await
            db.Find("tokens", {account: decoded.data.account});
            if (userLogin.length > 0) {

                if (tokenFromClient == userLogin[0].accessToken) {
                    return res.status(200).json({
                        message: 'User is logged',
                        status: true
                    });
                } else {
                    return res.status(200).json({
                        message: 'Token invalid',
                        status: false
                    });
                }

            } else {
                return res.status(200).json({
                    message: 'User invalid',
                    status: false
                });
            }
            /*            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
                        req.jwtDecoded = decoded;

                        // Cho phép req đi tiếp sang controller.
                        next();*/
        } catch (error) {
            // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
            return res.status(200).json({
                message: 'Unauthorized.',
                status: false
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
            status: false
        });
    }
}

module.exports = {
    isAuth: isAuth,
};