import React from 'react'

import InstanceContainer from '../containers/Instance';

const Server = ({ id, instances, onDestroy }) => {
    return (
        <div className="Server">
            <h3>{id}</h3>
            <button onClick={() => onDestroy(id)}>Destroy</button>
            <div className="Instances">
                {instances.map((id) => <InstanceContainer key={id} id={id} />)}
            </div>
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