import React, { useState } from 'react';
import { Form, Typography , Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import List from "../grid.component";
import BeneficiaryDrawer from './beneficiaryDrawer';

const { Title, Text } = Typography;

const Payments = (props) => {
    const gridRef = React.createRef();
    const [form] = Form.useForm();
    const [beneficiaryDrawer, setBeneficiaryDrawer] = useState(false);
    const[selection,setSelection]=useState([]);
    const [selectedObj,setSelectedObj]=useState({})

    const paymentsView = (prop) => {
        props.history.push(`/payments/${prop.dataItem.id}/view`)
    };
    const paymentsEdit = (prop) => {
        debugger
        if (selection.length == 0) {
            message.warning("Please select the one record");
          }else{
            if (selection.state !== "Submit")  {
            props.history.push(`/payments/${selectedObj}/edit`)
            }
          }
       
    };
    const gridColumns = [
        // {
        //     field: "",
        //     title: "",
        //     width: 50,
        //     customCell: (props) => (
        //       <td className="text-center">
        //         <label className="text-center custom-checkbox">
        //           <input
        //             id={props.dataItem.id}
        //             name="check"
        //             type="checkbox"
        //             checked={selection.indexOf(props.dataItem.id) > -1}
        //             onChange={(e) => handleInputChange(props, e)}
        //             className="grid_check_box"
        //           />
        //           <span></span>
        //         </label>
        //       </td>
        //     )
        //   },
        {
            field: "createdDate", title: 'Date', filter: true, filterType: "date", customCell: (props) => (
                <td><div className="gridLink" onClick={() => paymentsView(props)}>
                    <Moment format="DD/MM/YYYY">{new Date(props.dataItem.createdDate).toLocaleDateString()}</Moment></div></td>)
        },
        { field: "currency", title: 'Currency', filter: true },
        { field: "totalAmount", title: 'Total Amount', filter: true },
        { field: "transferAmount" , title: 'Transfer Amount', filter: true },
        { field: "count", title: 'Count', filter: true },
        { field: "state", title: 'State', filter: true },
    ];
      const handleInputChange = (prop, e) => {
        const rowChecked = prop.dataItem;
        let _selection = [...selection];
        let idx = _selection.indexOf(rowChecked.id);
        if (selection) {
          _selection = [];
        }
        if (idx > -1) {
          _selection.splice(idx, 1);
        } else {
          _selection.push(rowChecked.id);
        }
        setSelection(_selection);
        setSelectedObj(rowChecked.id)
      };
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
                        {/* <Button
                            className="pop-btn px-24"
                            style={{ margin: "0 8px", height: 40 }}
                            onClick={paymentsEdit}
                        >
                            Edit Bill Payment
                        </Button>  */}
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