import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

class Currency extends Component {
    state = {

    }
    componentDidMount() {

    }
    renderElement = () => {
        const { type, defaultValue, onChange, prefix = "$", decimalPlaces = 2, format, className } = this.props;
        const template = {
            input: '',
            text: <NumberFormat value={defaultValue} className={className} displayType={'text'} thousandSeparator={true} prefix={prefix} renderText={(value, props) => <div {...props}>{value}</div>} />
        }
        return template[type]
    }
    render() {

        return <>{this.renderElement()}</>
    }
}

export default Currency