import { Alert } from "antd"

class ErrorBoundary extends React.Component {
    state = {
        hasError: false
    }
    componentDidCatch(error,info){
        this.setState({hasError:true})
    }
    render() {
        if (this.state.hasError) {
            return <Alert type="error" message="Alert" description="Something went wrong please try again!" showIcon />
        }else{
        return this.props.children
    }
    }
}

export default ErrorBoundary