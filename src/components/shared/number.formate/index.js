import { Input, Typography } from 'antd';
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
        const {Text} = Typography;
        const { type, defaultValue, prefixText, suffixText, onChange, prefix = "$", decimalPlaces = 2, format, className, bordered = false, inputCustomStyle, textCustomStyle, autoFocus = false, } = this.props;
        return <>{type === "input" ? <NumberFormat className={className} customInput={Input} thousandSeparator={true} prefix={prefix}
            placeholder="0.00"
            bordered={bordered}
            style={inputCustomStyle}
            value={defaultValue}
            onValueChange={({ value }) => {
                if (onChange) { onchange(value ? parseFloat(value).toFixed(decimalPlaces) : value) }
            }}
            autoFocus={autoFocus}
        /> : <NumberFormat
            value={defaultValue.toFixed(decimalPlaces)}
            className={className}
            displayType={'text'}
            thousandSeparator={true}
            prefix={prefix}
            renderText={(value, props) => <div {...props}>{prefixText ? prefixText : ""} {value} {suffixText ? suffixText : ""}</div>} />}</>
    }
}

export default Currency