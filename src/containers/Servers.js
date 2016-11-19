import React from 'react'
import { connect } from 'react-redux'

import { destroyServer } from '../actions';
import Servers from '../components/Servers'

const mapStateToProps = (state) => {
    return {
        // Should be done in redux store
        servers: Object.keys(state.entities.servers).map((serverId) => {
            return Object.assign({}, state.entities.servers[serverId], {
                instances: state.indexes.instancesByServer[serverId] || []
            });
        })
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        destroy: (id) => {
            dispatch(destroyServer(id))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Servers);