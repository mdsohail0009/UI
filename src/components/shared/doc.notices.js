import { Alert, Result, Button, Spin } from 'antd'
import React, { useEffect } from 'react'
import { updateDocRequest } from '../../reducers/configReduser';
import { fetchNotices } from '../../reducers/dashboardReducer'
import ConnectStateProps from '../../utils/state.connect';

const DocNotices = (props) => {

    useEffect(() => {
        props.dispatch(fetchNotices(props.userProfile.id))
    }, [])
    return <React.Fragment style={{ top: 10 }}>
        <div className="main-container">
            {props?.dashboard?.notices?.data.length !== 0 && <Alert style={{ padding: 16 }} type="info" message={"Please submit the listed documents to proceed"} showIcon />}
            {props?.dashboard?.notices.loading === true ? <div className="text-center p-24"><Spin size="default" /></div> : <>{props?.dashboard?.notices?.data?.map(item => <Alert style={{ cursor: "pointer" }} type="error" showIcon onClick={() => props.history?.push("/cases?id=" + item.typeId)} message={item.title} description="Our Compliance Team is requesting documents in line with your recent transaction, Please click View Details. Thank you for your patience." />)}</>}
            {(props?.dashboard?.notices?.data == null || props?.dashboard?.notices?.data.length === 0) && !props?.dashboard?.notices.loading && < Result status="404"
                title={<h4 className="text-white">No request documents, Please click bellow button to go to cockpit.</h4>}
                extra={<Button className="pop-btn px-36" onClick={() => { props.dispatch(updateDocRequest(false)); props.history.push("/cockpit") }}>Go to Cockpit</Button>}
            />}
        </div>
    </React.Fragment>
}

export default ConnectStateProps(DocNotices)