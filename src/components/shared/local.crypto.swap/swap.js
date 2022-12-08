import { Input, Spin } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
const LocalCryptoSwapperCmp = ({ localAmt = 0, cryptoAmt = 0, localCurrency = "USD", cryptoCurrency, onChange, isConvertionLoad, isSwaped }) => {
    const [symbols] = useState({
        "EUR": "€",
        "USD": "$",
        "GBP": "£"
    });
    return (
      <div className="">
        <div className="enter-val-container swap-com">
          <div className='coin-entryval'>
          <Text className="">
            {!isSwaped ? localCurrency : cryptoCurrency}
          </Text>
          <NumberFormat
            id="amtInput"
            className="enter-val"
            maxLength={25}
            customInput={Input}
            thousandSeparator={true}
            prefix={isSwaped ? "" : symbols[localCurrency]}
            decimalScale={isSwaped ? 8 : 2}
            autoComplete="off"
            placeholder="0.00"
            bordered={false}
            // style={{
            //   lineHeight: "48px",
            //   fontSize: 30,
            //   paddingRight: "40px !important",
            //   marginBottom: 0
            // }}
           
            onKeyPress={(e) => {
              e.currentTarget.style.fontSize = "30px";
            }}
            value={isSwaped ? cryptoAmt : localAmt}
            onValueChange={({ value }) => {
              onChange(value);
            }}
            autoFocus
            allowNegative={false}
          />
          </div>
        </div>
        <>
          <NumberFormat
            value={isSwaped ? localAmt : cryptoAmt}
            displayType={"text"}
            thousandSeparator={true}
            prefix={isSwaped ? symbols[localCurrency] : ""}
            renderText={(value, props) => (
              <div
                {...props}
                className=""
              >
                {value} {isSwaped ? localCurrency : cryptoCurrency}{" "}
                {isConvertionLoad && <Spin size="small" />}
              </div>
            )}
          />
        </>
      </div>
    );

}
export default LocalCryptoSwapperCmp;