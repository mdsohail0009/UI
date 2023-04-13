import React, { useEffect, useState } from 'react';
import apiCalls from '../../api/apiCalls'
import { Table ,Alert,Empty,Form} from 'antd';
import NumberFormat from 'react-number-format';
import Loader from '../../Shared/loader';
import { connect } from 'react-redux';
import Translate from "react-translate-component";
import {Link } from "react-router-dom";
const Fees = (props) => {
  const [feeData, setfeeData] = useState()
  const [loader, setLoader] = useState()
  const [error, setError] = useState()
  const [commFees, setCommFees] = useState([])
  useEffect(() => {
    getcustomersfeeData()
  }, [])
  const getcustomersfeeData = async () => {
    setLoader(true)
    let res = await apiCalls.getcustomersFees(props.userConfig.id)
    if (res.ok) {
      setLoader(false)
      res.data.customerTiers=res.data.customerTiers?res.data.customerTiers:[]
      setfeeData(res.data);
      let products = res.data.commissionTierFees
      const groupByCategory = products.reduce((group, product) => {
        const { operation} = product;
        group[operation] = group[operation] ?? [];
        group[operation].push(product);
        return group;
      }, {});
      const tableData = Object.entries(groupByCategory);
      setCommFees(tableData)
    } else {
      setLoader(false); setError(apiCalls.isErrorDispaly(res));
    }
  }
    const columns=[
        {
            title: '',
            dataIndex: '',
            children:[
                {
                    title: 'Tier',
                    dataIndex: 'name',
                    key: 'name',
                    width: 150,
                  },
                  {
                    title: '30-Day Volume(USD)',
                    dataIndex: 'fromValue',
                    key: 'fromValue',
                    width: 150,
                    render:(_,row)=>{return <div>${row.fromValue} - ${row.toValue}</div>}
                  }
            ]
        },
        {
            title: 'Fiat',
            dataIndex: '',
            children:[
                {
                    title: 'Withdraw',
                    dataIndex: 'withdrawFiat',
                    key: 'withdrawFiat',
                    width: 150,
                    render:(_,row)=>{return <div>{row.withdrawFiat}%</div>}
                  },
                  {
                    title: 'Deposit',
                    dataIndex: 'depositFiat',
                    key: 'depositFiat',
                    width: 150,
                    render:(_,row)=>{return <div>{row.depositFiat}%</div>}
                  }
            ]
        }, {
            title: 'Crypto',
            dataIndex: '',
            children:[
                {
                    title: 'Withdraw',
                    dataIndex: 'withdrawCrypto',
                    key: 'withdrawCrypto',
                    width: 150,
                    render:(_,row)=>{return <div>{row.withdrawCrypto}%</div>}
                  },
                  {
                    title: 'Deposit',
                    dataIndex: 'depositCrypto',
                    key: 'depositCrypto',
                    width: 150,
                    render:(_,row)=>{return <div>{row.depositCrypto}%</div>}
                  }, {
                    title: 'Buy',
                    dataIndex: 'buy',
                    key: 'buy',
                    width: 150,
                    render:(_,row)=>{return <div>{row.buy}%</div>}
                  },
                  {
                    title: 'Sell',
                    dataIndex: 'sell',
                    key: 'sell',
                    width: 150,
                    render:(_,row)=>{return <div>{row.sell}%</div>}
                  }
            ]
        }
    ]
    return <>
    {loader?<Loader/>:
        <div className="main-container">
          <div className="backbtn-arrowmb"><Link  to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link></div>
          <div className="grid-title">Fees & Tier Structure</div>
             {error && <Alert type="error" showIcon closable={false} description={error} />}
            <div className="grid-title">Fees for Transaction</div>
        
            {/* {commFees.length!=0&&<div className='transaction-custom-table  fee-table p-0'>
            <div className='responsive_table db-ts-grid'>
              <table className='pay-grid view mb-view commision-fee-custtable'>
                <thead style={{borderTopLeftRadius:20}}>
                  <tr className='cust-tr-style'>
                    {commFees.map(([bankName, items]) => <th className='k-link'>{bankName} {items[0].currency&&<>({items[0].currency})</>}<br></br>
                    </th>)}
                    
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {commFees.map(([bankName, items]) => <td className='fee-withdraw'>
                      <table style={{ textAlign: "center",width:'100%' }}>
                        <tr>
                          {items.map((item) => <td>{item.operation}</td>)}
                        </tr>
                        <tr>
                          {items.map((item1) => <td style={{height:38}}><div className='ts-date'>{item1.flatFee}</div>
                          </td>)}
                        </tr>
                      </table>
                    </td>)}
                  </tr>

                </tbody>
              </table>
          </div>
          </div>} */}
           <div className="table-scroll responsive_table">
            <table className="commision-table table-border edit-commition-table view-commition-table" border="1">
                  <thead><tr className="table-header-row">
                    
                        <th className="text-center" colSpan={6} >Suissebase Fees</th>
                   
                  </tr></thead>
               <tbody>
                {commFees?.map(([operation,items])=>(
                  <React.Fragment key={operation}>
                    <tr>
                      <td style={{width:"100px"}}>{operation}</td>
                     
                      <td className="p-0" >

                        {items?.map((item) => (<>

                          <table className="row-border inside-table"width="100%" >
                            <tr>
                              <td style={{ width: "150px" }}>{item.currencyType} <br/>{item.currency}</td>
                              <td style={{ width: "150px" }} >{item.bankName}
                              {" "} {item.status==="Inactive"? <span className="file-labels ml-8 fs-12 address-label address-label-width">Inactive</span>:" "}
                              </td>
                              <td style={{ width: "150px" }}>
                                <Form.Item className="customised-input">
                                  <div className="d-flex align-center">
                                    {/* <span className={item.isMinMax ? item.isMinMax === true && "icon md greenCheck mr-8" : "icon md greyCheck"}></span> */}

                                    <label>Min: <span className="minmax-value"><>{item.minFee?<>{`${item.minFee}`}</>:"-"}</></span></label>
                                  </div>
                                </Form.Item>
                              </td>
                              <td style={{ width: "150px" }}>
                                <Form.Item className="customised-input">
                                  <div className="d-flex align-center">
                                    <label>Max:<span className="minmax-value"><>{item.maxFee?<>{`${item.maxFee}%`}</>:"-"}</></span></label>
                                  </div>
                                </Form.Item>
                              </td>
                              <td style={{ width: "150px" }}>
                                <Form.Item className="customised-input">
                                  <div className="d-flex align-center">
                                    {/* <span className={item.isFlat ? item.isFlat === true && "icon md greenCheck mr-8" : " icon md greyCheck  mr-8"}></span> */}
                                    <label>Flat: <span className="minmax-value"><>{item.flatFee?<>{`${item.flatFee}`}</>:"-"}</></span></label>
                                  </div>
                                </Form.Item>
                              </td>

                                  </tr>
                          </table>
                        </>))}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
               </tbody>
                </table>
                
          </div>
          {commFees.length==0&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
            <Translate content="No_data" />
          } />}
            <div className="grid-title text-style">Fee discount for each tier</div>
            {feeData?.customerTiers.length!=0&&<div> {feeData&&<div className="transaction-custom-table p-0 responsive_table">
                           
            <Table className="fee-discount-table" columns={columns} dataSource={feeData.customerTiers} pagination={false} /></div>}</div>}
           {(feeData?.customerTiers?.length==0)&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                        <Translate content="No_data" />
                    } />}
            <p className='note-cont text-style'>Past 30 days trading volume(Upon fiat withdrawal or deposit, crypto buy/sell or withdrawal/deposit)</p>
        <p  className='note-cont'>Your current tier : {feeData?.tradeVolumes[0]?.currentTier}</p>
        <span  className='note-cont'>Trading volume (30 days)  : </span><NumberFormat value={feeData?.tradeVolumes[0]?.tradingVloume} className="drawer-list-font" displayType={'text'} thousandSeparator={true} prefix={'$'} />
        
         
              
         
     </div>}
</>

}
const connectStateToProps = ({ userConfig, }) => {
  return { userConfig: userConfig.userProfileInfo,}
}

export default connect(connectStateToProps)(Fees);
