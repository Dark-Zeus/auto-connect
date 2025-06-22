import { Routes, Route } from 'react-router-dom';

import TwoColContainer from "../components/TwoColContainer";
import LoginForm from "../components/LoginForm";

import "./AuthPage.css";

import SampleLogo from "assets/images/google-icon.svg";
import SampleBG from "assets/images/sample-bg-2.png";

function AuthPage({children}) {
    return (
        <TwoColContainer bgImage={SampleBG}
            leftContainer={
                <div className="logo-background">
                    <div className="logo-container" style={{ backgroundImage: `url(${SampleLogo})` }}></div>
                </div>
            }

            rightContainer = {children}
        />

    );
}

export default AuthPage;