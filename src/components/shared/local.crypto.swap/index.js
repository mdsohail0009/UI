import { Input } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { useEffect, useState } from 'react';
import connectStateProps from '../../../utils/state.connect';
import { convertCurrency } from '../../buysell.component/buySellService';
import NumberFormat from 'react-number-format';
const LocalCryptoSwapper = ({ localAmt = 0, cryptoAmt = 0, localCurrency = "USD", cryptoCurrency, onChange, sellData, selectedCoin = null }) => {
    const [isSwaped, setSwapped] = useState(false);
    const [localValue, setLocalValue] = useState(localAmt);
    const [cryptoValue, setCryptoValue] = useState(cryptoAmt);
    useEffect(() => {
        debugger;
        if (localAmt != localValue) { setLocalValue(localAmt); }
        if (cryptoAmt != cryptoValue) { setCryptoValue(cryptoAmt); }
    }, [localAmt]);
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
            <NumberFormat className="fw-100 text-white-30 text-center enter-val p-0" customInput={Input} thousandSeparator={true} prefix={isSwaped ? "" : "$"}
                placeholder="0.00"
                bordered={false}
                style={{ lineHeight: '48px', fontSize: 30, paddingRight: '40px !important' }}
                onKeyPress={(e) => {
                    e.currentTarget.value.length >= 8 ? e.currentTarget.style.fontSize = "30px" : e.currentTarget.style.fontSize = "30px"
                }}
                //value={isSwaped ? cryptoValue : localValue}
                defaultValue={isSwaped ? cryptoValue : localValue}
                onValueChange={({ value }) => {
                    if (isSwaped) {
                        setCryptoValue(value);
                    } else { setLocalValue(value) }
                    fetchConvertionValue({ cryptoValue: isSwaped ? value : cryptoValue, localValue: !isSwaped ? value : localValue });
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

export default connectStateProps(LocalCryptoSwapper);