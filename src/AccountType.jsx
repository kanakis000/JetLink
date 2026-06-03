import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./styles/AccountType.css";

const AccountType = () => {
  const [roleView, setRoleView] = useState("user"); // "user", "hotel_manager", "restaurant_manager"
  const [formType, setFormType] = useState(""); // "login" or "register"

  const handleSwitchRole = (newRole) => {
    setRoleView(newRole);
    setFormType("");
  };

  const handleBack = () => {
    setFormType("");
  };

  return (
    <div className="account-type-page">
      <div className="blur-background"></div>

      <div
        className={`auth-container ${roleView === "user" ? "user-active" : "manager-active"} ${roleView}-active`}
      >
        <div className="side-panel">
          <h3>
            {roleView === "user"
              ? "User Panel"
              : roleView === "hotel_manager"
              ? "Hotel Manager Panel"
              : "Restaurant Manager Panel"}
          </h3>

          {formType ? (
            <button onClick={handleBack} className="role-btn">← Back</button>
          ) : (
            <div className="switch-buttons">
              {roleView !== "user" && (
                <button onClick={() => handleSwitchRole("user")} className="role-btn">
                  Switch to User
                </button>
              )}
              {roleView !== "hotel_manager" && (
                <button onClick={() => handleSwitchRole("hotel_manager")} className="role-btn">
                  Switch to Hotel Manager
                </button>
              )}
              {roleView !== "restaurant_manager" && (
                <button onClick={() => handleSwitchRole("restaurant_manager")} className="role-btn">
                  Switch to Restaurant Manager
                </button>
              )}
            </div>
          )}
        </div>

        <div className="auth-content">
          {formType === "" ? (
            <>
              <h2>
                {roleView === "user"
                  ? "User Access"
                  : roleView === "hotel_manager"
                  ? "Hotel Manager Access"
                  : "Restaurant Manager Access"}
              </h2>
              <div className="auth-actions">
                <button
                  className={`auth-btn ${roleView}`}
                  onClick={() => setFormType("login")}
                >
                  Login
                </button>

                <button
                  className={`auth-btn ${roleView}`}
                  onClick={() => setFormType("register")}
                >
                  Register
                </button>
              </div>
            </>
          ) : (
            <>
              {formType === "login" ? (
                <Login role={roleView} />
              ) : (
                <Register role={roleView} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountType;
