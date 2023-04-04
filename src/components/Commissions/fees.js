import React, { useEffect, useState } from 'react';
import apiCalls from '../../api/apiCalls'
import { Table ,Alert} from 'antd';
import NumberFormat from 'react-number-format';
import Loader from '../../Shared/loader';
import { connect } from 'react-redux';
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
      setfeeData(res.data);
      let products = res.data.commissionTierFees
      const groupByCategory = products.reduce((group, product) => {
        const { bankName} = product;
        group[bankName] = group[bankName] ?? [];
        group[bankName].push(product);
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
             {error && <Alert type="error" showIcon closable={false} description={error} />}
            <div className="coin-viewstyle">Fees for Transaction</div>
        
           <div className='transaction-custom-table db-transactions'>
            <div className='responsive_table db-ts-grid'>
         <table className='pay-grid view mb-view commision-fee-custtable' border="1" style={{color:"#ffffff"}}>
         {commFees.map(([bankName, items]) =><thead>
            <tr className='first-header' >
              <th colSpan={2}>{bankName}<br/></th>
            </tr>
            {items.map((item) =><><tr>
              <th>{item.operation}</th>
            </tr>
            <tr>
              <td>{item.flatFee}</td>
            </tr></>)}
          </thead>)}
            {/* <thead>
           <tr className='cust-tr-style'>
           {commFees.map(([bankName, items]) =><th >{bankName} <br></br>(USD)
                </th>)}
              </tr>
            </thead>
           <tbody>
           <tr>
           {commFees.map(([bankName, items]) =><td className="p-16">
            <table style={{width:"100%",textAlign: "center"}}>
            <tr>
            {items.map((item) =><td>{item.operation}</td>)}
                </tr>
                <tr>
                {items.map((item1) =><td><div className='ts-date'>{item1.flatFee}</div>
                  </td>)}
                </tr>
              </table>
            </td>   )}
            </tr>
           
           </tbody> */}
          </table>
          </div>
          </div>
            <div className="coin-viewstyle">Fee discount for each tier</div>
           <div style={{backgroundColor:'white'}}> {feeData&&<Table columns={columns} dataSource={feeData.customerTiers} pagination={false} />}</div>
            <p style={{color:'white'}}>Past 30 days trading volume(Upon fiat withdrawal or deposit, crypto buy/sell or withdrawal/deposit)</p>
        <p style={{color:'white'}}>Your current tier:{feeData?.tradeVolumes[0]?.currentTier}</p>
        <span style={{color:'white'}}>Trading volume (30 days)  : </span><NumberFormat value={feeData?.tradeVolumes[0]?.tradingVloume} className="drawer-list-font" displayType={'text'} thousandSeparator={true} prefix={'$'} />
        
         
              
         
     </div>}
</>

}
const connectStateToProps = ({ userConfig, }) => {
  return { userConfig: userConfig.userProfileInfo,}
}

export default connect(connectStateToProps)(Fees);
