import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCheckSquare,
  FiLogIn,
  FiLoader,
  FiUserPlus,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormError("");
    reset();
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setFormError("");

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || {};

      if (isLogin) {
        const existingUser = users[data.email];
        if (!existingUser) {
          setFormError("No account found with this email. Please register.");
          setIsSubmitting(false);
          return;
        }
        if (existingUser.password !== data.password) {
          setFormError("Incorrect password. Please try again.");
          setIsSubmitting(false);
          return;
        }
        localStorage.setItem("currentUser", data.email);
        navigate("/");
      } else {
        if (users[data.email]) {
          setFormError(
            "An account with this email already exists. Please login.",
          );
          setIsSubmitting(false);
          return;
        }
        users[data.email] = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          todos: [],
        };
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", data.email);
        navigate("/");
      }
    }, 600);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="login-brand">
          <FiCheckSquare size={32} />
          <h1>Todo Manager</h1>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={isLogin ? "active" : ""}
            onClick={() => !isLogin && toggleMode()}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={() => isLogin && toggleMode()}
          >
            Sign Up
          </button>
        </div>

        {formError && <div className="login-error-box">{formError}</div>}

        {!isLogin && (
          <div className="name-row">
            <div className="login-input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                className={errors.firstName ? "input-error" : ""}
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 3,
                    message: "Must be at least 3 characters",
                  },
                })}
              />
              {errors.firstName && (
                <p className="error-message">{errors.firstName.message}</p>
              )}
            </div>

            <div className="login-input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                className={errors.lastName ? "input-error" : ""}
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
              {errors.lastName && (
                <p className="error-message">{errors.lastName.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="login-input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={errors.email ? "input-error" : ""}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="login-input-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={errors.password ? "input-error" : ""}
              {...register("password", {
                required: "Password is required",
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
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        {!isLogin && (
          <div className="login-input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className={errors.confirmPassword ? "input-error" : ""}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <FiLoader className="spin" />{" "}
              {isLogin ? "Logging in..." : "Signing in.."}
            </>
          ) : isLogin ? (
            <>
              <FiLogIn /> Login
            </>
          ) : (
            <>
              <FiUserPlus /> Sign Up
            </>
          )}
        </button>
      </form>
    </div>
  );
}
