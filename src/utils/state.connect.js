const { connect } = require("react-redux")

const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile, user: oidc.user }
}

const connectStateProps = connect(mapStateToProps);


export default connectStateProps;