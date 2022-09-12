import { apiClient} from "../../../api"
import{ApiControllers} from '../../../api/config';

const getCode = (AccountId, isResendOTP) => {
	return apiClient.get(
		ApiControllers.master + `SendOTP/${AccountId}/${isResendOTP}`
	);
};
const getVerification = (AccountId, code) => {
	return apiClient.get(
		ApiControllers.master + `OTPVerification/${AccountId}/${code}`
	);
};
const sendEmail = (AccountId, isResendOTP) => {
	return apiClient.get(
		ApiControllers.master + `SendEmailOTP/${AccountId}/${isResendOTP}`
	);
};

const verifyEmailCode = (AccountId, code) => {
	return apiClient.get(
		ApiControllers.master + `EmailOTPVerification/${AccountId}/${code}`
	);
};
const getAuthenticator = (Code, customerId) => {
	return apiClient.get(
		ApiControllers.master + `VerifyAuthenticator/${Code}/${customerId}`
	);
};
const getVerificationFields = (customerId) => {
	debugger
	return apiClient.get(
		ApiControllers.master + `Verificationfields/${customerId}`
	);
};

export {getCode,getVerification,sendEmail,verifyEmailCode,getAuthenticator,getVerificationFields}
