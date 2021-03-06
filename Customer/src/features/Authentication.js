const axios = require("axios").default;

export async function CheckAuth() {
    return await axios
        .post("http://localhost:3000/accounts/Auth/isAuth", {
            token: localStorage.getItem("accessToken_Employee_KAT"),
        })
        .then(function (response) {
            if (!response.data.status) {
                window.location = "/login";
            }
        })
        .catch(function (error) {
            // handle error
            window.location = "/login";
        });
}

export async function Logout() {
    await axios
        .post("http://localhost:3000/accounts/Auth/logout", {
            token: localStorage.getItem("refreshToken_Employee_KAT"),
        })
        .then(function (response) {
            // handle success
            if (response.data.status) {
                localStorage.removeItem("accessToken_Employee_KAT");
                localStorage.removeItem("refreshToken_Employee_KAT");
                window.location = "/login";
            }
        })
        .catch(function (error) {
            return false;
        });
}

let getNumberAccount = async function (account) {
    let ret = ""
    await axios.get("http://localhost:3000/customers/getNumberAccount/" + account).then(result => ret = result.data);
    return ret;
    //return "1595678365"
}

export async function SignIn(state) {
    return await axios
        .post("http://localhost:3000/customers/login", {
            account: state.userName,
            pass: state.password,
            recaptchaToken: state.recaptchaToken,
        })
        .then(async function (response) {
            // handle success
            if (response.data.status) {
                localStorage.setItem(
                    "accessToken_Employee_KAT",
                    response.data.accessToken
                );
                localStorage.setItem(
                    "numberAccountCustomer",
                    await getNumberAccount(state.userName)
                );
                localStorage.setItem(
                    "refreshToken_Employee_KAT",
                    response.data.refreshToken
                );
                window.location = "/home";
            } else {
                return response.data.message;
            }
        });
}

export async function SignUp(state) {
    return await axios
        .post("http://localhost:3000/customers", {
            account: state.userName,
            pass: state.password,
            profile: {
                fullName: state.fullName,
                email: state.email,
                phone: state.phone,
            },
            paymentAccount: {
                currentBalance: state.paymentAccount.currentBalance,
            },
            savingAccount: state.savingAccount,
        })
        .then(function (response) {
            // handle success
            return response.data;
        })
        .catch(() => {
            return {status: false, message: "An error occurred"};
        });
}
