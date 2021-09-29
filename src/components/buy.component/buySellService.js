import { fetchCurrencyConvertionValue } from "./api"

export const convertCurrency = async ({ from, to, value, isCrypto ,memId,screenName}) => {
    const response = await fetchCurrencyConvertionValue({ from, to, value, isCrypto,memId,screenName });
    if (response.ok) {
        return response.data;
    } else {
        return 0;
    }
}
export const validatePreview = ({ localValue, cryptValue, wallet, minPurchase, maxPurchase }) => {
    const validate = {
        message: null,
        valid: true
    };
    if (!localValue || !cryptValue) {
        validate.message = "Please enter amount to buy";
        validate.valid = false;
    } else if (!wallet) {
        validate.message = "Please select wallet to proceed";
        validate.valid = false;
    }
    else if (wallet.avilable < localValue) {
        validate.message = "Insufficient funds";
        validate.valid = false;
    }
    else {
        if (cryptValue < minPurchase) {
            validate.valid = false;
            validate.message = `You have to purchase for minimum of ${minPurchase}`
        } else if (cryptValue > maxPurchase) {
            validate.valid = false;
            validate.message = `You can only purchase for maximum of ${maxPurchase}`
        }
    }
    return validate;
}