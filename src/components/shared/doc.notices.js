import { Alert, Result, Button, Spin,Typography,Drawer } from 'antd'
import React, { useEffect, useState } from 'react'
import { updateDocRequest } from '../../reducers/configReduser';
import { fetchNotices } from '../../reducers/dashboardReducer'
import ConnectStateProps from '../../utils/state.connect';
import Translate from 'react-translate-component';
import AddressCrypto from "../addressbook.component/addressCrypto";
import {
	rejectCoin,
	clearValues,
	clearCryptoValues,
} from '../../reducers/addressBookReducer';
const { Paragraph } = Typography;
const DocNotices = (props) => {
    const [hideFiatHeading,setHideFiatHeading]=useState(false);
    const [cryptoId,setCryptoId]=useState("");
    const [beneficiaryDetails,setBeneficiaryDetails]=useState(false);
    useEffect(() => {
        props.dispatch(fetchNotices(props.userProfile.id))
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

 const goToDetails=(data)=>{
        if(data.isReqforDoc)
        {
            props.history?.push("/cases?id=" + data.typeId)
        }else{
            setBeneficiaryDetails(true);
            setHideFiatHeading(false);
            setCryptoId(data.docTypeId)

        }
       
    }
   const closeCryptoDrawer=()=>{
        setBeneficiaryDetails(false);
        props.dispatch(rejectCoin());
		props.dispatch(clearValues());
		props.dispatch(clearCryptoValues());
		
	}
   const headingChange=(data)=>{
        setHideFiatHeading(data);
	}
    return <React.Fragment style={{ top: 10 }}>
        <div className="main-container">
            {props?.dashboard?.notices?.data.length !== 0 && <Alert style={{ padding: 16 }} type="info" message={"Please submit the listed documents to proceed"} showIcon />}
            {props?.dashboard?.notices.loading === true ? <div className="text-center p-24"><Spin size="default" /></div> : <>{props?.dashboard?.notices?.data?.map(item => <Alert style={{ cursor: "pointer" }} type="error" showIcon onClick={() =>goToDetails(item) } message={item.title} description={item.isReqforDoc?"Our Compliance Team is requesting documents in line with your recent transaction, Please click View Details. Thank you for your patience.":"We kindly ask our clients to comply with the Travel Rule and to verify their crypto source and address. Thank you for your cooperation."} />)}</>}
            {(props?.dashboard?.notices?.data == null || props?.dashboard?.notices?.data.length === 0) && !props?.dashboard?.notices.loading && < Result status="404"
                title={<h4 className="text-white">No request documents, Please click below button to go to dashboard.</h4>}
                extra={<Button className="pop-btn" onClick={() => { props.dispatch(updateDocRequest(false)); props.history.push("/cockpit") }}>Go to Dashboard</Button>}
            />}
        </div>
        <Drawer
          destroyOnClose={true}
          title={[<div className="side-drawer-header" key={""}>
            <span />
            <div className="text-center">
              <Paragraph className="drawer-maintitle"><Translate content={hideFiatHeading !==true && "AddFiatAddress"}component={Paragraph} className="drawer-maintitle" /></Paragraph>
            </div>
            <span onClick={closeCryptoDrawer} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={true}
          visible={beneficiaryDetails}
          closeIcon={null}
          className=" side-drawer"
          size="large"
        >
          <AddressCrypto type="manual" cryptoTab={1} onCancel={(obj) => closeCryptoDrawer(obj)} props={props}  headingUpdate={headingChange} isSave={true} cryptoId={cryptoId}/>
        </Drawer>
    </React.Fragment>
}

export default ConnectStateProps(DocNotices)