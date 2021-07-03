const { connect } = require("react-redux")

const mapStateToProps = ({ oidc, buySell, sendReceive }) => {
    return { profile: oidc.profile, user: oidc.user, buySell ,sendReceive }
}
const mapDispatchToProps = dispatch=>{
    return {dispatch}
}
const connectStateProps = connect(mapStateToProps,mapDispatchToProps);


export default connectStateProps;