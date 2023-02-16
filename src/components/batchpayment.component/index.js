import React, {useState } from 'react';
import { Typography,Tooltip,Button ,Modal,Alert,message} from 'antd';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import List from "../grid.component";
import AddBatchPayment from './addbatchPayment';
import PaymentPreview from './paymentPreview';
import moment from "moment/moment";
import { Link } from "react-router-dom";
import {deleteBatchPayments,getInvalidTransactionData} from './api'

import ActionsToolbar from "../toolbar.component/actions.toolbar";
const { Title, Text, Paragraph } = Typography;
const Batchpayments = (props) => {
  const gridRef = React.useRef();
  const [isAddBatchDrawer, setIsAddBatchDrawer] = useState(false);
  const [isProceedBatchPayment, setProceedBatchPayment] = useState(false);
  const [selection,setSelection]=useState([])
  const [selectedObj,setSelectedObj]=useState({})
  const [errorWarning,setErrorWarning]=useState(null) 
  const [deleteModal,setDeleteModal]=useState(false);
  const [setSelectData, setSetSelectData] = useState({});
  const [errorMessage,setErrorMessage]=useState(null); 
  const [isLoad,setIsLoad]=useState(false);
  const viewMode = (e) => {
    setProceedBatchPayment(false)
    const items=e.dataItem;
    const val = (items.id);
    props.history.push(`/batchpayment/${val}/${e.dataItem.fileName}/${e.dataItem.currency}/view`);
  }
  const docPreview = async (file) => {
    window.open(file.filePath,'_blank')
	};
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
          field: "fileName", title: "File Name", filter: true, width: 200,
          customCell: (properites) => (
            <td>
              {properites?.dataItem.status==="Draft"?<div  className='draft-filename'> {properites?.dataItem?.fileName}</div>:
             <span className="gridLink batch-filename" onClick={()=>viewMode(properites)} >
              {properites?.dataItem?.fileName}</span>}
              </td>) 
        },
        { field: "createdDate", title: "Date Created", filter: true, filterType: "date", width: 200, 
        customCell: (properites) => (
          <td>
              {properites.dataItem?.createdDate ? <>{ moment.utc(properites.dataItem?.createdDate).local().format("DD/MM/YYYY hh:mm:ss A")}</> : properites.dataItem?.createdDate}
          
          </td>
        )
      },
        { field: "currency", title: 'Currency', filter: true, width: 150,dataType: "number", filterType: "numeric" },
        { field: "status", title: 'Status', filter: true, width: 150, },
        { field: "numberOfTransactions", title: 'Number of Transactions', filter: true, width: 250,dataType: "number", filterType: "numeric", 
        customCell: (properites) => (<td>
        {properites?.dataItem?.numberOfTransactions!==0? <span className="gridLink batch-filename" onClick={()=>docPreview(properites.dataItem)}
        >{properites?.dataItem?.numberOfTransactions} 
        </span>:<>{properites?.dataItem?.numberOfTransactions}</>}</td>) 
     },
     { field: "validTransactionCount", title: 'Valid Transactions', filter: true, dataType: "number", filterType: "numeric", width: 210, },
     { field: "invalidTransactionCount", title: 'Invalid Transactions', filter: true, dataType: "number", filterType: "numeric", width: 210,
         customCell: (properites) => (
         <td>{properites?.dataItem?.invalidTransactionCount!==0?<span onClick={()=>getInvalidTransaction(properites?.dataItem)} className="gridLink batch-filename" >{properites?.dataItem?.invalidTransactionCount}
           </span>:<>{properites?.dataItem?.invalidTransactionCount}</>}
           
           </td>)
     },
     { field: "pendingTransactionCount", title: 'Pending Transactions', filter: true, dataType: "number", filterType: "numeric", width: 230, },
     { field: "approvedTransactionCount", title: 'Approved Transactions', filter: true, dataType: "number", filterType: "numeric", width: 240, },
     { field: "rejectedTransactionCount", title: 'Rejected Transactions', filter: true, dataType: "number", filterType: "numeric", width: 230, },
     { field: "fileUploadStatus", title: 'File Upload Status', filter: true, width: 220, }

     
   ];
 const getInvalidTransaction=async (data)=>{
  const res=await getInvalidTransactionData(data?.id)
  if(res.ok){
  window.open(res?.data,"_blank")
  }
 }
   const handleInputChange = (prop) => {
    setErrorWarning(null);
    setErrorMessage(null);
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
    setSetSelectData(rowChecked)
    setSelectedObj(rowChecked.id)
  };
 const addBatchPayment = () => {
   setErrorWarning(null)
   setIsAddBatchDrawer(true);
   
 }
 const proceedBatchPayment = () => { 
  if (selection.length === 0) {

    setErrorWarning("Please select the record");
  } 
  else if(setSelectData.status != "Draft"){
    setErrorWarning("Only draft record can proceed")
  }
  else if(setSelectData.validTransactionCount === 0){
    setErrorWarning("You don't have valid transactions to proceed")
  }
  else if(setSelectData.fileUploadStatus === "File is being processed please wait a while"){
    setErrorWarning("Upload status is in progress so you can't proceed")
  }
  else {
    setErrorWarning(null)
    setProceedBatchPayment(true);
    }
  }
  const deleteBatchPayment=()=>{
    setErrorWarning(null)
    if(selection.length === 0){
      setErrorWarning("Please select the  record")
    }
    else if(setSelectData.status != "Draft"){
      setErrorWarning("Only draft record can delete")
    }
    else{
    setDeleteModal(true);
    }
   }
    const deleteDetials = async () => {
      setIsLoad(true);
      const res = await deleteBatchPayments(selection[0])
      if (res.ok) {
          gridRef?.current?.refreshGrid();
      setDeleteModal(false);
      setIsLoad(false);
        setSelection([]);
        message.success({
          content:"Batch record deleted successfully",
          className: "custom-msg",
          duration: 3,
        });
      }
      else{
        setErrorMessage(isErrorDispaly(res));
        gridRef?.current?.refreshGrid();
        setDeleteModal(false);
        setIsLoad(false);
        setSelection([]);
      }
    };
  const deleteModalCancel=()=>{
    gridRef?.current?.refreshGrid();
    setErrorWarning(null)
    setSelection([]);
    setDeleteModal(false)
  
  }
    const closeDrawer = () => {
      gridRef?.current?.refreshGrid();
    setProceedBatchPayment(false);
    setIsAddBatchDrawer(false)
    setSelection([])
    }
    const refreshPayment=()=>{
      gridRef?.current?.refreshGrid();
      setErrorWarning(null)
      setSelection([])
    }
  
    const onActionClick = (key) => {
      const actions = {
        Refresh:refreshPayment,
        Add: addBatchPayment,
        Proceed: proceedBatchPayment,
        Delete: deleteBatchPayment
      };
      actions[key]();
    };
   const isErrorDispaly = (objValue) => {
      if (objValue.data && typeof objValue.data === "string") {
        return objValue.data;
      } else if (
        objValue.originalError &&
        typeof objValue.originalError.message === "string"
      ) {
        return objValue.originalError.message;
      } else {
        return "Something went wrong please try again!";
      }
    };
      return (
        <>
          <div className='main-container'>
          <div className="backbtn-arrowmb"><Link to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link></div>
                  <div className='batchpayment-summary d-flex'>
                  
                      <Title className="basicinfo mb-0">                     
                      <Translate content="batch_payments" component={Text} className="addressbook-mb" />  
                          
                      </Title>
                      <div className='batch-actions'>
                  <div className="mb-right">
          <ActionsToolbar featureKey="Batch_Payment" onActionClick={(key) => onActionClick(key)}/>
          </div>
                  </div>
              </div>
              <div className='proceed-section'>
                      <Text className='webkit-color'> Proceed{" "}(<span className="icon md process-icon"/>)</Text>
                      <Text className='note-cont'>: To proceed the transaction,{" "}please click on proceed icon</Text>  </div> 
              {errorWarning !== null && (
            <Alert
              className="mb-12"
              type="warning"
              description={errorWarning}
              showIcon
            />
          )}
           {errorMessage !== null && (
            <Alert
              className="mb-12"
              type="warning"
              description={errorMessage}
              showIcon
            />
          )}
              <div className="box text-white" style={{ clear: 'both' }}>
                  <List
                      className="bill-grid"
                      showActionBar={false}
                      url={process.env.REACT_APP_GRID_API + `MassPayments/BatchPayments`}
                      columns={gridColumns}
                      ref={gridRef}
                      key={process.env.REACT_APP_GRID_API + `MassPayments/BatchPayments`}
                     
                  />
              </div>
              {isAddBatchDrawer && 
              <AddBatchPayment
                  showDrawer={isAddBatchDrawer}
                  onClose={() => {
                    closeDrawer();
                }}
              /> }
              {isProceedBatchPayment && 
              <PaymentPreview 
              showDrawer={isProceedBatchPayment}
              id={selectedObj}
              onClose={() => {
                  closeDrawer();
              }}
              currency={setSelectData?.currency}
              ></PaymentPreview>
              }        
          </div>    
          <Modal title="Confirm Delete"
          destroyOnClose={true}
          closeIcon={<Tooltip title="Close"><span className="icon md c-pointer close" onClick={()=>deleteModalCancel()} /></Tooltip>}
         
          visible={deleteModal}
          className="payments-modal"
          footer={[
            <>
            <div className='cust-pop-up-btn crypto-pop bill-pop'>
             
              
                 <Button
                className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml"
                onClick={()=>deleteModalCancel()}>No</Button>
                <Button className="primary-btn pop-btn detail-popbtn"
                onClick={deleteDetials}
                loading={isLoad}
                >Yes</Button>
                </div>
            </>
          ]}
        >
          <Paragraph className="text-white">Are you sure, do you really want to delete ?</Paragraph>
        </Modal>
          </>   
      )
}

const connectStateToProps = ({ userConfig,menuItems }) => {
  return { userConfig: userConfig.userProfileInfo ,
    batchPaymentPermissions: menuItems?.featurePermissions.Batch_Payment,
  };
};
const connectDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

export default connect(connectStateToProps, connectDispatchToProps)(Batchpayments);
				