const { connect } = require("react-redux")

const mapStateToProps = ({ oidc, buySell, sendReceive, swapStore, buyFiat,buyInfo,userConfig }) => {
    return { profile: oidc.profile, user: oidc.user, buySell, sendReceive, swapStore, buyFiat,sellData:buyInfo,userProfile:userConfig.userProfileInfo }
}
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
const connectStateProps = connect(mapStateToProps, mapDispatchToProps);


export default connectStateProps;