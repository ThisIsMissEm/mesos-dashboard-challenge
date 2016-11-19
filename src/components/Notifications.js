import React, { Component } from 'react';
import './Notifications.css';

const Notification = ({ id, message, onDismiss }) => {
    return (
        <div className="Notification">
            {message} <button onClick={() => onDismiss(id)}>dismiss</button>
        </div>
    )
}

const renderNotifications = (notifications, onDismiss) => {
    return notifications.map((notification) => (
        <li key={notification.id}>
            <Notification onDismiss={onDismiss} {...notification} />
        </li>
    ));
}

const Notifications = ({ notifications, dismiss }) => (
    <ul className="Notifications-List">
        {renderNotifications(notifications, dismiss)}
    </ul>
);

export default Notifications;