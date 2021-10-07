import { Input, Spin } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { convertCurrencyDuplicate } from '../../buy.component/buySellService';
import QueryString from 'query-string';
import NumberFormat from 'react-number-format';
const LocalCryptoSwapper = (props, ref) => {
    const { localAmt = 0, cryptoAmt = 0, localCurrency = "USD", cryptoCurrency, onChange, sellData, selectedCoin = null } = props;
    const [isSwaped, setSwapped] = useState(props.isSwap || false);
    const [localvalue, setLocalValue] = useState(localAmt);
    const [cryptovalue, setCryptoValue] = useState(cryptoAmt);
    const [isConvertionLoad, setConvertionLoad] = useState(false);
    const [isInputChange, setInputChange] = useState(true);
    useImperativeHandle(ref, () => ({
        changeInfo(info) {
            setInputChange(true)
            setLocalValue(info.localValue);
            setCryptoValue(info.cryptoValue);
        },
        handleConvertion({ cryptoValue, localValue }) {
            fetchConvertionValue({ cryptoValue, localValue, inputvalue: isSwaped ? cryptoValue : localValue });
            if (isSwaped) {
                setCryptoValue(cryptoValue);
            }
        }
    }), []);
    const fetchConvertionValue = async ({ inputvalue }) => {
        const coin = selectedCoin || sellData?.selectedCoin?.data?.coin;
        setConvertionLoad(true);
        const response = await convertCurrencyDuplicate({ from: coin, to: localCurrency || "USD", value: (inputvalue || 0), isCrypto: !isSwaped, memId: props.memberId, screenName: props.screenName });
        if (response.ok) {
            const { data: value, config: { url } } = response;
            const _obj = QueryString.parse("?" + url.split("?")[1]);
            let _val = document.getElementById("ABC").value;
            _val = _val ? _val.replace(/,/g, "") : _val;
            _val = _val.replace("$", "");
            if (_obj.amount == _val) {
                if (!isSwaped) {
                    setCryptoValue(value || 0);
                } else { setLocalValue(value || 0) }
                onChange({ cryptoValue: isSwaped ? inputvalue : value, localValue: isSwaped ? value : inputvalue, isSwaped });
            }
        }
        setConvertionLoad(false);

    }
    return <div className="p-relative">
        <div className="enter-val-container">
            <Text className="fs-30 fw-100 text-white-30 text-defaultylw mr-4">{!isSwaped ? localCurrency : cryptoCurrency}</Text>
            <NumberFormat id="ABC" className="fw-100 text-white-30 text-center enter-val p-0" maxLength={25} customInput={Input} thousandSeparator={true} prefix={isSwaped ? "" : "$"}
                decimalScale={isSwaped ? 8 : 2}
                placeholder="0.00"
                bordered={false}
                style={{ lineHeight: '48px', fontSize: 30, paddingRight: '40px !important' }}
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
        <NumberFormat value={isSwaped ? localvalue : cryptovalue} displayType={'text'} thousandSeparator={true} prefix={isSwaped ? '$' : ""} renderText={(value, props) => <div {...props} className="fs-14 text-white-30 fw-200 text-center d-block mb-36">{value} {isSwaped ? localCurrency : cryptoCurrency} {isConvertionLoad && <Spin size="small" />}</div>
        } />
        <span className="val-updown c-pointer" onClick={() => { setInputChange(false); isSwaped ? setSwapped(false) : setSwapped(true) }}>
            <span className="icon md swaparrow" />
        </span>
    </div>

}
export default forwardRef(LocalCryptoSwapper);