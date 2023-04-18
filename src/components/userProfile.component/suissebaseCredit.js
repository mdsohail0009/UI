import React, { useEffect, useState } from 'react';
import { Typography,Form,Row, Col,Input,message,Alert } from 'antd';
import Translate from 'react-translate-component';
import { getSuissebaseCredit ,saveSuissebaseCrediate} from '../../api/apiServer';
import { connect } from "react-redux";
import Loader from '../../Shared/loader';
import apicalls from '../../api/apiCalls';
const { Text,Title } = Typography;
const SuisseBaseCreditCom=(props)=>{
    const [form] = Form.useForm();
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const [suissebaseCreditBalance,setSuissebaseCreditBalance]=useState([]);
    const [disable,setDisabled]=useState(false)  
    const [isSuissebaseCredit,setisSuissebaseCredit]=useState(false)
    const[errorMsg,setErrorMsg]=useState(null);
    useEffect(()=>{
            getSuissebaseCreditData();
        },[])

    const getSuissebaseCreditData=async()=>{
        setIsLoading(true);
        setErrorMsg(null)
        let res = await getSuissebaseCredit(props.userConfig.id)
        if(res.ok){
            setDisabled(true)
            setIsLoading(false);
            setSuissebaseCreditBalance(res.data);
            setisSuissebaseCredit(res.data.isSuissebaseCredit)
            form.setFieldsValue({credit:res?.data.credit?.toLocaleString(),isSuissebaseCredit:res.data.isSuissebaseCredit})          
        }else {
            setIsLoading(false);
            setErrorMsg(apicalls.isErrorDispaly(res))
        }
    }

    const saveSuisseBaseCreadiateData=async(values)=>{
        setBtnDisabled(true)
        setErrorMsg(null)
        let obj={
           id:props.userConfig.id,
            isSuissebaseCredit:values,
            ModifiedBy:props.userConfig.userName,
            ModifiedDate:new Date(),
        }            
        let res = await saveSuissebaseCrediate(obj);
        if(res.ok){            
            message.destroy()
            message.success({content:(values===true && "SuisseBase credits activated successfully" || values==false &&"SuisseBase credits deactivated successfully"),className: 'custom-msg',duration:3 })
            setBtnDisabled(false);
        }else {
            setBtnDisabled(false);
            setErrorMsg(apicalls.isErrorDispaly(res))
        }
    }
  
    const handlechange=(e)=>{
        setisSuissebaseCredit(e.target.checked)
        saveSuisseBaseCreadiateData(e.target.checked);
    }
    return(<> 
    <Form layout="vertical" form={form} initialValues={suissebaseCreditBalance} onFinish={saveSuisseBaseCreadiateData}>
  
        <div className="basicprofile-info">
        {errorMsg !== null && (
        <Alert
          className="mb-12"
          type="error"
          description={errorMsg}
          showIcon
        />
      )}
        {isLoading ? (
						<Loader />
					) : (<>
            <Translate content="suissebase_credit" className="basicinfo" component={Title}/>
            <p></p>
            <Row className="order-bottom add-custom">
                <Col sm={24} md={24} xs={24} xl={24} className="">
                    <Text className="label-style"><Translate content="suissebasecredits" /> (USD)</Text>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="credit"
                        required
                        rules={[
                            { required: true, message: "Is required" },
                        ]}
                       
                    >
                         <Input placeholder="Suisse Base Credits"  disabled={disable} 
                            className="cust-input cust-select mb-0"
                           >
                        </Input>
                      </Form.Item>
                      </Col>  <Col sm={24} md={24} xs={24} xl={24} className="">
                            <Form.Item
                                            className="custom-forminput mb-36 agree send-crypto-sumry"
                                            name="isSuissebaseCredit"
                                            valuePropName="checked"
                                            required
                                        >				
                                            <div className={`d-flex align-center mt-16`}>
                                            <label className="custom-checkbox c-pointer cust-check-outline">
                                                <Input
                                                    name="check"
                                                    type="checkbox"
                                                    className="c-pointer"
                                                    checked={isSuissebaseCredit}   
                                                    onChange={(e)=>handlechange(e)}
                                                />
                                                <span></span>
                                                </label>
                                    <div
                                        className="security-label-style"
                                        >
                                    Use SuisseBase Credits if Available for all transactions fees
                                    </div>
                                </div>
                                            
                                        </Form.Item></Col>
            </Row>
            </> )}
        </div>
    </Form>
    </>)
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

export default connect(connectStateToProps)(SuisseBaseCreditCom);