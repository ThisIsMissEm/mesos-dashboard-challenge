import React from 'react'

const Application = ({
    id,
    name,
    count,
    create,
    destroy
}) => {
    return (
        <div>
            <div><strong>{name}</strong> {count.toString()}</div>
            <button onClick={() => create()}>Add</button>
            <button onClick={() => destroy()}>Remove</button>
        </div>
    )
}

export default Application;