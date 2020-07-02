const db = require("../scripts/db");
const jwtHelper = require("../scripts/jwt.helper");
const AssociatedBank = require("../secrets/associated-bank.json");
let code = "KAT";

// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
let tokenList = {};

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
    // Mình sẽ comment mô tả lại một số bước khi làm thực tế cho các bạn như sau nhé:
    // - Đầu tiên Kiểm tra xem email người dùng đã tồn tại trong hệ thống hay chưa?
    // - Nếu chưa tồn tại thì reject: User not found.
    // - Nếu tồn tại user thì sẽ lấy password mà user truyền lên, băm ra và so sánh với mật khẩu của user lưu trong Database
    // - Nếu password sai thì reject: Password is incorrect.
    // - Nếu password đúng thì chúng ta bắt đầu thực hiện tạo mã JWT và gửi về cho người dùng.
    // Trong ví dụ demo này mình sẽ coi như tất cả các bước xác thực ở trên đều ok, mình chỉ xử lý phần JWT trở về sau thôi nhé:

    const userData = {
      account: "nhutthanh341",
    };

    const accessToken = await jwtHelper.generateToken(
      userData,
      accessTokenSecret,
      accessTokenLife
    );

    const refreshToken = await jwtHelper.generateToken(
      userData,
      refreshTokenSecret,
      refreshTokenLife
    );
    const isUserHadToken = await db.Find("tokens", {
      account: userData.account,
    });
    if (isUserHadToken.length == 0) {
      await db.Insert("tokens", [
        { account: userData.account, accessToken, refreshToken },
      ]);
    } else {
      await db.Update(
        "tokens",
        { accessToken, refreshToken },
        { account: userData.account }
      );
    }

    // Lưu lại refresh-token và access-token tại server
    tokenList[refreshToken] = { accessToken, refreshToken };

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * controller register
 * @param {*} req
 * @param {*} res
 */
let register = async (req, res) => {
  try {
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * controller refreshToken
 * @param {*} req
 * @param {*} res
 */
let refreshToken = async (req, res) => {
  // User gửi mã refresh token kèm theo trong body
  const refreshTokenFromClient = req.body.refreshToken;
  const refreshTokensFromServer = await db.Find("tokens", {
    refreshToken: refreshTokenFromClient,
  });
  if (refreshTokensFromServer.length == 0) {
    return res.status(403).send({
      message: "No token from server.",
    });
  }
  // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList
  if (refreshTokenFromClient && refreshTokensFromServer[0]) {
    try {
      // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
      const decoded = await jwtHelper.verifyToken(
        refreshTokenFromClient,
        refreshTokenSecret
      );

      // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
      const userFakeData = decoded.data;
      const accessToken = await jwtHelper.generateToken(
        userFakeData,
        accessTokenSecret,
        accessTokenLife
      );
      await db.Update(
        "tokens",
        { accessToken },
        { refreshToken: refreshTokenFromClient }
      );
      // gửi token mới về cho người dùng
      return res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({
        message: "Invalid refresh token.",
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: "No token provided.",
    });
  }
};

module.exports = {
  login: login,
  refreshToken: refreshToken,
  register: register,
};
