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
      <div className="p-relative enrty-field-style new-swap-design">
        <div className="enter-val-container swap-com swap-text-sub new-swap-subtext">
        {/* <div className="crycoin-bal">
            {!isSwaped ? localCurrency : cryptoCurrency}
          </div> */}
          {/* <NumberFormat
            id="amtInput"
            className="inputfont-style text-center inputbg-fonts"
            maxLength={25}
            customInput={Input}
            thousandSeparator={true}
            prefix={isSwaped ? "" : symbols[localCurrency]}
            decimalScale={isSwaped ? 8 : 2}
            autoComplete="off"
            placeholder="0.00"
            bordered={false}
            contenteditable="true"
            suffix={!isSwaped ?localCurrency : cryptoCurrency}
            value={isSwaped ? cryptoAmt : localAmt}
            onValueChange={({ value }) => {
              onChange(value);
            }}
            autoFocus
            allowNegative={false}
          /> */}

<div className='swap-entryvalue'><NumberFormat
            id="amtInput"
            className="swap-custinputfield swap-text-sub"
            maxLength={25}
            customInput={Input}
            thousandSeparator={true}
            // prefix={isSwaped ? "" : symbols[localCurrency]}
            decimalScale={isSwaped ? 8 : 2}
            autoComplete="off"
            placeholder="0.00"
            bordered={false}
            contenteditable="true"
            // suffix={!isSwaped ?localCurrency : cryptoCurrency}
            value={isSwaped ? cryptoAmt : localAmt}
            onValueChange={({ value }) => {
              onChange(value);
            }}
            autoFocus
            allowNegative={false}
          /></div>
        <div className='swapcoin-alignemnt crypto-coin-mbspace'><span>{!isSwaped ?localCurrency : cryptoCurrency}</span></div>
        </div>
        <div class="swap-text-sub swap-currencytext">
        <div className='swap-entryvalue'><NumberFormat
            value={isSwaped ? localAmt : cryptoAmt}
            displayType={"text"}
            thousandSeparator={true}
            // prefix={isSwaped ?  symbols[localCurrency] : ""}
            renderText={(value, props) => (
              <div
                {...props}
                className="swap-text-sub"
              >
                {value} 
                {isConvertionLoad && <Spin size="small" />}
              </div>
            )}
          /></div>
        <div className='swapcoin-alignemnt'><span className='crypto-coin-mtspace'>{isSwaped ? localCurrency : cryptoCurrency}{" "}</span></div>
    </div>
        <>
          {/* <NumberFormat
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
          /> */}
           
            <span className="val-updown c-pointer" onClick={onCurrencySwap} disabled={isConvertionLoad}>
              <span className="icon md swaparrow" />
            </span>
        </>
      </div>
    );

}
export default LocalCryptoSwapperCmp;