import { fetchCurrencyConvertionValue } from "./api"
import apicalls from "../../api/apiCalls";

export const convertCurrency = async ({ from, to, value, isCrypto, customer_id, screenName }) => {
    const response = await fetchCurrencyConvertionValue({ from, to, value, isCrypto, customer_id, screenName });
    if (response.ok) {
        return response.data;
    } else {
        return 0;
    }
}
export const convertCurrencyDuplicate = async ({ from, to, value, isCrypto, customer_id, screenName }) => {
    const response = await fetchCurrencyConvertionValue({ from, to, value, isCrypto, customer_id, screenName });
    if (response.ok) {
        return response;
    } else {
        return 0;
    }
}
export const validatePreview = ({ localValue, cryptValue, wallet, minPurchase, maxPurchase, eurInUsd, gbpInUsd }) => {
    const validate = {
        message: null,
        valid: true
    };
    const maxPurchaseAmt = 100000;
    const maxAmtMessage = "$100k"
    // const currencyMaxPurchase = {
    //     GBP: gbpInUsd * parseFloat(localValue),
    //     EUR: parseFloat(localValue) * eurInUsd,
    //     USD: parseFloat(localValue)
    // }
    if (localValue === ""|| cryptValue === "") {
        validate.message = apicalls.convertLocalLang('enter_wallet')
        validate.valid = false;
    }
    else if (localValue === "0" || cryptValue === "0"|| localValue === "0") {
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
            validate.message = apicalls.convertLocalLang('purchase_min') + " " + minPurchase + ". " + "Please contact support for more details."
        } 
        else if (parseFloat(localValue) > maxPurchaseAmt || cryptValue > maxPurchaseAmt) {
            validate.valid = false;
            validate.message = apicalls.convertLocalLang('purchase_max') + " " + maxAmtMessage + ". " + "Please contact support for higher amounts."
        }
        else if (cryptValue > maxPurchase) {
            validate.valid = false;
            validate.message = apicalls.convertLocalLang('purchase_max') + " " + maxPurchase + ". " + "Please contact support for higher amounts."
        }
       
    }
    return validate;
}