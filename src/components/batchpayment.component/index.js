import React, { useEffect, useState } from 'react';
import { Typography,Drawer,Space,Button } from 'antd';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import List from "../grid.component";
import AddBatchPayment from './addbatchPayment';
import PaymentPreview from './paymentPreview';
import moment from "moment/moment";

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
          field: "fileName", title: "File Name", filter: true, width: 200,
          customCell: (props) => (
            <td><div className="gridLink" onClick={viewMode} >{props?.dataItem?.fileName}
              </div></td>) 
        },
        { field: "createdDate", title: "Date created", filter: true, filterType: "date", width: 200, 
        customCell: (props) => (
          <td>
              {props.dataItem?.createdDate ? <>{ moment.utc(props.dataItem?.createdDate).local().format("DD/MM/YYYY hh:mm:ss A")}</> : props.dataItem?.createdDate}
          
          </td>
        )
      },
        { field: "currency", title: 'Currency', filter: true, width: 150,dataType: "number", filterType: "numeric" },
        { field: "status", title: 'Status', filter: true, width: 150, },
        { field: "numberOfTransactions", title: 'Number of Transactions', filter: true, width: 240,dataType: "number", filterType: "numeric", 
           customCell: (props) => (<td><div className="gridLink" >{props?.dataItem?.numberOfTransactions} </div></td>) 
        },
        { field: "validTransactionCount", title: 'Valid Transactions', filter: true, dataType: "number", filterType: "numeric", width: 200, },
        { field: "invalidTransactionCount", title: 'Invalid Transactions', filter: true, dataType: "number", filterType: "numeric", width: 200,
            customCell: (props) => (
            <td><div className="gridLink" >{props?.dataItem?.invalidTransactionCount}
              </div></td>)
        },
        { field: "pendingTransactionCount", title: 'Pending Transactions', filter: true, dataType: "number", filterType: "numeric", width: 220, },
        { field: "approvedTransactionCount", title: 'Approved Transactions', filter: true, dataType: "number", filterType: "numeric", width: 240, },
        { field: "rejectedTransactionCount", title: 'Rejected Transactions', filter: true, dataType: "number", filterType: "numeric", width: 220, },
      ];
    
    const addBatchPayment = () => {
      setIsAddBatchDrawer(true);
    }
    const proceedBatchPayment = () => {
      setProceedBatchPayment(true);
    }
    const closeDrawer = (isPreviewBack) => {
      if(isPreviewBack == "true") {
        setIsAddBatchDrawer(true);
      }
      else {
        setIsAddBatchDrawer(false);
      }
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
                      url={process.env.REACT_APP_GRID_API + `MassPayments/BatchPayments`}
                      columns={gridColumns}
                      ref={gridRef}
                  />
              </div>
              <AddBatchPayment
                  showDrawer={isAddBatchDrawer}
                  onClose={(isPreviewBack) => closeDrawer(isPreviewBack)}
              />   
              {isProceedBatchPayment && 
              <PaymentPreview 
              showDrawer={isProceedBatchPayment}
              onClose={(isPreviewBack) => {
                  closeDrawer(isPreviewBack);
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
				