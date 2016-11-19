import React from 'react';
import { connect } from 'react-redux'

const Instance = ({ id, applicationName }) => {
    return (
        <div>
            Name: {applicationName}, Id: {id}
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
    const instance = state.instances[ownProps.id];

    return {
        id: instance.id,
        applicationName: state.applications[instance.application].name
    }
}

export default connect(
    mapStateToProps
)(Instance);