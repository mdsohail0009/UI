const { connect } = require("react-redux")

const mapStateToProps = ({ oidc, buySell, sendReceive, swapStore, buyFiat,buyInfo,userConfig, dashboard,addressBookReducer,cardsStore  }) => {
    return { profile: oidc.profile, user: oidc.user, buySell, sendReceive, swapStore, buyFiat,sellData:buyInfo,userProfile:userConfig.userProfileInfo,dashboard:dashboard,addressBookReducer,twoFA:userConfig.twoFA,cardsStore:cardsStore }
}
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
const ConnectStateProps = connect(mapStateToProps, mapDispatchToProps);


export default ConnectStateProps;