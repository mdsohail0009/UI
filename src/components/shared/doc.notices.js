import { Alert, Result, Button } from 'antd'
import React, { useEffect } from 'react'
import { fetchNotices } from '../../reducers/dashboardReducer'
import connectStateProps from '../../utils/state.connect'
const DocNotices = (props) => {
    useEffect(() => {
        props.dispatch(fetchNotices(props.userProfile.id))
    }, [])
    return <React.Fragment style={{ top: 10 }}>
        <Alert style={{ margin: 20, height: 50, padding: 10 }} type="info" message={"Please submit the listed documents to proceed"} showIcon />
        {props?.dashboard?.notices?.data?.map(item => <Alert style={{ margin: 20, cursor: "pointer" }} type="error" showIcon onClick={() => props.history?.push("/documents?id=" + item.typeId)} message={item.title} />)}
        {props?.dashboard?.notices?.data==null&&<Result
            status="404"
            title={<h4 className="text-white">No request documents, Plese click bellow button to goto dashboard.</h4>}
            extra={<Button className="pop-btn px-36" onClick={() => props.history.push("/dashboard")}>Go to Dashboard</Button>}
        />}
    </React.Fragment>
}

export default connectStateProps(DocNotices)