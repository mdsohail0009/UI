const { connect } = require("react-redux")

const mapStateToProps = ({ oidc, buySell, sendReceive, swapStore }) => {
    return { profile: oidc.profile, user: oidc.user, buySell ,sendReceive,swapStore }
}
const mapDispatchToProps = dispatch=>{
    return {dispatch}
}
const connectStateProps = connect(mapStateToProps,mapDispatchToProps);


export default connectStateProps;