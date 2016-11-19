import { connect } from 'react-redux'

import { addInstanceOfApplication, destroyInstanceOfApplication } from '../actions';
import Application from '../components/Application'

const mapStateToProps = (state, ownProps) => {
    const application = state.entities.applications[ownProps.id];

    return {
        id: application.id,
        name: application.name,
    }
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