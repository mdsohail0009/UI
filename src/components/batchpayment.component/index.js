import React, { useEffect, useState } from 'react';
import { Typography,Drawer,Tooltip,Button ,Modal,Alert} from 'antd';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import List from "../grid.component";
import AddBatchPayment from './addbatchPayment';
import PaymentPreview from './paymentPreview';
import moment from "moment/moment";
import {getFileURL,deleteBatchPayments} from './api'
import FilePreviewer from "react-file-previewer";
import { bytesToSize } from "../../utils/service";
import { silentRenewError } from 'redux-oidc';
import ActionsToolbar from "../toolbar.component/actions.toolbar";
import { fetchFeaturePermissions, setSelectedFeatureMenu } from "../../reducers/feturesReducer";

const { Title, Text, Paragraph } = Typography;

const EllipsisMiddle = ({ suffixCount, children }) => {
	const start = children?.slice(0, children.length - suffixCount).trim();
	const suffix = children?.slice(-suffixCount).trim();
	return (
		<Text
			className="mb-0 fs-14 docnames c-pointer d-block"
			style={{ maxWidth: "100% !important" }}
			ellipsis={{ suffix }}>
			{start}
		</Text>
	);
};
const Batchpayments = (props) => {
 
const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const gridRef = React.createRef();
  const [isAddBatchDrawer, setIsAddBatchDrawer] = useState(false);
  const [isProceedBatchPayment, setProceedBatchPayment] = useState(false);
  const [previewPath, setPreviewPath] = useState(null);
	const [previewModal, setPreviewModal] = useState(false);
  const [selection,setSelection]=useState([])
  const [selectedObj,setSelectedObj]=useState({})
  const [errorWarning,setErrorWarning]=useState(null)
  const [permissions, setPermissions] = useState({});
  const [deleteModal,setDeleteModal]=useState(false);
  const [permissionsInterval,setPermissionsInterval]=useState(null)
  const [check,setCheck]=useState(false);

  useEffect(() => {
    //loadPermissions();
    //setPermissionsInterval(setInterval(loadPermissions, 200))

}, []);
  const showDrawer = () => {
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };
 
  const loadPermissions = () => {
    if (props.batchPaymentPermissions) {
			props.dispatch(setSelectedFeatureMenu(props.batchPaymentPermissions?.featureId));
			// clearInterval(permissionsInterval);
			let _permissions = {};
			for (let action of props.batchPaymentPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
      setPermissions(_permissions)
			if (!permissions?.view && !permissions?.View) {
				props.history.push("/accessdenied");
			}
		}
	}

  const viewMode = (e) => {
    const items=e.dataItem;
    const val = (items.id);
    props.history.push('/batchpayment/' + val + '/view');
  }
  const docPreview = async (file) => {
		let res = await getFileURL({ url: file.path });
		if (res.ok) {
			setPreviewModal(true);
			setPreviewPath(res.data);
		}
	};
const filePreviewPath = () => {
		return previewPath;

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
            <td><div className="gridLink" onClick={()=>viewMode(props)} >{props?.dataItem?.fileName}
              </div></td>) 
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
        { field: "numberOfTransactions", title: 'Number of Transactions', filter: true, width: 240,dataType: "number", filterType: "numeric", 
        customCell: (props) => (<td>
          <div className="gridLink" onClick={()=>docPreview()}
        >
          {props?.dataItem?.numberOfTransactions} 
        </div></td>) 
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
    setSelection(_selection);
    setSelectedObj(rowChecked.id)
  };
 const addBatchPayment = () => {
  setErrorWarning(null)
   setIsAddBatchDrawer(true);
 }
 const proceedBatchPayment = (e) => {
  if (selection.length === 0) {
    setErrorWarning("Please select the record");
  } else {
    setErrorWarning(null)
    setProceedBatchPayment(true);
    // const items=e.dataItem;
    // const val = (items.id);
    // props.history.push('/batchpayment/' + val + '/proceed');
 }
}
 const deleteBatchPayment=()=>{
  if(check){
    setErrorWarning("Please select the one record")
  }else{
  setDeleteModal(true)
  }
 }
 const deleteDetials = async () => {
const res=await deleteBatchPayments(selection[0])
if(res.ok){
setDeleteModal(false);
gridRef?.current?.refreshGrid();
setSelection([]);

}
};
    const closeDrawer = (isPreviewBack) => {
      if(isPreviewBack == "true") {
        setIsAddBatchDrawer(false);
      }
      else {
        setIsAddBatchDrawer(false);
      }
    setProceedBatchPayment(false);
    }
   const gotoDashboard=()=>{
      props.history.push('/cockpit')
    }
    const onActionClick = (key) => {
      const actions = {
        Refresh:"refresh",
        Add: addBatchPayment,
        Process: proceedBatchPayment,
        Delete: deleteBatchPayment
      };
      actions[key]();
    };
  
      return (
        <>
       
          <div className='main-container'>
        
              <div className='d-flex justify-content mb-16'>
                  <div>
                      <Title className="basicinfo mb-0"><span className='icon md c-pointer back mr-8' onClick={gotoDashboard}></span><Translate content="batch_payments" component={Text} className="basicinfo" /></Title>
                  </div>
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
          <Modal title="Delete Payment"
          destroyOnClose={true}
          closeIcon={<Tooltip title="Close"><span className="icon md c-pointer close" onClick={()=>setDeleteModal(false)} /></Tooltip>}
         
          visible={deleteModal}
          className="payments-modal"
          footer={[
            <>
            <div className='cust-pop-up-btn crypto-pop bill-pop'>
              <Button
                className="pop-cancel btn-width  bill-cancel"
                onClick={()=>setDeleteModal(false)}>Cancel</Button>
              <Button className="pop-btn px-36 btn-width"
                onClick={() =>deleteDetials(selectedObj)}>Ok</Button></div>
            </>
          ]}
        >
          <div className="fs-14 text-white-50">
            <Title className='fs-18 text-white-50'><span class="icon lg info-icon"></span> Delete Payment?</Title>
            <Paragraph className="fs-14 text-white-50 modal-para">Are you sure do you want to
              delete Payment ?</Paragraph>


          </div>
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
				