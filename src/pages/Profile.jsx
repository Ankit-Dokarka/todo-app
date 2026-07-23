import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiUser,
  FiLock,
  FiMail,
  FiEdit3,
  FiShield,
} from "react-icons/fi";
import "./Profile.css";

export default function Profile() {
  const [userData, setUserData] = useState(() => {
    const currentUserEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users[currentUserEmail] || {};
  });

  const [infoMessage, setInfoMessage] = useState({ type: "", text: "" });
  const [passMessage, setPassMessage] = useState({ type: "", text: "" });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    formState: { errors: errorsInfo },
  } = useForm({
    defaultValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
    },
  });

  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    watch: watchPass,
    reset: resetPass,
    formState: { errors: errorsPass },
  } = useForm();

  const newPassword = watchPass("newPassword");

  const onInfoSubmit = (data) => {
    const currentUserEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};

    users[currentUserEmail] = {
      ...users[currentUserEmail],
      firstName: data.firstName,
      lastName: data.lastName,
    };

    localStorage.setItem("users", JSON.stringify(users));
    setUserData(users[currentUserEmail]);
    setInfoMessage({ type: "success", text: "Profile updated successfully!" });
    setTimeout(() => setInfoMessage({ type: "", text: "" }), 3000);
  };

  const onPassSubmit = (data) => {
    const currentUserEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const currentUser = users[currentUserEmail];

    if (data.currentPassword !== currentUser.password) {
      setPassMessage({ type: "error", text: "Current password is incorrect." });
      return;
    }

    users[currentUserEmail].password = data.newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    resetPass();
    setPassMessage({ type: "success", text: "Password changed successfully!" });
    setTimeout(() => setPassMessage({ type: "", text: "" }), 3000);
  };

  const initials =
    `${userData.firstName?.charAt(0) || ""}${userData.lastName?.charAt(0) || ""}`.toUpperCase();
  const fullName =
    `${userData.firstName || ""} ${userData.lastName || ""}`.trim();

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="header-banner"></div>
        <div className="header-content">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h2 className="profile-name">{fullName}</h2>
            <div className="profile-email-badge">
              <FiMail /> {userData.email}
            </div>
          </div>
        </div>
      </div>

      <div className="forms-grid">
        <div className="profile-form-card">
          <div className="form-header">
            <div className="form-header-icon">
              <FiEdit3 />
            </div>
            <h3 className="form-title">Personal Information</h3>
          </div>

          {infoMessage.text && (
            <div className={`form-message ${infoMessage.type}`}>
              {infoMessage.type === "success" ? (
                <FiCheckCircle />
              ) : (
                <FiAlertCircle />
              )}
              {infoMessage.text}
            </div>
          )}

          <form
            onSubmit={handleInfoSubmit(onInfoSubmit)}
            className="profile-form"
          >
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <div className="input-icon-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    className={errorsInfo.firstName ? "input-error" : ""}
                    {...registerInfo("firstName", {
                      required: "First name is required",
                    })}
                  />
                </div>
                {errorsInfo.firstName && (
                  <p className="error-text">{errorsInfo.firstName.message}</p>
                )}
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <div className="input-icon-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    className={errorsInfo.lastName ? "input-error" : ""}
                    {...registerInfo("lastName", {
                      required: "Last name is required",
                    })}
                  />
                </div>
                {errorsInfo.lastName && (
                  <p className="error-text">{errorsInfo.lastName.message}</p>
                )}
              </div>
            </div>

            <button type="submit" className="form-submit-btn">
              Save Changes
            </button>
          </form>
        </div>

        <div className="profile-form-card">
          <div className="form-header">
            <div className="form-header-icon">
              <FiShield />
            </div>
            <h3 className="form-title">Security & Password</h3>
          </div>

          {passMessage.text && (
            <div className={`form-message ${passMessage.type}`}>
              {passMessage.type === "success" ? (
                <FiCheckCircle />
              ) : (
                <FiAlertCircle />
              )}
              {passMessage.text}
            </div>
          )}

          <form
            onSubmit={handlePassSubmit(onPassSubmit)}
            className="profile-form"
          >
            <div className="form-group">
              <label>Current Password</label>
              <div className="input-icon-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showCurrentPass ? "text" : "password"}
                  className={errorsPass.currentPassword ? "input-error" : ""}
                  {...registerPass("currentPassword", {
                    required: "Current password is required",
                  })}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                >
                  {showCurrentPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errorsPass.currentPassword && (
                <p className="error-text">
                  {errorsPass.currentPassword.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="input-icon-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showNewPass ? "text" : "password"}
                  className={errorsPass.newPassword ? "input-error" : ""}
                  {...registerPass("newPassword", {
                    required: "New password is required",
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/,
                      message: "Min 6 chars, 1 uppercase, 1 number, 1 symbol",
                    },
                  })}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowNewPass(!showNewPass)}
                >
                  {showNewPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errorsPass.newPassword && (
                <p className="error-text">{errorsPass.newPassword.message}</p>
              )}
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="input-icon-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  className={errorsPass.confirmPassword ? "input-error" : ""}
                  {...registerPass("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errorsPass.confirmPassword && (
                <p className="error-text">
                  {errorsPass.confirmPassword.message}
                </p>
              )}
            </div>

            <button type="submit" className="form-submit-btn">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
