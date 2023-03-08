import React, { Component } from 'react';
import { Drawer,Table } from 'antd';

const columns = [
{
    title: '',
    dataIndex: 'icon',
},
  {
    title: 'Tx Date',
    dataIndex: 'txdate',
    onFilter: (value, record) => record.txdate.indexOf(value) === 0,
    sorter: (a, b) => a.txdate.length - b.txdate.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Customer Id',
    dataIndex: 'customerid',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.customerid - b.customerid,
  },
  {
    title: 'Credit',
    dataIndex: 'credit',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.credit - b.credit,
  },
  {
    title: 'Debit',
    dataIndex: 'debit',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.debit - b.debit,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.status - b.status,
  },
  {
    title: 'Transaction Id',
    dataIndex: 'transactionid',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.transactionid - b.transactionid,
  },
];

const data = [
  {
    key: '1',
    icon: (<span className="bg-color"><i className="icon md sentarrow c-pointer"></i></span>),
    txdate: (<div><p className="mb-0 fs-16 fw-600">Sent</p><p className="mb-0 fs-12">Aug 10, 2021</p></div>),
    customerid: 'Madhubaabu',
    credit: (<div><p className="mb-0 fs-12">(USD)</p><p className="mb-0 fs-16 fw-600">189,744.94099586</p></div>),
    debit: (<div><p className="mb-0 fs-12">(USD)</p><p className="mb-0 fs-16 fw-600">0</p></div>),
    status: 'Transferred',
    description:'Topup 189781.86-USD to USDT-189,744.94',
    transactionid: 'f4388d0c-c326-48f8-8f85-6202e8ba746a'
  },
  {
    key: '2',
    icon: (<span className="bg-color"><i className="icon md sentarrow c-pointer"></i></span>),
    txdate: (<div><p className="mb-0 fs-16 fw-600">Sent</p><p className="mb-0 fs-12">Aug 10, 2021</p></div>),
    customerid: 'Madhubaabu',
    credit: (<div><p className="mb-0 fs-12">(USD)</p><p className="mb-0 fs-16 fw-600">0</p></div>),
    debit: (<div><p className="mb-0 fs-12">(USD)</p><p className="mb-0 fs-16 fw-600">1.1111</p></div>),
    status: 'Transferred',
    description:'Topup 189781.86-USD to USDT-189,744.94',
    transactionid: 'f4388d0c-c326-48f8-8f85-6202e8ba746a'
  },
  {
    key: '3',
    icon: (<span className="bg-color"><i className="icon md sentarrow c-pointer"></i></span>),
    txdate: (<div><p className="mb-0 fs-16 fw-600">Sent</p><p className="mb-0 fs-12">Aug 10, 2021</p></div>),
    customerid:'Madhubaabu',
    credit: (<div><p className="mb-0 fs-12">(USD)</p><p className="mb-0 fs-16 fw-600">189,744.94099586</p></div>),
    debit: (<div><p className="mb-0 fs-12">(USD)</p><p className="mb-0 fs-16 fw-600">19,44.94099586</p></div>),
    status: 'Transferred',
    description:'Topup 189781.86-USD to USDT-189,744.94',
    transactionid: 'f4388d0c-c326-48f8-8f85-6202e8ba746a'
  },
  {
    key: '4',
    icon: (<span className="bg-color"><i className="icon md recivearrow c-pointer"></i></span>),
    txdate: (<div><p className="mb-0 fs-16 fw-600">Received</p><p className="mb-0 fs-12">Aug 10, 2021</p></div>),
    customerid: 'Madhubaabu',
    credit: (<div><p className="mb-0 fs-12">(USDT)</p><p className="mb-0 fs-16 fw-600">0</p></div>),
    debit: (<div><p className="mb-0 fs-12">(USDT)</p><p className="mb-0 fs-16 fw-600">19,74.4099586</p></div>),
    status: 'Transferred',
    description:'Topup 189781.86-USD to USDT-189,744.94',
    transactionid: 'f4388d0c-c326-48f8-8f85-6202e8ba746a'
  },
  {
    key: '5',
    icon: (<span className="bg-color"><i className="icon md sentarrow c-pointer"></i></span>),
    txdate: (<div><p className="mb-0 fs-16 fw-600">Sent</p><p className="mb-0 fs-12">Aug 10, 2021</p></div>),
    customerid: 'Madhubaabu',
    credit: (<div><p className="mb-0 fs-12">(USD)</p><p className="mb-0 fs-16 fw-600">0</p></div>),
    debit: (<div><p className="mb-0 fs-12">(USD)</p><p className="mb-0 fs-16 fw-600">189,744.94099586</p></div>),
    status: 'Transferred',
    description:'Topup 189781.86-USD to USDT-189,744.94',
    transactionid: 'f4388d0c-c326-48f8-8f85-6202e8ba746a'
  },
  {
    key: '6',
    icon: (<span className="bg-color"><i className="icon md recivearrow c-pointer"></i></span>),
    txdate: (<div><p className="mb-0 fs-16 fw-600">Received</p><p className="mb-0 fs-12">Aug 10, 2021</p></div>),
    customerid: 'Madhubaabu',
    credit: (<div><p className="mb-0 fs-12">(USDT)</p><p className="mb-0 fs-16 fw-600">189,744.93922287</p></div>),
    debit: (<div><p className="mb-0 fs-12">(USDT)</p><p className="mb-0 fs-16 fw-600">0</p></div>),
    status: 'Transferred',
    description:'Topup 189781.86-USD to USDT-189,744.94',
    transactionid: 'f4388d0c-c326-48f8-8f85-6202e8ba746a'
  },
  {
    key: '7',
    icon: (<span className="bg-color"><i className="icon md recivearrow c-pointer"></i></span>),
    txdate: (<div><p className="mb-0 fs-16 fw-600">Received</p><p className="mb-0 fs-12">Aug 10, 2021</p></div>),
    customerid: 'Madhubaabu',
    credit: (<div><p className="mb-0 fs-12">0</p><p className="mb-0 fs-16 fw-600">(USD)</p></div>),
    debit: (<div><p className="mb-0 fs-12">(USD)</p><p className="mb-0 fs-16 fw-600">81,144.94099586</p></div>),
    status: 'Transferred',
    description:'Topup 189781.86-USD to USDT-189,744.94',
    transactionid: 'f4388d0c-c326-48f8-8f85-6202e8ba746a'
  },
];


 
class History extends Component {
  render() {
    return (
      <>
        <Drawer
          title={[<div className="side-drawer-header">
               <span className="text-white">History</span>
                <div className="text-center fs-14"></div>
                <span  onClick={this.props.handleClick} className="icon md close-white c-pointer"/>
                </div>]}
          placement="right"
          closable={false}
          width="100%"
          onClose={this.props.handleClick}
          visible={this.props.showDrawer}
          className="side-drawer-full"
        >
       <Table columns={columns} dataSource={data}  />
        </Drawer>
      </>
    );
  }
}
 
export default History