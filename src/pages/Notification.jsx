import {
  FiBell,
  FiAlertTriangle,
  FiClock,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import "./Notification.css";

const staticNotifications = [
  {
    id: 1,
    type: "overdue",
    icon: <FiAlertTriangle />,
    title: "Task Overdue: Finalize Q3 Report",
    message:
      "This task was due yesterday at 5:00 PM. Please update its status.",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 2,
    type: "urgent",
    icon: <FiClock />,
    title: "Due Soon: Design System Update",
    message: "Your task is due in 2 hours. Don't forget to submit your work.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "upcoming",
    icon: <FiCalendar />,
    title: "Upcoming: Client Presentation",
    message: "Task scheduled for tomorrow at 10:00 AM. Prepare your slides.",
    time: "5 hours ago",
    unread: false,
  },
  {
    id: 4,
    type: "completed",
    icon: <FiCheckCircle />,
    title: "Completed: Weekly Sync Notes",
    message: "Nice job! You completed this task earlier today.",
    time: "Yesterday",
    unread: false,
  },
];

export default function Notification() {
  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-text">
          <h2>Notifications</h2>
          <p>Stay on top of your upcoming and missed deadlines.</p>
        </div>
        <div className="header-icon">
          <FiBell />
          <span className="notif-badge">2</span>
        </div>
      </div>

      <div className="notifications-list">
        {staticNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`notification-card ${notif.type} ${notif.unread ? "unread" : ""}`}
          >
            <div className="notif-icon-wrapper">{notif.icon}</div>

            <div className="notif-content">
              <div className="notif-top-row">
                <h4>{notif.title}</h4>
                <span className="notif-time">{notif.time}</span>
              </div>
              <p>{notif.message}</p>
            </div>

            {notif.unread && <div className="unread-dot"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
