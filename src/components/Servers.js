import React from 'react'

import InstanceContainer from '../containers/Instance';

const Server = (server) => {
    return (
        <div>
            <h3>{server.id}:</h3>
            {server.instances.map((id) => <li key={id}><InstanceContainer id={id} /></li>)}
        </div>
    )
}

const Servers = ({servers}) => {
    return (
        <ul>
            {servers.map((server) => <Server key={server.id} {...server} />)}
        </ul>
    )
}

export default Servers;