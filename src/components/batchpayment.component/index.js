import React, { useEffect, useState } from 'react';
import { Typography,Drawer,Space,Button } from 'antd';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import List from "../grid.component";
import AddBatchPayment from './addbatchPayment';
import PaymentPreview from './paymentPreview';

const { Title, Text, Paragraph } = Typography;

const Batchpayments = (props) => {
 
const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const showDrawer = () => {
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };
  const viewMode = () => {
    props.history.push("/batchpaymentview")
  }
  const gridRef = React.createRef();
  const [isAddBatchDrawer, setIsAddBatchDrawer] = useState(false);
  const [isProceedBatchPayment, setProceedBatchPayment] = useState(false);
    const gridColumns = [
        {
          field: "",
          title: "",
          width: 50,
          customCell: (prop) => (
            <td className="text-center">
              <label className="text-center custom-checkbox c-pointer">
                <input
                //   id={prop.dataItem.id}
                  name="check"
                  type="checkbox"
                //   checked={selection.indexOf(prop.dataItem.id) > -1}
                //   onChange={(e) => handleInputChange(prop)}
                  className="c-pointer"
                />
                <span></span>
              </label>
            </td>
          )
        },
        {
          field: "fileName", title: "File Name", filter: true, filterType: "date",width: 200,
          customCell: (prop) => (
            <td><div className="gridLink" onClick={viewMode} >XXX Payments
              
              </div></td>) 
        },
        { field: "dateCreated", title: "Date created", filter: true,width: 200, },
        { field: "currency", title: 'Currency', filter: true, width: 150,dataType: "number", filterType: "numeric" },
        { field: "status", title: 'Status', filter: true, width: 150, },
        { field: "numberOfTransactions", title: 'Number of Transactions', filter: true, width: 200,dataType: "number", filterType: "numeric", 
           customCell: (prop) => (<td><div className="gridLink" >50 </div></td>) 
        },
        { field: "validTransactions", title: 'Valid Transactions', filter: true, width: 200, },
        { field: "invalidTransactions", title: 'Invalid Transactions', filter: true, width: 200,
            customCell: (prop) => (
            <td><div className="gridLink" >10
              </div></td>)
        },
        { field: "pendingTransactions", title: 'Pending Transactions', filter: true, width: 200, },
        { field: "approvedTransactions", title: 'Approved Transactions', filter: true, width: 200, },
        { field: "rejectedTransactions", title: 'Rejected Transactions', filter: true, width: 200, },
      ];
    
    const addBatchPayment = () => {
      setIsAddBatchDrawer(true);
    }
    const proceedBatchPayment = () => {
      setProceedBatchPayment(true);
    }
    const closeDrawer = () => {
    setIsAddBatchDrawer(false);
    setProceedBatchPayment(false);
    }
   const gotoDashboard=()=>{
      props.history.push('/cockpit')
    }
      return (
          <div className='main-container'>
              <div className='d-flex justify-content mb-16'>
                  <div>
                      <Title className="basicinfo mb-0"><span className='icon md c-pointer back mr-8' onClick={gotoDashboard}></span><Translate content="batch_payments" component={Text} className="basicinfo" /></Title>
                  </div>
                  <div className='batch-actions'>
                      <span className='icon md c-pointer add-icon' onClick={() => addBatchPayment()}></span>
                      <span className='icon md c-pointer procced-icon' onClick={() => proceedBatchPayment()}></span>
                      <span className='icon md c-pointer delete-icon'></span>
                  </div>
              </div>
              <div className="box basic-info text-white" style={{ clear: 'both' }}>
                  <List
                      className="bill-grid"
                      showActionBar={false}
                      url={process.env.REACT_APP_GRID_API + `MassPayments/UserPayments/${props.userConfig?.id}`}
                      additionalParams={{ type: "All" }}
                      columns={gridColumns}
                      ref={gridRef}
                  />
              </div>
              <AddBatchPayment
                  showDrawer={isAddBatchDrawer}
                  onClose={() => closeDrawer()}
              />   
              {isProceedBatchPayment && 
              <PaymentPreview 
              showDrawer={isProceedBatchPayment}
              onClose={() => {
                  closeDrawer();
              }}
              ></PaymentPreview>
              }        
          </div>       
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

export default connect(connectStateToProps, connectDispatchToProps)(Batchpayments);
				