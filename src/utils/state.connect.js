const { connect } = require("react-redux")

const mapStateToProps = ({ oidc, buySell, sendReceive, swapStore, buyFiat,buyInfo,userConfig, dashboard }) => {
    return { profile: oidc.profile, user: oidc.user, buySell, sendReceive, swapStore, buyFiat,sellData:buyInfo,userProfile:userConfig.userProfileInfo,dashboard:dashboard }
}
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
const connectStateProps = connect(mapStateToProps, mapDispatchToProps);


export default connectStateProps;