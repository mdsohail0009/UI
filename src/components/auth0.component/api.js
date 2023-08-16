import { apiClient } from "../../api"
import { ApiControllers } from "../../api/config"



const saveCustomer = (obj) => {
    return apiClient.put(ApiControllers.customers + 'SaveUser', obj);
}
const resendEmail = () => {
    return apiClient.get(ApiControllers.customers + "VerifyEmail")
}
const sendOtp = (type) => {
    return apiClient.get(ApiControllers.master + "SendOTP/" + type)
}
const verifyOtp = (otp) => {
    return apiClient.get(ApiControllers.customers + "PhoneVerification/" + otp)
}
const referalCode = (code)=>{
    return apiClient.get(ApiControllers.customers + "GetReferralMemberDetails/" + code)
}
export { saveCustomer, resendEmail, sendOtp, verifyOtp, referalCode }