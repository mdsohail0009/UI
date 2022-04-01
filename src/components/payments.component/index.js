import React, { useState, useEffect } from 'react';
import { Form, Typography, Input, Button, Alert, Spin, message, Drawer, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/paymentsReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import { saveAddress, favouriteNameCheck, getAddress } from './api';
import Loader from '../../Shared/loader';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator'
import Moment from 'react-moment';
import moment from 'moment';
import List from "../grid.component";
import BeneficiaryDrawer from './beneficiaryDrawer';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Payments = (props, { userConfig }) => {
    const gridRef = React.createRef();
    const [addBenifeciary, setaddBenifeciary] = useState(false);
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fiatAddress, setFiatAddress] = useState({});
    const useDivRef = React.useRef(null);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [beneficiaryDrawer, setBeneficiaryDrawer] = useState(false);

    const paymentsView = (prop) => {
        props.history.push(`/payments/${prop.dataItem.id}/view`)
    };

    const gridColumns = [
        {
            field: "createdDate", title: 'Date', filter: true, filterType: "date", customCell: (props) => (
                <td><div className="gridLink" onClick={() => paymentsView(props)}>
                    <Moment format="DD/MM/YYYY">{new Date(props.dataItem.createdDate).toLocaleDateString()}</Moment></div></td>)
        },
        { field: "currency", title: 'Currency', filter: true },
        { field: "totalAmount", title: 'Total Amount', filter: true },
        { field: "count", title: 'Count', filter: true },
        { field: "state", title: 'Status', filter: true },
    ];

    const addPayment = () => {
        props.history.push(`/payments/00000000-0000-0000-0000-000000000000/add`)
    }

    const closeDrawer = () => {
        setBeneficiaryDrawer(false);
    }
    const showNewBenificiary = () => {
        props.history.push(`/payments/newbeneficiary/00000000-0000-0000-0000-000000000000`)
    }
    const savewithdrawal = () => {
        setBeneficiaryDrawer(false);
    }
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color: '#fff', marginRight: '16px' }} spin />;
    return (
        <>
            <div className="main-container">
                <div className='d-flex align-center justify-content mb-16'>
                    <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    <div className="d-flex">
                        <Button
                            className="pop-btn px-24"
                            style={{ margin: "0 8px", height: 40 }}
                            onClick={showNewBenificiary}
                        >
                            Add New Beneficiary
                        </Button>
                        <Button
                            className="pop-btn px-24"
                            style={{ margin: "0 8px", height: 40 }}
                            onClick={addPayment}
                        >
                            New Bill Payment
                        </Button>
                    </div>
                </div>
                <div className="box basic-info text-white">
                    <List
                        showActionBar={false}
                        ref={gridRef}
                        url={process.env.REACT_APP_GRID_API + `MassPayments/UserPayments/${props.userConfig?.id}`}
                        columns={gridColumns}
                    />
                </div>
                <BeneficiaryDrawer
                    showDrawer={beneficiaryDrawer}
                    onClose={() => closeDrawer()}
                />
            </div>
        </>
    )
}


const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};

const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(Payments);