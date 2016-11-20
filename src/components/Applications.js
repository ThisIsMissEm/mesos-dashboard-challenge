import React from 'react'

import ApplicationContainer from '../containers/Application';

const Applications = ({ applications }) => {
    return (
        <ul className="Applications">
            {applications.map((applicationId) => {
                return (
                    <li key={applicationId}>
                        <ApplicationContainer id={applicationId} />
                    </li>
                )
            })}
        </ul>
    )
}

export default Applications;