import { apiClient} from "../../../api"
import{ApiControllers} from '../../../api/config';

const getCode = ( isResendOTP) => {
	return apiClient.get(
		ApiControllers.master + `SendOTP/${isResendOTP}`
	);
};
const getVerification = ( code) => {
	return apiClient.get(
		ApiControllers.master + `OTPVerification/${code}`
	);
};
const sendEmail = ( isResendOTP) => {
	return apiClient.get(
		ApiControllers.master + `SendEmailOTP/${isResendOTP}`
	);
};

const verifyEmailCode = ( code) => {
	return apiClient.get(
		ApiControllers.master + `EmailOTPVerification/${code}`
	);
};
const getAuthenticator = (Code) => {
	return apiClient.get(
		ApiControllers.master + `VerifyAuthenticator/${Code}`
	);
};
const getVerificationFields = () => {
	return apiClient.get(
		ApiControllers.master + `Verificationfields`
	);
};

export {getCode,getVerification,sendEmail,verifyEmailCode,getAuthenticator,getVerificationFields}
