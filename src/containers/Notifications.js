import React, { Component } from 'react';
import { connect } from 'react-redux'

import { destroyNotification } from '../actions'

import Notifications from '../components/Notifications';

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dismiss: (id) => dispatch(destroyNotification(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
