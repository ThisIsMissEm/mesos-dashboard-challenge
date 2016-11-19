import React from 'react'

import InstanceContainer from '../containers/Instance';

const Server = ({ id, instances, onDestroy }) => {
    return (
        <div>
            <h3>{id}</h3>
            <button onClick={() => onDestroy(id)}>Destroy</button>
            {instances.map((id) => <li key={id}><InstanceContainer id={id} /></li>)}
        </div>
    )
}

const Servers = ({servers, destroy}) => {
    return (
        <ul>
            {servers.map((server) => <Server key={server.id} {...server} onDestroy={destroy} />)}
        </ul>
    )
}

export default Servers;