import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from '../utils/axios';

import { UserContext } from "../contexts/UserContext";

import RightIconRectInput from "./atoms/RightIconRectInput";
import IconButton from "./atoms/IconButton";

import "./LoginForm.css";

function LoginForm() {

    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const { userContext, setUserContext } = useContext(UserContext)

    const login = (event) => {
        event.preventDefault();

        if (userId === "" || password === "") {
            toast.error("Please fill all the fields");
            return;
        }

        axios.post("/auth/login", { staffLoginId: userId, password: password }).then((res) => {
            if (res.data?.status == "success") {
                localStorage.setItem('token', res.data.accessToken);
                setUserContext(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                toast.success("Logged In Successfully");

                navigate(`/`);
            } else {
                toast.error(res.data?.message);
            }

        }).catch((err) => {
            console.log(err);
            if (err.response?.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(err.message);
            }
        });
    }

    return (
        <>
            <form onSubmit={login} className="login-form form auth-form">
                <div className="form-title">Login</div>
                <div className="h-divider"></div>
                <br></br>
                <br></br>
                <RightIconRectInput onChange={(e) => setUserId(e.target.value)} type="text" placeholder="example@abc.com" icon="person" inputLabel="User ID" />
                <RightIconRectInput onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter atleast 8 characters" icon="lock" 
                    inputLabel={
                        <div className="password__label">
                            <span>Password</span>
                            <Link to="/auth/forgot-password">Forgot Password?</Link>
                            </div>
                        } 
                />

                <IconButton iconb="login" content={"Login"} bg="color" c="white" extraClass={"btn-margin login-btn"} type="submit"/>                
            </form>
            <div className="form-bottom-bar">
                <div>T&C</div>
                <div>Help</div>
            </div>
        </>
    );
}

export default LoginForm;