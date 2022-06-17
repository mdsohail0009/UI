const { connect } = require("react-redux")

const mapStateToProps = ({ oidc, buySell, sendReceive, swapStore, buyFiat,buyInfo,userConfig, dashboard,addressBookReducer, TransforStore  }) => {
    return { profile: oidc.profile, user: oidc.user, buySell, sendReceive, swapStore, buyFiat,sellData:buyInfo,userProfile:userConfig.userProfileInfo,dashboard:dashboard,addressBookReducer,twoFA:userConfig.twoFA,cardsStore:cardsStore, TransforStore:TransforStore }
}
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
const ConnectStateProps = connect(mapStateToProps, mapDispatchToProps);


export default ConnectStateProps;