import React, { useEffect, useState } from 'react';
import { Typography, Button, Drawer, Select ,Tooltip, Alert } from 'antd';
import {Link} from 'react-router-dom';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import { warning } from '../../utils/messages'
import List from "../grid.component";
import BeneficiaryDrawer from './beneficiaryDrawer';
import NewFiatAddress from '../addressbook.component/addFiatAddressbook';
import { setHeaderTab } from "../../reducers/buysellReducer"
const { Title, Text, Paragraph } = Typography;

const Payments = (props) => {

  const gridRef = React.createRef();
  const [beneficiaryDrawer, setBeneficiaryDrawer] = useState(false);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState(false);
  const [checkRadio, setCheckRadio] = useState(false);
  const [selection, setSelection] = useState([]);
  const [selectedObj, setSelectedObj] = useState()
  const [setSelectData, setSetSelectData] = useState({})
  const [errorWarning,setErrorWarning]=useState(null)
  const paymentsView = (prop) => {
    props.history.push(`/payments/${prop.dataItem.id}/view`)
  };
  const paymentsEdit = () => {
    if (selection.length == 0) {
      setErrorWarning("Please select the one record");
    } else {
      props.history.push(`/payments/${selectedObj}/${setSelectData.currency}/${setSelectData.state}/edit`)
    }

  };
  useEffect(() => {

    if (props?.match?.path === '/payments') {
      let key = "1"
      props.dispatch(setHeaderTab(key));
    }

  }, [])
  const gridColumns = [
    {
      field: "",
      title: "",
      width: 50,
      customCell: (prop) => (
        <td className="text-center">
          <label className="text-center custom-checkbox c-pointer">
            <input
              id={prop.dataItem.id}
              name="check"
              type="checkbox"
              checked={selection.indexOf(prop.dataItem.id) > -1}
              onChange={(e) => handleInputChange(prop)}
              className="c-pointer"
            />
            <span></span>
          </label>
        </td>
      )
    },
    {
      field: "createdDate", title: 'Date', filter: true, filterType: "date",width: 300,
      customCell: (prop) => (
        <td><div className="gridLink" onClick={() => paymentsView(prop)}>
          <Moment format="DD/MM/YYYY">{moment(new Date(prop.dataItem.createdDate), "DD/MM/YYYY")}</Moment></div></td>)
    },
    { field: "currency", title: 'Currency', filter: true,width: 300, },
    { field: "totalAmount", title: 'Total Amount', filter: true, width: 300, },
    { field: "approvedAmount", title: 'Approved Amount', filter: true, width: 300, },
    { field: "count", title: 'Count', filter: true, width: 300, },
    { field: "state", title: 'State', filter: true, width: 300, },
  ];
  const handleInputChange = (prop) => {
    setErrorWarning(null);
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
    setSetSelectData(rowChecked)
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
    setCheckRadio(true);
    setBeneficiaryDetails(true);
  }
  const closeBuyDrawer = () => {
    setBeneficiaryDetails(false);
  }
  return (
    <>
      <div className="main-container">
        <div className='bill_payment mb-16'>
          <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
          <div className="cust-btns mb-d-none">
            <Button
              className="pop-btn px-24"
              style={{ margin: "0 8px", height: 40 }}
              onClick={showNewBenificiary}
            >
              Add Beneficiary
            </Button>
            <Button
              className="pop-btn px-24"
              style={{ margin: "0 8px", height: 40 }}
              onClick={addPayment}
            >
              Add Bill Payment
            </Button>
            <Button
              className="pop-btn px-24"
              style={{ margin: "0 8px", height: 40 }}
              onClick={paymentsEdit}
            >
              Edit Bill Payment
            </Button>
          </div>
          <div className="cust-btns visible-mobile mb-16" style={{float:'right'}}>
            <ul
              className="address-icons"
              style={{
                listStyle: "none",
                paddingLeft: 0,
                marginBottom: 0,
                display: "flex",
              }}>
              <li onClick={showNewBenificiary} className="mr-16">
                <Tooltip
                  placement="topRight"
                  title="Add Beneficiary">
                  <Link className="icon md add-icon mr-0"></Link>
                </Tooltip>
              </li>
              <li onClick={addPayment} className="mr-16">
                <Tooltip
                  placement="topRight"
                  title="Add Bill Payment">
                  <Link className="icon md add-icon mr-0"></Link>
                </Tooltip>
              </li>
              <li onClick={paymentsEdit}>
                <Tooltip
                  placement="topRight"
                  title="Edit Bill Payment">
                  <Link className="icon md edit-icon mr-0"></Link>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
        {errorWarning !== null && (
            <Alert
              className="mb-12"
              type="warning"
              description={errorWarning}
              onClose={() => setErrorWarning(null)}
              showIcon
            />
          )}
        <div className="box basic-info text-white" style={{clear:'both'}}>
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
              <Paragraph className="mb-0 text-white-30 fw-600 text-upper"><Translate content="AddFiatAddress" component={Paragraph} className="mb-0 text-white-30 fw-600 text-upper" /></Paragraph>
            </div>
            <span onClick={closeBuyDrawer} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={true}
          visible={beneficiaryDetails}
          closeIcon={null}
          className=" side-drawer w-50p"
          size="large"
        >
          <NewFiatAddress checkThirdParty={checkRadio} onCancel={() => closeBuyDrawer()} props={props} />
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