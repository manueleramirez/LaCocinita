import moment from "moment";


export const userAdapter = (apiUser) => {
    const user = {
        id: apiUser.session.user.id,
        role: apiUser.session.user.role ? apiUser.session.user.role : "",
        email: apiUser.session.user.email ? apiUser.session.user.email : "",
        name: apiUser.session.user.user_metadata?.full_name || apiUser.session.user.user_metadata?.name || "",
        avatar: apiUser.session.user.user_metadata?.avatar_url || apiUser.session.user.user_metadata?.picture || "",
        lastSignIn: apiUser.session.user.last_sign_in_at ? moment(apiUser.session.user.last_sign_in_at).format("L") : moment().format("L"),
        token: apiUser.session.access_token,
    }
    return user;
}