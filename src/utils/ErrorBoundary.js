import React, { Component } from "react";
const PageNotFound = () => {

    return "Page not found";
}
const Unauthorized = () => {

    return "Access Denied";
}
class AppErrorBoundary extends Component {

    state = {
        hasError: false,
        errorInfo: null
    }
    componentDidCatch(error, info) {
        this.setState({ hasError: true, errorInfo: info });
    }

    get ErrorPage() {
        const { status } = this.state.errorInfo;
        const pages = {
            404: <PageNotFound />,
            401: <Unauthorized />
        }
        return pages[status] || pages["404"];
    }
    render() {

        if (this.state.hasError) {
            return "An Error occured";
        }
        return <React.Fragment>
            {this.props.children}
        </React.Fragment>
    }
}

export default AppErrorBoundary;