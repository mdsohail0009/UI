import { fetchCurrencyConvertionValue } from "./api"
import apicalls from "../../api/apiCalls";

export const convertCurrency = async ({ from, to, value, isCrypto, screenName }) => {
    const response = await fetchCurrencyConvertionValue({ from, to, value, isCrypto,  screenName });
    if (response.ok) {
        return response.data;
    } else {
        return 0;
    }
}
export const convertCurrencyDuplicate = async ({ from, to, value, isCrypto,  screenName }) => {
    const response = await fetchCurrencyConvertionValue({ from, to, value, isCrypto,  screenName });
    if (response.ok) {
        return response;
    } else {
        return 0;
    }
}
export const validatePreview = ({ localValue, cryptValue, wallet, minPurchase, maxPurchase,coin }) => {
    const validate = {
        message: null,
        valid: true
    };
    if (localValue === ""|| cryptValue === "") {
        validate.message = apicalls.convertLocalLang('enter_wallet')
        validate.valid = false;
    }
    else if (localValue === "0" || cryptValue === "0" ||cryptValue===undefined) {
        validate.message = apicalls.convertLocalLang('amount_greater_zero')
        validate.valid = false;
    }
    else if (!wallet) {
        validate.message = apicalls.convertLocalLang('select_wallet1')
        validate.valid = false;
    }
    else if (wallet.avilable < localValue) {
        validate.message = apicalls.convertLocalLang('insufficientFunds')
        validate.valid = false;
    }
    else {
        if (cryptValue < minPurchase) {
            validate.valid = false;
            validate.message = apicalls.convertLocalLang('purchase_min') + " " + minPurchase + " " + coin
        } 
        else if (cryptValue > maxPurchase) {
            validate.valid = false;
            validate.message = apicalls.convertLocalLang('purchase_max') + " " +  `${maxPurchase===350000?"350,000":maxPurchase}`  +" "+ coin + ". " + "Please contact support for higher amounts."
        }
       
    }
    return validate;
}