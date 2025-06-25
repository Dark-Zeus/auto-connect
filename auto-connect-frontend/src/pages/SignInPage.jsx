// @pages/SignInPage.jsx

import TwoColContainer from "@components/TwoColContainer";
import SampleBG from "@assets/images/sample-bg-2.png";
import Logo from "@assets/images/google-icon.svg";

import RegisterForm from "@components/RegisterForm"; // Direct import
import "./SignInPage.css";

function SignInPage() {
  return (
    <TwoColContainer
      bgImage={SampleBG}
      leftContainer={
        <div className="logo-background">
          <div
            className="logo-container"
            style={{ backgroundImage: `url(${Logo})` }}
          ></div>
          <h2 style={{ textAlign: "center", color: "#fff", marginTop: "1rem" }}>
            Welcome to Register Portal
          </h2>
        </div>
      }
      rightContainer={<RegisterForm />}
    />
  );
}

export default SignInPage;
