import React, { useEffect, useState } from 'react';
import { Typography,Drawer,Space,Button } from 'antd';
import { connect } from 'react-redux';
import List from "../grid.component";
import AddBatchPayment from './addbatchPayment';

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
  const gridRef = React.createRef();
  const [isAddBatchDrawer, setIsAddBatchDrawer] = useState(false);
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
        },
        { field: "dateCreated", title: "Date created", filter: true,width: 200, },
        { field: "currency", title: 'Currency', filter: true, width: 200,dataType: "number", filterType: "numeric" },
        { field: "status", title: 'Status', filter: true, width: 237, },
        { field: "numberOfTransactions", title: 'Number of Transactions', filter: true, width: 150,dataType: "number", filterType: "numeric" },
        { field: "state", title: 'State', filter: true, width: 200, },
      ];
    
    const addBatchPayment = () => {
      setIsAddBatchDrawer(true);
    }
    const closeDrawer = () => {
    setIsAddBatchDrawer(false);
    }
      return (
        <>
        <span className='icon sm add mx-12'  onClick={addBatchPayment}></span>
        <span className='icon sm add  mx-12'></span>
        <span className='icon sm add'></span>
<div className="box basic-info text-white" style={{clear:'both'}}>
          <List
           className="bill-grid"
            showActionBar={false}
            url={process.env.REACT_APP_GRID_API + `MassPayments/UserPayments/${props.userConfig?.id}`}
            additionalParams={{type:"All"}}
            columns={gridColumns}
            ref={gridRef}
          />
        </div>
        <AddBatchPayment
                showDrawer={isAddBatchDrawer}
                onClose={() => closeDrawer()}
            />
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

export default connect(connectStateToProps, connectDispatchToProps)(Batchpayments);
