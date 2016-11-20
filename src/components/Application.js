import React from 'react'

const Application = ({
    id,
    name,
    color,
    instancesCount,
    create,
    destroy
}) => {
    const style = {
        borderColor: color
    };

    return (
        <div style={style}>
            <header>
                <strong>{name}</strong> {instancesCount}
            </header>
            <button onClick={() => create()}>Add</button>
            <button disabled={instancesCount === 0} onClick={() => destroy()}>Remove</button>
        </div>
    )
}

export default Application;