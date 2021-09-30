import { Alert } from 'antd'
import React from 'react'
import connectStateProps from '../../utils/state.connect'
const DocNotices = (props) => {
    return <React.Fragment style={{ top: 10 }}>
        <Alert style={{ margin: 20, height: 50,padding:10 }} type="info" message={"Please submit the listed documents to proceed"} showIcon />
        {props?.dashboard?.notices?.data?.map(item => <Alert style={{ margin: 20,cursor:"pointer" }} type="error" showIcon onClick={() => props.history?.push("/documents?id=" + item.typeId)} message={item.title} />)}
    </React.Fragment>
}

export default connectStateProps(DocNotices)