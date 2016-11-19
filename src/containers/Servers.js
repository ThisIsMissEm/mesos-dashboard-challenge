import React from 'react'
import { connect } from 'react-redux'

import Servers from '../components/Servers'

const mapStateToProps = (state) => {
    return {
        // Should be done in redux store
        servers: Object.keys(state.servers).map((serverId) => {
            return Object.assign({}, state.servers[serverId], {
                instances: state.instancesByServer[serverId] || []
            });
        })
    }
}

export default connect(
    mapStateToProps
)(Servers);