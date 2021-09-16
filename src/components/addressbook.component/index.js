import React, { Component } from 'react';
import {Typography} from 'antd'
const { Title, Paragraph} = Typography;
class AddressBook extends Component {
    render() {
        return (
            <>
                <div className="box basic-info">
                <Title className="basicinfo">Address Book</Title>
                <Paragraph className="basic-decs">User customized addressbook</Paragraph>
                </div>
            </>
        )
    }
}

export default AddressBook;