import { fetchCurrencyConvertionValue } from "./api"
import apicalls from "../../api/apiCalls";

export const convertCurrency = async ({ from, to, value, isCrypto, memId, screenName }) => {
    const response = await fetchCurrencyConvertionValue({ from, to, value, isCrypto, memId, screenName });
    if (response.ok) {
        return response.data;
    } else {
        return 0;
    }
}
export const convertCurrencyDuplicate = async ({ from, to, value, isCrypto, memId, screenName }) => {
    const response = await fetchCurrencyConvertionValue({ from, to, value, isCrypto, memId, screenName });
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
    debugger;
    const maxPurchaseAmt = 100000;
    const maxAmtMessage = "$100,000"
    const currencyMaxPurchase = {
        GBP: gbpInUsd * localValue,
        EUR: localValue * eurInUsd,
        USD:localValue
    }
    if (!localValue || !cryptValue) {
        validate.message = apicalls.convertLocalLang('enter_wallet')
        validate.valid = false;
    } else if (!wallet) {
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
            validate.message = apicalls.convertLocalLang('purchase_min') + " " + minPurchase
        } else if (cryptValue > maxPurchase) {
            validate.valid = false;
            validate.message = apicalls.convertLocalLang('purchase_max') + " " + maxPurchase
        }
        else if (currencyMaxPurchase[wallet?.currencyCode] > maxPurchaseAmt) {
            validate.valid = false;
            validate.message = apicalls.convertLocalLang('purchase_max') + " " + maxAmtMessage
        }
    }
    return validate;
}