import { Input, Spin } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { convertCurrencyDuplicate } from '../../buy.component/buySellService';
import NumberFormat from 'react-number-format';
const LocalCryptoSwapper = (props, ref) => {
    const { localAmt = 0, cryptoAmt = 0, localCurrency = "USD", cryptoCurrency, onChange, sellData, selectedCoin = null } = props;
    const [isSwaped, setSwapped] = useState(props.isSwap || false);
    const [localvalue, setLocalValue] = useState(localAmt);
    const [cryptovalue, setCryptoValue] = useState(cryptoAmt);
    const [isConvertionLoad, setConvertionLoad] = useState(false);
    const [isInputChange, setInputChange] = useState(true);
    const [symbols] = useState({
        "EUR": "€",
        "USD": "$",
        "GBP": "£"
    });
    useImperativeHandle(ref, () => ({
        changeInfo(info) {
            setInputChange(true)
            setLocalValue(info.localValue);
            setCryptoValue(info.cryptoValue);
            setSwapped(true);
        },
        handleConvertion({ cryptoValue, localValue, locCurrency,isSwap }) {
            fetchConvertionValue({ cryptoValue, localValue, inputvalue: (isSwap|| isSwaped) ? cryptoValue : localValue, locCurrency });
            if (isSwaped) {
                setCryptoValue(cryptoValue);
            }
        },
        handleWalletChange() {
            setSwapped(false);
        }
    }), []);
    const fetchConvertionValue = async ({ inputvalue, locCurrency }) => {
        const coin = selectedCoin || sellData?.selectedCoin?.data?.coin;
        setConvertionLoad(true);
        const response = await convertCurrencyDuplicate({ from: coin, to: locCurrency || localCurrency || "USD", value: (inputvalue || 0), isCrypto: !isSwaped, memId: props.memberId, screenName: props.screenName });
        if (response.ok) {
            const { data: value, config: { url } } = response;
            const _obj = url.split("CryptoFiatConverter")[1].split("/");
            let _val = document.getElementById("ABC")?.value;
            _val = _val ? _val.replace(/,/g, "") : _val;
            _val = _val?.replace(symbols[locCurrency||localCurrency], "");
            if (_obj[4] == _val || _obj[4] == 0) {
                if (!isSwaped) {
                    setCryptoValue(value || 0);
                } else { setLocalValue(value || 0) }
                onChange({ cryptoValue: isSwaped ? inputvalue : value, localValue: isSwaped ? value : inputvalue, isSwaped });
                setConvertionLoad(false);
            }
        } else {
            setConvertionLoad(false);
        }


    }
    return <div className="p-relative">
        <div className="enter-val-container">
            <Text className="fs-30 fw-400 text-white-30 text-yellow mr-4">{!isSwaped ? localCurrency : cryptoCurrency}</Text>
            <NumberFormat id="ABC" className="fw-400 text-white-30 text-center enter-val p-0" maxLength={25} customInput={Input} thousandSeparator={true} prefix={isSwaped ? "" : symbols[localCurrency]}
                decimalScale={isSwaped ? 8 : 2}
                autoComplete="off"
                placeholder="0.00"
                bordered={false}
                style={{ lineHeight: '48px', fontSize: 30, paddingRight: '40px !important' }}
                onPaste={() => setInputChange(true)}
                onKeyPress={(e) => {
                    e.currentTarget.style.fontSize = "30px";
                    setInputChange(true)
                }}
                value={isSwaped ? cryptovalue : localvalue}
                onValueChange={({ value }) => {
                    if (isSwaped) {
                        setCryptoValue(value);
                    } else {
                        setLocalValue(value)
                    }
                    if (isInputChange) {
                        fetchConvertionValue({ cryptoValue: cryptovalue, localValue: localvalue, inputvalue: value });
                    } else {
                        setInputChange(true)
                    }
                }}
                autoFocus
            />
        </div>
        <NumberFormat value={isSwaped ? localvalue : cryptovalue} displayType={'text'} thousandSeparator={true} prefix={isSwaped ? symbols[localCurrency] : ""} renderText={(value, props) => <div {...props} className="fs-14 text-white-30 text-center d-block mb-36">{value} {isSwaped ? localCurrency : cryptoCurrency} {isConvertionLoad && <Spin size="small" />}</div>
        } />
        <span className="val-updown c-pointer" onClick={() => { setInputChange(false); isSwaped ? setSwapped(false) : setSwapped(true) }}>
            <span className="icon md swaparrow" />
        </span>
    </div>

}
export default forwardRef(LocalCryptoSwapper);