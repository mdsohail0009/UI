import React, { useState } from 'react';
import { Form, Typography , Button,  Drawer, Select } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';

import Translate from 'react-translate-component';
import { connect } from 'react-redux';


import Moment from 'react-moment';

import List from "../grid.component";
import BeneficiaryDrawer from './beneficiaryDrawer';
import NewFiatAddress from '../addressbook.component/addFiatAddressbook'

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
    const [beneficiaryDetails, setBeneficiaryDetails] = useState(false);
    const [visible, setVisible] = useState(false);
    const[checkRadio,setCheckRadio] = useState(false);
    const paymentsView = (prop) => {
        props.history.push(`/payments/${prop.dataItem.id}/view`)
    };

    
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
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
        setCheckRadio(true);
        setBeneficiaryDetails(true);
        }
    const closeBuyDrawer = () => {
        setBeneficiaryDetails(false);
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

                <Drawer
                destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        <span />
                        <div className="text-center fs-16">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">AddFiatAddress</Paragraph>
                        </div>
                        <span onClick={closeBuyDrawer} className="icon md close-white c-pointer" />
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={beneficiaryDetails}
                    closeIcon={null}
                    className="side-drawer"
                    size="large"
                >
                    <NewFiatAddress checkThirdParty = {checkRadio} onCancel={() => closeBuyDrawer()} />
                </Drawer>
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