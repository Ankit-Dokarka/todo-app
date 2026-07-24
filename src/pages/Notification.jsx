import { useOutletContext } from "react-router-dom";
import {
  FiBell,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import "./Notification.css";

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffSeconds = Math.floor((now - past) / 1000);

  if (diffSeconds < 60) return "Just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} mins ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
  return `${Math.floor(diffSeconds / 86400)} days ago`;
};

export default function Notification() {
  const { notifications } = useOutletContext();
  const notifList = notifications || [];

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-text">
          <h2>Notifications</h2>
          <p>Stay on top of your upcoming and missed deadlines.</p>
        </div>
        <div className="header-icon">
          <FiBell />
          {notifList.filter((n) => !n.read).length > 0 && (
            <span className="notif-badge">
              {notifList.filter((n) => !n.read).length}
            </span>
          )}
        </div>
      </div>

      <div className="notifications-list">
        {notifList.length > 0 ? (
          notifList.map((notif) => {
            const icon =
              notif.type === "overdue" ? (
                <FiAlertTriangle />
              ) : notif.type === "urgent" ? (
                <FiClock />
              ) : (
                <FiCheckCircle />
              );

            return (
              <div
                key={notif.id}
                className={`notification-card ${notif.type} ${!notif.read ? "unread" : ""}`}
              >
                <div className="notif-icon-wrapper">{icon}</div>

                <div className="notif-content">
                  <div className="notif-top-row">
                    <h4>{notif.title}</h4>
                    <span className="notif-time">
                      {getRelativeTime(notif.timestamp)}
                    </span>
                  </div>
                  <p>{notif.message}</p>
                </div>

                {!notif.read && <div className="unread-dot"></div>}
              </div>
            );
          })
        ) : (
          <div className="notification-card completed">
            <div className="notif-icon-wrapper">
              <FiCheckCircle />
            </div>
            <div className="notif-content">
              <h4>You're all caught up!</h4>
              <p>
                No new notifications right now. We'll alert you 15 minutes
                before a task is due.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
