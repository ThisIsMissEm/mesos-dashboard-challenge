import React from 'react';
import { connect } from 'react-redux'

const Instance = ({ id, applicationName, createdAt }) => {
    return (
        <div>
            Name: {applicationName}, Id: {id}, Created At: {createdAt}
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
    const instance = state.entities.instances[ownProps.id];

    return {
        id: instance.id,
        createdAt: (new Date(instance.createdAt)).toLocaleString(),
        applicationName: state.entities.applications[instance.application].name
    }
}

export default connect(
    mapStateToProps
)(Instance);