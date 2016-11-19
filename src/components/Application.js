import React from 'react'

const Application = ({
    id,
    name,
    create,
    destroy
}) => {
    return (
        <div>
            <div>{name}</div>
            <button onClick={() => create()}>Add</button>
            <button onClick={() => destroy()}>Remove</button>
        </div>
    )
}

export default Application;