
import React, { useEffect, useState } from 'react';
import { Typography, Button, Drawer, Select ,message, Alert, Spin } from 'antd';
import {Link} from 'react-router-dom';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import { warning } from '../../utils/messages'
import List from "../grid.component";
import BeneficiaryDrawer from './beneficiaryDrawer';
import AddressCommonCom from "../addressbook.component/addressCommonCom";
import { setHeaderTab } from "../../reducers/buysellReducer"
import ActionsToolbar from "../toolbar.component/actions.toolbar";
import { fetchFeaturePermissions } from "../../reducers/feturesReducer";
import { getFeatureId } from "../shared/permissions/permissionService";
import { getCurrencyLu} from './api'
import {getFeaturePermissionsByKey} from '../shared/permissions/permissionService'
import apicalls from '../../api/apiCalls';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const Payments = (props) => {
  const gridRef = React.createRef();
  
  const [beneficiaryDrawer, setBeneficiaryDrawer] = useState(false);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState(false);
  const [checkRadio, setCheckRadio] = useState(false);
  const [selection, setSelection] = useState([]);
  const [selectedObj, setSelectedObj] = useState()
  const [setSelectData, setSetSelectData] = useState({})
  const [errorWarning,setErrorWarning]=useState(null)
  const [ currencylu,setCurrencylu]=useState([]);
  const [walletType,setWalletType]=useState(props.match.params.code);
  const [loading,setLoading] = useState(true)
  const paymentsView = (prop) => {
    props.history.push(`/payments/${prop.dataItem.id}/view`)
  };
  const paymentsEdit = () => {
    if (selection.length == 0) {
      setErrorWarning("Please select the record");
    } else {
      props.history.push(`/payments/${selectedObj}/${setSelectData.currency}/${setSelectData.state}/edit`)
    }

  };
  const loadInfo = () =>{
    getCurrencyLookup();
    
    if (props?.match?.path === `/payments`) {
      let key = "1"
      props.dispatch(setHeaderTab(key));
    }
    
    setLoading(false)
  }
  useEffect(() => {
    if(props.billpaymentsPermission){
      let viewPermission = props.billpaymentsPermission.actions.filter((item)=>item.permissionName == 'view')[0];
      if(!viewPermission.values){
        props.history.push('/accessdenied')
      }
    }else{
      getFeaturePermissionsByKey('billpayments',loadInfo)
    }
  }, [props.billpaymentsPermission])
  useEffect(() => {
    getFeaturePermissionsByKey('billpayments',loadInfo)
  }, [])
  useEffect(()=>{
    gridRef.current?.refreshGrid();
  },[walletType])
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
      field: "createdDate", title: apicalls.convertLocalLang("Date"), filter: true, filterType: "date",width: 200,
      customCell: (prop) => (
        <td><div className="gridLink" onClick={() => paymentsView(prop)}>
          <Moment format="DD/MM/YYYY">{moment(new Date(prop.dataItem.createdDate), "DD/MM/YYYY")}</Moment></div></td>)
    },
    { field: "currency", title: apicalls.convertLocalLang("currency"), filter: true,width: 200, },
    { field: "totalAmount", title: 'Total Amount', filter: true, width: 200,dataType: "number", filterType: "numeric" },
    { field: "approvedAmount", title: 'Approved Amount', filter: true, width: 237, },
    { field: "count", title: 'Count', filter: true, width: 150,dataType: "number", filterType: "numeric" },
    { field: "state", title: 'State', filter: true, width: 200, },
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
const getCurrencyLookup = async () => {
    let response = await getCurrencyLu(props.userConfig?.id);
    if (response.ok) {
      let obj={currencyCode:"All"}
      let walletList=[];
      walletList.push(obj);
      walletList=[...walletList,...response.data]
      setCurrencylu(walletList)
    } else {
      message.destroy();
      setErrorWarning(response.data)
    }
  };
  const handleCurrencyChange=(value)=>{
    const searchVal = `${value ? value : "All"}`;
    setWalletType(searchVal)
    
  }
  const onActionClick = (key) => {
    const actions = {
     "Add Payee": showNewBenificiary,
      add: addPayment,
      edit: paymentsEdit,
    };
  actions[key]();
  };
  if(loading){
    return <div className='custom-spin text-center mt-36'><Spin loading={true}></Spin></div>
  }else{
  return (
    <>
      <div className="main-container">
        <div className='bill_payment mb-16'> 
          
          <Title className="basicinfo mb-0"><span onClick={() => props.history?.push("/cockpit")} className='icon md c-pointer back mr-8'></span><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
         
          <Select
                  className="cust-input cust-disable"
                  placeholder="Select Currency"
                  onChange={(e) => handleCurrencyChange(e)}
                  style={{ width: 280 }}
                  dropdownClassName="select-drpdwn"
                  bordered={false}
                  showArrow={true}
                  value={walletType}
                >
                  {currencylu?.map((item, idx) => (
                    <Option
                      key={idx}
                      className="fw-400"
                      value={item.currencyCode}
                    >
                      {" "}
                      {item.currencyCode}
                    </Option>
                  ))}
                </Select>
          <span className="mb-right">
          <ActionsToolbar featureKey="billpayments" onActionClick={(key) => onActionClick(key)}/>
          </span>
          
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
           className="bill-grid"
            showActionBar={false}
            url={process.env.REACT_APP_GRID_API + `MassPayments/UserPayments/${props.userConfig?.id}`}
                       additionalParams={{type:walletType}}
            columns={gridColumns}
            ref={gridRef}
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
            <div className="text-center fs-24">
              <Paragraph className="mb-0 text-white-30 fw-600"><Translate content="AddFiatAddress" component={Paragraph} className="mb-0 text-white-30 fw-600" /></Paragraph>
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
          <AddressCommonCom checkThirdParty={checkRadio} onCancel={() => closeBuyDrawer()} props={props} />
        </Drawer>
      </div>
    </>
  )
        }
}


const connectStateToProps = ({ userConfig,menuItems }) => {
  return { userConfig: userConfig.userProfileInfo,billpaymentsPermission:menuItems?.featurePermissions?.billpayments };
};

const connectDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

export default connect(connectStateToProps, connectDispatchToProps)(Payments);