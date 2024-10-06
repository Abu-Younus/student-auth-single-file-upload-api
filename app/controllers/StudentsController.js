import {
    loginService,
    logOutService,
    profileReadService, profileUpdateService,
    registrationService, resetPasswordService,
    verifyEmailService, verifyOTPService
} from "../service/StudentServices.js";

//registration
export const registration = async (req, res) => {
    let result = await registrationService(req, res)
    return res.json(result);
}
//login
export const login = async (req, res) => {
    let result = await loginService(req, res)
    return res.json(result)
}

//profile read
export const profileRead = async (req, res) => {
    let result = await profileReadService(req)
    return res.json(result);
}

//profile update
export const profileUpdate = async (req, res) => {
    let result = await profileUpdateService(req,res)
    return res.json(result);
}

//logout
export const logout = async (req, res) => {
    let result = await logOutService(res)
    return res.json(result)
}
//verify email
export const verifyEmail = async (req, res) => {
    let result = await verifyEmailService(req)
    return res.json(result);
}
//verify otp
export const verifyOTP = async (req, res) => {
    let result = await verifyOTPService(req)
    return res.json(result);
}
//reset password
export const resetPassword = async (req, res) => {
    let result = await resetPasswordService(req)
    return res.json(result);
}