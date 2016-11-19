import { connect } from 'react-redux'

import { addInstanceOfApplication, destroyInstanceOfApplication } from '../actions';
import Application from '../components/Application'

const mapStateToProps = (state, ownProps) => {
    // Note: too much data
    return state.applications[ownProps.id];
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        create: () => {
            dispatch(addInstanceOfApplication(ownProps.id))
        },
        destroy: () => {
            dispatch(destroyInstanceOfApplication(ownProps.id))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Application);