import React from 'react';
import { connect } from 'react-redux'

const Instance = ({ id, application, instance }) => {
    let className = "Instance";

    if (instance.status === 'starting') {
        className += " Instance--starting";
    }

    if (instance.status === 'stopping') {
        className += " Instance--stopping";
    }

    const style = {
        backgroundColor: application.color
    }

    return (
        <div className={className} style={style}>
            <div>
                <header>
                    <h3>{application.name}</h3>
                </header>
                <p>{id}</p>

                <pre><code>{JSON.stringify(instance, null, 2)}</code></pre>
            </div>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
    const instance = state.entities.instances[ownProps.id];

    return {
        id: instance.id,
        application: state.entities.applications[instance.application],
        instance: instance
    }
}

export default connect(
    mapStateToProps
)(Instance);