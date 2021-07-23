import { fetchCurrencyConvertionValue,getMemberfiat } from "./api"

export const convertCurrency = async ({ from, to, value, isCrypto }) => {
    const response = await fetchCurrencyConvertionValue({ from, to, value, isCrypto });
    if (response.ok) {
        return response.data;
    } else {
        return 0;
    }
}