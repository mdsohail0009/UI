const { connect } = require("react-redux")

const mapStateToProps = ({ oidc, buySell }) => {
    return { profile: oidc.profile, user: oidc.user, buySell }
}
const mapDispatchToProps = dispatch=>{
    return {dispatch}
}
const connectStateProps = connect(mapStateToProps,mapDispatchToProps);


export default connectStateProps;