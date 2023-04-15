import { Input, Spin } from 'antd';
import React from 'react';
import NumberFormat from 'react-number-format';
const LocalCryptoSwapperCmp = ({ localAmt = 0, cryptoAmt = 0, localCurrency = "USD", cryptoCurrency, onChange, isConvertionLoad, isSwaped, onCurrencySwap }) => {
    
    return (
      <div className="p-relative enrty-field-style new-swap-design">
        <div className="enter-val-container swap-com swap-text-sub new-swap-subtext">

<div className='swap-entryvalue'><NumberFormat
            id="amtInput"
            className="swap-custinputfield swap-text-sub"
            maxLength={25}
            customInput={Input}
            thousandSeparator={true}
            decimalScale={isSwaped ? 8 : 2}
            autoComplete="off"
            placeholder="0"
            bordered={false}
            contenteditable="true"
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
            renderText={(value, props) => (
              <div
                {...props}
                className="swap-text-sub"
              >
                {isConvertionLoad ? <Spin size="small" />:value}
              </div>
            )}
          /></div>
        <div className='swapcoin-alignemnt'><span className='crypto-coin-mtspace'>{isSwaped ? localCurrency : cryptoCurrency}{" "}</span></div>
    </div>
        <>
            <span className="val-updown c-pointer" onClick={onCurrencySwap} disabled={isConvertionLoad}>
              <span className="icon md swaparrow" />
            </span>
        </>
      </div>
    );

}
export default LocalCryptoSwapperCmp;