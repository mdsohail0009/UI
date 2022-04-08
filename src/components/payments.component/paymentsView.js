import React, { Component } from 'react';
import { getPaymentsData,getBankData } from './api';
import { Typography, Button, Spin,message,Alert,Popover,Upload } from 'antd';
import Translate from 'react-translate-component';
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
const { Title, Text } = Typography;
const { Dragger } = Upload;
class PaymentsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentsData: [],
            currency:'USD',
            loading: false,
            amount:0
        }
        this.useDivRef = React.createRef();
    }
    componentDidMount() {
        this.getPaymentsViewData();
    }
    getPaymentsViewData = async () => {
        this.setState({ ...this.state, loading: true });
        let response = await getPaymentsData(this.props.match.params.id, this.props.userConfig?.userId,this.state.currency);
        if (response.ok) {
            this.setState({ ...this.state, paymentsData: response.data.paymentsDetails, loading: false });
        }else {
            message.destroy();
            this.setState({ ...this.state, errorMessage: response.data})
            this.useDivRef.current.scrollIntoView()
        }
    }
    moreInfoPopover = async (id, index) => {
        this.setState({ ...this.state, tooltipLoad: true });
        let response = await getBankData(id);
        if (response.ok) {
            this.setState({
                ...this.state, moreBankInfo: response.data, visible: true, tooltipLoad: false
            });
        } else {
            this.setState({ ...this.state, visible: false, tooltipLoad: false });
        }
    }
    handleVisibleChange = (index) => {
        this.setState({ ...this.state, visible: false });
    }
    popOverContent = () => {
        const { moreBankInfo, tooltipLoad } = this.state;
        if (tooltipLoad) {
            return <Spin />
        } else {
            return (<div className='more-popover'>
                <Text className='lbl'>Address Label</Text>
                <Text className='val'>{moreBankInfo?.favouriteName}</Text>
                <Text className='lbl'>Recipient Full Name</Text>
                <Text className='val'>{moreBankInfo?.beneficiaryAccountName}</Text>
                <Text className='lbl'>Recipient Address</Text>
                <Text className='val'>{moreBankInfo?.beneficiaryAccountAddress}</Text>
                <Text className='lbl'>BIC/SWIFT/Routing Number</Text>
                <Text className='val'>{moreBankInfo?.routingNumber}</Text>
                <Text className='lbl'>Bank Address</Text>
                <Text className='val'>{moreBankInfo?.bankAddress}</Text>
            </div>)
        }
    }
    backToPayments = () => {
        this.props.history.push('/payments')
    }
    render() {
        const total=(this.state.paymentsData.reduce((total,currentItem) =>  total = total + currentItem.amount , 0 ));
        const { paymentsData, loading } = this.state;
        return (
            <>
             <div ref={this.useDivRef}></div>
                <div className="main-container">
                {this.state.errorMessage != null && (
                            <Alert
                                description={this.state.errorMessage}
                                type="error"
                                closable
                                onClose={() => this.handleAlert()}
                            />
                        )}
                    <Title className="basicinfo mb-16"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    <div className="box basic-info">
                        <table className='pay-grid view'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Bank Name</th>
                                    <th>BIC/SWIFT/Routing Number</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentsData?.map((item, idx) => {
                                    return (
                                        <>
                                          {paymentsData.length > 0? <> <tr key={idx}>
                                          <td>{item?.beneficiaryAccountName}</td>
                                                <td>
                                                    <div className='d-flex align-center justify-content'>
                                                    {item.bankname}
                                                            <Popover
                                                                    className='more-popover'
                                                                    content={this.popOverContent}
                                                                    trigger="click"
                                                                    visible={item.visible}
                                                                    placement='top'
                                                                    onVisibleChange={() => this.handleVisibleChange(idx)}
                                                                >
                                                                    <span className='icon md info c-pointer' onClick={() => this.moreInfoPopover(item.addressId, idx)} />
                                                                </Popover>
                                                                </div>
                                                </td>
                                                <td>{item.accountnumber}</td>
                                                <td>
                                                    <NumberFormat
                                                        value={item.amount}
                                                        thousandSeparator={true}
                                                        displayType={'text'}
                                                        renderText={value => value}
                                                    />
                                                    <br/>
                                                    <Text className='file-label fs-12'>{item.documents?.details.length>0 && item.documents?.details[0]?.documentName}</Text>  
                                                </td>
                                            </tr>
                                            </>
                                        :"No bank details available."}</>
                                    )
                                })}

                                {loading && <tr>
                                    <td colSpan='3' className='text-center p-16'><Spin size='default' /></td></tr>}
                            </tbody>
                            <tfoot><tr>
                                <div >
                                <span className='text-white fs-24'> Total:</span>
                                <span className='text-white fs-24'> {total}</span>
                                </div>
                                    </tr>  
                            </tfoot>
                        </table>
                        <div className="text-right mt-36">
                            <Button
                                className="pop-btn px-36"
                                style={{ margin: "0 8px" }}
                                onClick={this.backToPayments}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};
export default connect(connectStateToProps, null)(PaymentsView);