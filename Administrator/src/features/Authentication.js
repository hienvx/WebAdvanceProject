const axios = require('axios').default;

export async function CheckAuth() {
    return await axios.post("http://localhost:3000/accounts/Auth/isAuth", {
        token: localStorage.getItem("accessToken_Admin_KAT")
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
};

export async function Logout() {

    await axios.post("http://localhost:3000/accounts/Auth/logout", {
        token: localStorage.getItem("refreshToken_Admin_KAT")
    })
        .then(function (response) {
            // handle success
            if (response.data.status) {
                localStorage.removeItem("accessToken_Admin_KAT");
                localStorage.removeItem("refreshToken_Admin_KAT");
                window.location = "/login";
            }
        })
        .catch(function (error) {
            return false;
        });
}

export async function SignUp(state) {

    return await axios.post("http://localhost:3000/accounts/Auth/login", {
        account: state.userName,
        password: state.password
    })
        .then(function (response) {
            // handle success
            if (response.data.status) {
                localStorage.setItem("accessToken_Admin_KAT", response.data.accessToken);
                localStorage.setItem("refreshToken_Admin_KAT", response.data.refreshToken);
                window.location = "/home";
            } else {
                return response.data.message;
            }
        });
}