import moment from "moment";


export const userAdapter = (apiUser) => {
    const user = {
        id: apiUser.session.user.id,
        role: apiUser.user.role ? apiUser.user.role : "",
        email: apiUser.user.email ? apiUser.user.email : "",
        lastSignIn: apiUser.user.last_sign_in_at ? moment(apiUser.user.last_sign_in_at).format("L") : moment().format("L"),
        token: apiUser.session.access_token,
    }
    return user;
}