import React, { useEffect, useState } from 'react';
import { Typography,Drawer,Space,Button } from 'antd';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import List from "../grid.component";

const { Title, Text, Paragraph } = Typography;
const BatchpaymentView = (props) => {
    const gridRef = React.createRef();
    const gridColumns = [
        {
          field: "",
          title: "",
          width: 50,
          customCell: (prop) => (
            <td className="text-center">
              1
            </td>
          )
        },
        { field: "whitelistName", title: "Whitelist Name", filter: true, filterType: "date",width: 200,},
        { field: "beneficiaryName", title: "Beneficiary Name", filter: true,width: 200, },
        { field: "whitelistStatus", title: 'Whitelist Status', filter: true, width: 200,dataType: "number", filterType: "numeric", customCell: (prop) => (<td className='text-center'>Whitelisted</td>) },
        { field: "AccountNumber/IBAN", title: 'Account Number/IBAN', filter: true, width: 200, },
        { field: "numberOfTransactions", title: 'Number of Transactions', filter: true, width: 200,dataType: "number", filterType: "numeric",},
        { field: "Amount", title: 'Amount', filter: true, width: 200, },
        { field: "transactionStatus", title: 'Transaction Status', filter: true, width: 200,
        customCell: (prop) => (<td className='text-center'>Pending</td>)
    },
        { field: "uploadedDocuments", title: 'Uploaded Documents', filter: true, width: 200, },
        { field: "supportingDocument", title: 'Supporting Document', filter: true, width: 200,
            customCell: (prop) => (
            <td className='text-center'><div className="gridLink text-center" ><Button className='pop-btn px-16'>Upload</Button>
              </div></td>)
        },
      ];
    return (
        <>
            <Title className="basicinfo mb-0"><span className='icon md c-pointer back mr-8' /><Translate content="batch_payments" component={Text} className="basicinfo" /></Title>
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
  
  export default connect(connectStateToProps, connectDispatchToProps)(BatchpaymentView);