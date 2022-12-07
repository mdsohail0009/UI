import React, { useEffect, useState } from 'react';
import { Typography,List } from 'antd';

const { Title, Text, Paragraph } = Typography;
const Batchpayments = (props) => {
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
          field: "createdDate", title: "sd", filter: true, filterType: "date",width: 200,
        //   customCell: (prop) => (
        //     <td><div className="gridLink" onClick={() => paymentsView(prop)}>
        //       <Moment format="DD/MM/YYYY">{moment(new Date(prop.dataItem.createdDate), "DD/MM/YYYY")}</Moment></div></td>)
        },
        { field: "currency", title: "sd", filter: true,width: 200, },
        { field: "totalAmount", title: 'Total Amount', filter: true, width: 200,dataType: "number", filterType: "numeric" },
        { field: "approvedAmount", title: 'Approved Amount', filter: true, width: 237, },
        { field: "count", title: 'Count', filter: true, width: 150,dataType: "number", filterType: "numeric" },
        { field: "state", title: 'State', filter: true, width: 200, },
      ];
    // const gridRef = React.createRef();
    // useEffect(()=>{
    //     gridRef.current?.refreshGrid();
    //   },[walletType]);;//eslint-disable-line react-hooks/exhaustive-deps
      return (
        <>
<div className="box basic-info text-white" style={{clear:'both'}}>
          <List
           className="bill-grid"
            showActionBar={false}
            url={process.env.REACT_APP_GRID_API + `MassPayments/UserPayments/${props.userConfig?.id}`}
            columns={gridColumns}
            // ref={gridRef}
          />
        </div>
        </>
      )
}
export default Batchpayments;