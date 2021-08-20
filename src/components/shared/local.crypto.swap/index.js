import { Input } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { convertCurrency } from '../../buy.component/buySellService';
import NumberFormat from 'react-number-format';
const LocalCryptoSwapper = (props, ref) => {
    const { localAmt = 0, cryptoAmt = 0, localCurrency = "USD", cryptoCurrency, onChange, sellData, selectedCoin = null } = props;
    const [isSwaped, setSwapped] = useState(false);
    const [localValue, setLocalValue] = useState(localAmt);
    const [cryptoValue, setCryptoValue] = useState(cryptoAmt);
    useImperativeHandle(ref, () => ({
        changeInfo(info) {
            setLocalValue(info.localValue);
            setCryptoValue(info.cryptoValue);
        }
    }), []);
    const fetchConvertionValue = async ({ cryptoValue, localValue }) => {
        const coin = selectedCoin || sellData?.selectedCoin?.data?.coin;
        const value = await convertCurrency({ from: coin, to: "USD", value: isSwaped ? cryptoValue : localValue, isCrypto: !isSwaped })
        if (!isSwaped) {
            setCryptoValue(value);
        } else { setLocalValue(value) }
        onChange({ cryptoValue, localValue, [isSwaped ? "localValue" : "cryptoValue"]: value, isSwaped });
    }

    return <div className="p-relative">
        <div className="enter-val-container">
            <Text className="fs-30 fw-100 text-white-30 text-defaultylw mr-4">{!isSwaped ? localCurrency : cryptoCurrency}</Text>
            <NumberFormat className="fw-100 text-white-30 text-center enter-val p-0" maxLength={25} customInput={Input} thousandSeparator={true} prefix={isSwaped ? "" : "$"}
                placeholder="0.00"
                bordered={false}
                style={{ lineHeight: '48px', fontSize: 30, paddingRight: '40px !important' }}
                onKeyPress={(e) => {
                    e.currentTarget.value.length >= 8 ? e.currentTarget.style.fontSize = "30px" : e.currentTarget.style.fontSize = "30px"
                }}
                value={isSwaped ? cryptoValue : localValue}
                //defaultValue={isSwaped ? cryptoValue : localValue}
                onValueChange={({ value }) => {
                    if (isSwaped) {
                        setCryptoValue(value);
                    } else { setLocalValue(value) }
                    fetchConvertionValue({ cryptoValue, localValue, [isSwaped ? "cryptoValue" : "localValue"]: value });

                }}
                autoFocus
            />
        </div>
        <NumberFormat value={isSwaped ? localValue : cryptoValue} displayType={'text'} thousandSeparator={true} prefix={isSwaped ? '$' : ""} renderText={(value, props) => <div {...props} className="fs-14 text-white-30 fw-200 text-center d-block mb-36">{value} {isSwaped ? localCurrency : cryptoCurrency}</div>
        } />
        <span className="val-updown c-pointer" onClick={() => !isSwaped ? setSwapped(true) : setSwapped(false)}>
            <span className="icon md swaparrow" />
        </span>
    </div>

}
export default forwardRef(LocalCryptoSwapper);