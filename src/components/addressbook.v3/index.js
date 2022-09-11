import { Component } from "react";
import FiatAddress from "../addressbook.component/fiat.address";

class AddressBookV3 extends Component {

    render() {
        return <FiatAddress currency={"EUR"} onAddressOptionsChange={()=>{}} type={this.props.type} onContinue={this.props?.onContinue} />
    }
}
export default AddressBookV3