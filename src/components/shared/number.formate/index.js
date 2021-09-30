import { Input } from 'antd';
import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

class Currency extends Component {
    state = {

    }
    componentDidMount() {

    }
    renderElement = () => {

    }
    render() {
        const { type, defaultValue, prefixText, suffixText, onChange, prefix = "$", className, bordered = false, inputCustomStyle, autoFocus = false, } = this.props;
        return <>{type === "input" ? <NumberFormat className={className} customInput={Input} thousandSeparator={true} prefix={prefix}
            placeholder="0.00"
            bordered={bordered}
            style={inputCustomStyle}
            value={defaultValue}
            onValueChange={({ value }) => {
                if (onChange) { onchange(value ? value : value) }
            }}
            autoFocus={autoFocus}
        /> : <NumberFormat
            value={defaultValue}
            className={className}
            displayType={'text'}
            thousandSeparator={true}
            prefix={prefix}
            renderText={(value, props) => <div {...props}>{prefixText ? prefixText : ""} {value} {suffixText ? suffixText : ""}</div>} />}</>
    }
}

export default Currency