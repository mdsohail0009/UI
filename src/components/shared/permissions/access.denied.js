import { Result } from "antd"

const AccessDenied = () => {

    return <Result
        status="403"
        title="Access Denied"
        subTitle="Please contact administrator"
    />

}
export default AccessDenied;