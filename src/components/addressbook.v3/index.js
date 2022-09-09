import { Component } from "react";
import FiatAddress from "../addressbook.component/fiat.address";

class AddressBookV3 extends Component {

    render() {
        return <FiatAddress currency={"EUR"} onAddressOptionsChange={()=>{}} type={this.props.type} />
    }
}
export default AddressBookV3