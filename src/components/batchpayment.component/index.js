import React, {useState } from 'react';
import { Typography,Tooltip,Button ,Modal,Alert} from 'antd';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import List from "../grid.component";
import AddBatchPayment from './addbatchPayment';
import PaymentPreview from './paymentPreview';
import moment from "moment/moment";
import {deleteBatchPayments,getInvalidTransactionData} from './api'

import ActionsToolbar from "../toolbar.component/actions.toolbar";
const { Title, Text, Paragraph } = Typography;
const Batchpayments = (props) => {
  const gridRef = React.createRef();
  const [isAddBatchDrawer, setIsAddBatchDrawer] = useState(false);
  const [isProceedBatchPayment, setProceedBatchPayment] = useState(false);
  const [selection,setSelection]=useState([])
  const [selectedObj,setSelectedObj]=useState({})
  const [errorWarning,setErrorWarning]=useState(null) 
  const [deleteModal,setDeleteModal]=useState(false);
  const [setSelectData, setSetSelectData] = useState({});
  const [errorMessage,setErrorMessage]=useState(null); 

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
          field: "fileName", title: "File Name", filter: true, width: 200,
          customCell: (props) => (
            <td>
              {props?.dataItem.status==="Draft"?<div  className='draft-filename'> {props?.dataItem?.fileName}</div>:
             <div className="gridLink batch-filename" onClick={()=>viewMode(props)} >
              {props?.dataItem?.fileName}</div>}
              </td>) 
        },
        { field: "createdDate", title: "Date Created", filter: true, filterType: "date", width: 200, 
        customCell: (props) => (
          <td>
              {props.dataItem?.createdDate ? <>{ moment.utc(props.dataItem?.createdDate).local().format("DD/MM/YYYY hh:mm:ss A")}</> : props.dataItem?.createdDate}
          
          </td>
        )
      },
        { field: "currency", title: 'Currency', filter: true, width: 150,dataType: "number", filterType: "numeric" },
        { field: "status", title: 'Status', filter: true, width: 150, },
        { field: "numberOfTransactions", title: 'Number of Transactions', filter: true, width: 250,dataType: "number", filterType: "numeric", 
        customCell: (props) => (<td>
        {props?.dataItem?.numberOfTransactions!==0? <div className="gridLink" onClick={()=>docPreview(props.dataItem)}
        >{props?.dataItem?.numberOfTransactions} 
        </div>:<>{props?.dataItem?.numberOfTransactions}</>}</td>) 
     },
     { field: "validTransactionCount", title: 'Valid Transactions', filter: true, dataType: "number", filterType: "numeric", width: 210, },
     { field: "invalidTransactionCount", title: 'Invalid Transactions', filter: true, dataType: "number", filterType: "numeric", width: 210,
         customCell: (props) => (
         <td>{props?.dataItem?.invalidTransactionCount!==0?<div onClick={()=>getInvalidTransaction(props?.dataItem)} className="gridLink" >{props?.dataItem?.invalidTransactionCount}
           </div>:<>{props?.dataItem?.invalidTransactionCount}</>}
           
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
  else if(setSelectData.status === "Pending"){
    setErrorWarning("Only draft record can proceed")
  }
  else if(setSelectData.validTransactionCount == 0){
    setErrorWarning("You don't have valid transactions to proceed")
  }
  else if(setSelectData.fileUploadStatus == "File is being processed please wait a while"){
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
    else if(setSelectData.status == "Pending"){
      setErrorWarning("Only draft record can delete")
    }
    else{
    setDeleteModal(true);
    }
   }
    const deleteDetials = async () => {
      const res = await deleteBatchPayments(selection[0])
      if (res.ok) {
          gridRef?.current?.refreshGrid();
      setDeleteModal(false);
        setSelection([]);
      }
      else{
        setErrorMessage(isErrorDispaly(res));
        setDeleteModal(false);
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
   const gotoDashboard=()=>{
      props.history.push('/cockpit')
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
                  <div className='d-flex justify-content align-center mb-16'>
                
                      <Title className="basicinfo mb-0"><span className='icon md c-pointer back mr-8' onClick={gotoDashboard}></span><Translate content="batch_payments" component={Text} className="basicinfo" />
                                      
                      <Text className='ml-4 text-yellow fs-16'> Proceed{" "}(<span className="icon md process-icon"/>)</Text><Text className='ml-4 text-white fs-16'>: To proceed the transaction,{" "}please click on proceed icon</Text>           
                      </Title>
                      <div className='batch-actions'>
                  <span className="mb-right">
          <ActionsToolbar featureKey="Batch_Payment" onActionClick={(key) => onActionClick(key)}/>
          </span>
                  </div>
              </div>
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
              <div className="box basic-info text-white" style={{ clear: 'both' }}>
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
                className="pop-cancel btn-width  bill-cancel"
                onClick={()=>deleteModalCancel()}>Cancel</Button>
              <Button className="pop-btn px-36 btn-width"
                onClick={deleteDetials}
                >Ok</Button></div>
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
				