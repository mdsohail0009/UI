import React, {useEffect, useState } from 'react';
import { Row, Col, Typography,Button } from 'antd';
import {getAddress,} from "./api";
import { connect } from 'react-redux';
import apicalls from '../../api/apiCalls';

const { Title,Text } = Typography
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
const AddressFiatView=(props)=> {
    const [fiatAddress, setFiatAddress] = useState({});
    const [errorMsg,setErrorMsg]=useState(null)

  useEffect(() => {
		loadDataAddress();
	}, []);
    const loadDataAddress = async () => {
        setIsLoading(true)
        let response = await getAddress(props.match.params.id, 'fiat');
        if (response.ok) {
     
    
        if(response.data.addressType === "3rdparty"){
            setSelectParty(true);
        }
        else{
            setSelectParty(false);
        }
            setFiatAddress(response.data);
            setWithdrawValues(response.data);
            setAddressState(response.data.addressState);
            let fileInfo = response?.data?.documents?.details;
           
            if(response?.data?.addressType === "1stparty" &&  fileInfo?.length !=0){
                setDeclarationFile(response?.data?.documents?.details[0])
             
            }
            else{
                setIdentityFile(response?.data?.documents?.details[0]);
                 setAdressFile(response?.data?.documents?.details[1]);
              
            }
      
            setIsLoading(false)
        }else{
          setErrorMsg(apicalls.isErrorDispaly(response))
        }
    }
const backToAddressBook = () => {
  props?.history?.push('/userprofile');
};


    return (<>
      {errorMsg !== null && (
              <Alert
                type="error"
                description={errorMsg}
                onClose={() => setErrorMsg(null)}
                showIcon
              />
            )}
      <Title className="page-title">BENEFICIARY BANK DETAILS VIEW</Title>
      {fiatAddress && <Row gutter={8}>
        <Col xl={24} xxl={24} className="bank-view">
          <Row className="kpi-List">
          <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Address Label</label>
                <div className=" kpi-val">{fiatAddress?.favouriteName}</div>
                
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Address</label>
                <div className="kpi-val">{fiatAddress?.bankAddress}</div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Address Type</label>
                <div className=" kpi-val">{fiatAddress?.addressType}</div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Currency</label>
                <div className="kpi-val">
                <div className=" kpi-val">{fiatAddress?.toCoin}</div>
                  </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Bank Account Number/IBAN</label>
                <div className=" kpi-val">{fiatAddress?.accountNumber}</div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">BIC/SWIFT/Routing Number</label>
                <div className=" kpi-val">{fiatAddress?.routingNumber}</div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Bank Name</label>
                <div className="kpi-val">{fiatAddress?.bankName}</div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Bank Address Line 1</label>
                <div className="kpi-val">{fiatAddress?.bankAddress}</div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Country</label>
                <div className=" kpi-val">
                <div className="kpi-val">{fiatAddress?.country}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">State</label>
                <div className="kpi-val">
                  {fiatAddress?.state}
                  </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Zip Code</label>
                <div className=" kpi-val">
                <div className="kpi-val">{fiatAddress?.zipCode}</div>
                </div>
              </div>
            </Col>
            </Row>
            <Title className="page-title"> BENEFICIARY DETAILS VIEW</Title>
            <Row className="kpi-List">
            
           
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Recipient Full Name</label>
                <div className="kpi-val">
                  {fiatAddress?.beneficiaryAccountName}
                  </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Recipient Address Line 1</label>
                <div className=" kpi-val">
                <div className="kpi-val">{fiatAddress?.beneficiaryAccountAddress}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Address State</label>
                <div className="kpi-val">
                  {fiatAddress?.addressState}
                  </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Remarks</label>
                <div className="kpi-val">
                  {fiatAddress?.remarks}
                  </div>
              </div>
            </Col>
            {fiatAddress?.documents?.details.map((file)=>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
							<div className="docfile mr-0" key={file.id}>
								<span className={`icon xl file mr-16`} />
								<div
									className="docdetails c-pointer"
									// onClick={() => docPreview(file)}
                  >
									{file.name !== null ? (
										<EllipsisMiddle suffixCount={4}>
											{file.documentName}
										</EllipsisMiddle>
									) : (
										<EllipsisMiddle suffixCount={4}>Name</EllipsisMiddle>
									)}
								</div>
							</div>
            </Col>
            )}
          </Row>
        </Col>
      </Row>}
      <div className="text-right mt-24">
                  <Button
                            htmlType="submit"
                            size="large"
                            className="pop-btn mb-36"
                            style={{minWidth: 300}}
                            onClick={backToAddressBook}
                        >

          Cancel
        </Button>
        </div>
    </>);

}
const connectStateToProps = ({
  userConfig,
  addressBookReducer,
  sendReceive,

}) => {
  return {
      userConfig: userConfig.userProfileInfo,
      sendReceive,
      addressBookReducer,
  };
};

export default connect(connectStateToProps)(AddressFiatView);
