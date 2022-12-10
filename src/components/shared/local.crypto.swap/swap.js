import { Input, Spin } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
const LocalCryptoSwapperCmp = ({ localAmt = 0, cryptoAmt = 0, localCurrency = "USD", cryptoCurrency, onChange, isConvertionLoad, isSwaped, onCurrencySwap }) => {
    const [symbols] = useState({
        "EUR": "€",
        "USD": "$",
        "GBP": "£"
    });
    return (
      <div className="p-relative enrty-field-style">
        <div className="enter-val-container swap-com">
          <Text className="crycoin-bal">
            {!isSwaped ? localCurrency : cryptoCurrency}
          </Text>
          <NumberFormat
            id="amtInput"
            className="inputfont-style"
            maxLength={25}
            customInput={Input}
            thousandSeparator={true}
            suffix={isSwaped ? "" : symbols[localCurrency]}
            decimalScale={isSwaped ? 8 : 2}
            autoComplete="off"
            placeholder="0.00"
            bordered={false}
            // prefix={!isSwaped ? localCurrency : cryptoCurrency}
            // style={{
            //   lineHeight: "48px",
            //   fontSize: 30,
            //   paddingRight: "40px !important",
            //   marginBottom: 0
            // }}
           
            onKeyPress={(e) => {
              e.currentTarget.style.fontSize = "24px";
            }}
            value={isSwaped ? cryptoAmt : localAmt}
            onValueChange={({ value }) => {
              onChange(value);
            }}
            autoFocus
            allowNegative={false}
          />
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
                className="swap-text-sub"
              >
                {value} {isSwaped ? localCurrency : cryptoCurrency}{" "}
                {isConvertionLoad && <Spin size="small" />}
              </div>
            )}
          />
            <span className="val-updown c-pointer" onClick={onCurrencySwap} disabled={isConvertionLoad}>
              <span className="icon md swaparrow" />
            </span>
        </>
      </div>
    );

}
export default LocalCryptoSwapperCmp;