
import React, { useEffect, useState } from 'react';
import { Typography, Drawer, Select ,message, Alert, Spin } from 'antd';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import List from "../grid.component";
import BeneficiaryDrawer from './beneficiaryDrawer';
import {Link } from "react-router-dom";
import { setHeaderTab } from "../../reducers/buysellReducer"
import ActionsToolbar from "../toolbar.component/actions.toolbar";
import { getCurrencyLu} from './api'
import {getFeaturePermissionsByKey} from '../shared/permissions/permissionService'
import apicalls from '../../api/apiCalls';
import AddressbookV3 from '../addressbook.v3';
import { getScreenName } from '../../reducers/feturesReducer';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const Payments = (props) => {
  const gridRef = React.createRef();
  
  const [beneficiaryDrawer, setBeneficiaryDrawer] = useState(false);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState(false);
  const [selection, setSelection] = useState([]);
  const [selectedObj, setSelectedObj] = useState()
  const [setSelectData, setSetSelectData] = useState({})
  const [errorWarning,setErrorWarning]=useState(null)
  const [ currencylu,setCurrencylu]=useState([]);
  const [walletType,setWalletType]=useState(props.match.params.code);
  const [loading,setLoading] = useState(true)
  const [cryptoFiat ,setCryptoFiat]=useState(true);
  const [hideFiatHeading,setHideFiatHeading]=useState(false);
  const paymentsView = (prop) => {
    props.history.push(`/payments/${prop.dataItem.id}/${prop.dataItem.currency}/view`)
  };
  const paymentsEdit = () => {
    if (selection.length === 0) {
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
      let viewPermission = props.billpaymentsPermission.actions.filter((item)=>item.permissionName === 'view')[0];
      if(!viewPermission.values){
        props.history.push('/accessdenied')
      }
    }else{
      getFeaturePermissionsByKey('billpayments',loadInfo)
    }
  }, [props.billpaymentsPermission]);//eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    getFeaturePermissionsByKey('billpayments',loadInfo)
  }, []);//eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{
    gridRef.current?.refreshGrid();
  },[walletType]);//eslint-disable-line react-hooks/exhaustive-deps
  const gridColumns = [
    {
      field: "",
      title: "",
      width: 50,
      customCell: (prop) => (
        <td className="text-center">
          <label className="text-center custom-checkbox c-pointer cust-check-outline">
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
    { field: "approvedAmount", title: 'Approved Amount', filter: true, width: 237,dataType: "number", filterType: "numeric"  },
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
    setBeneficiaryDetails(true);
  }
  const closeBuyDrawer = () => {
    setHideFiatHeading(false);
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
 const isFiatHeading =(data)=>{
    setHideFiatHeading(data)
	}

  const  handleBack = () => {
    props.dispatch(getScreenName({getScreen:"dashboard"}))
} 
  if(loading){
    return <div className='custom-spin text-center mt-36'><Spin loading={true}></Spin></div>
  }else{
  return (
    <>
      <div className="main-container">
      <div className="backbtn-arrowmb" onClick={handleBack}>
        <Link  to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link>
        </div>
        <div className='bill-payment'> 
          
          <div className="billpaycoin-style"><Translate content="menu_payments" component={Text} className="coin-viewstyle" /></div>
         
         
          <span className="mb-right">
          <ActionsToolbar featureKey="billpayments" onActionClick={(key) => onActionClick(key)}/>
          </span>
          
        </div>
       
        <div className='bill-payment bill-margin'> 
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
           </div>
        {/* <div className="box"> */}
          <List
           className="bill-grid"
            showActionBar={false}
            url={process.env.REACT_APP_GRID_API + `MassPayments/UserPayments`}
                       additionalParams={{type:walletType}}
            columns={gridColumns}
            ref={gridRef}
          />
       
        <BeneficiaryDrawer
          showDrawer={beneficiaryDrawer}
          onClose={() => closeDrawer()}
        />

        <Drawer
          destroyOnClose={true}
          title={[<div className="side-drawer-header">
            <span />
            <div className="text-center">
              <Paragraph className="drawer-maintitle"><Translate content={hideFiatHeading !==true && "AddFiatAddress"}component={Paragraph} className="drawer-maintitle" /></Paragraph>
            </div>
            <span onClick={closeBuyDrawer} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={true}
          visible={beneficiaryDetails}
          closeIcon={null}
          className=" side-drawer"
          size="large"
        >
          <AddressbookV3 type="manual" isFiat={cryptoFiat} onCancel={() => closeBuyDrawer()} props={props} isFiatHeadUpdate={isFiatHeading}/>
        </Drawer>
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