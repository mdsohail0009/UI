import { Input } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { useState } from 'react';
import connectStateProps from '../../../utils/state.connect';
import { convertCurrency } from '../../buysell.component/buySellService';
import NumberFormat from 'react-number-format';
const LocalCryptoSwapper = ({ localAmt = 0, cryptoAmt = 0, localCurrency = "USD", cryptoCurrency, onChange, sellData, selectedCoin = null }) => {
    const [isSwaped, setSwapped] = useState(false);
    const [values, setValues] = useState({ localValue: localAmt, cryptoValue: cryptoAmt });

    const { localValue, cryptoValue } = values;

    const fetchConvertionValue = async ({ cryptoValue, localValue }) => {
        const coin = selectedCoin || sellData?.selectedCoin?.data?.coin;
        const value = await convertCurrency({ from: coin, to: "USD", value: isSwaped ? cryptoValue : localValue, isCrypto: !isSwaped })
        setValues({ cryptoValue, localValue, [isSwaped ? "localValue" : "cryptoValue"]: value });
        onChange({ cryptoValue, localValue, [isSwaped ? "localValue" : "cryptoValue"]: value, isSwaped });
    }
    return <div className="p-relative">
        <div className="enter-val-container  p-relative">
            <Text className="fs-36 fw-100 text-white-30 mr-4">{!isSwaped ? localCurrency : cryptoCurrency}</Text>
            <NumberFormat className="fw-100 text-white-30 enter-val p-0" customInput={Input} thousandSeparator={true} prefix={"$"}
                placeholder="0.00"
                bordered={false}
                style={{ width: 90, lineHeight: '55px', fontSize: 36, paddingRight: 30 }}
                onBlur={(e) => e.currentTarget.value.length == 0 ? e.currentTarget.style.width = "100px" : ''}
                onKeyPress={(e) => {
                    e.currentTarget.style.width = ((e.currentTarget.value.length + 6) * 15) + 'px'
                    e.currentTarget.value.length >= 8 ? e.currentTarget.style.fontSize = "30px" : e.currentTarget.style.fontSize = "36px"
                }}
                value={isSwaped ? cryptoValue : localValue}
                onValueChange={({ value }) => {
                    setValues({ ...values, [isSwaped ? 'cryptoValue' : 'localValue']: value });
                    fetchConvertionValue({ cryptoValue: isSwaped ? value : values.cryptoValue, localValue: !isSwaped ? value : values.localValue });
                }}
                autoFocus
            />

        </div>
        <NumberFormat value={isSwaped ? localValue : cryptoValue} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props} className="fs-14 text-white-30 fw-200 text-center d-block mb-36">{value} {isSwaped ? localCurrency : cryptoCurrency}</div>
        } />
        <span className="mt-16 val-updown c-pointer">
            <span onClick={() => !isSwaped ? setSwapped(true) : ""} className="icon sm uparw-o-white d-block c-pointer mb-4" /><span onClick={() => isSwaped ? setSwapped(false) : ""} className="icon sm dwnarw-o-white d-block c-pointer" />
        </span>
    </div>

}

export default connectStateProps(LocalCryptoSwapper);