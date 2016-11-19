import React from 'react'
import { connect } from 'react-redux'

import Applications from '../components/Applications'

const mapStateToProps = (state) => {
    return {
        // Should be done in redux store
        applications: Object.keys(state.applications)
    }
}

export default connect(
    mapStateToProps
)(Applications);