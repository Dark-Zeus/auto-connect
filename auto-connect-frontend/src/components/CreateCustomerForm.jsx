import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import RightIconRectInput from "./atoms/RightIconRectInput";
import IconButton from "./atoms/IconButton";

import "./Form.css";

function CreateCustomer() {

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        type: "",
        accountLevel: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const { userContext, setUserContext } = useContext(UserContext);

    return (
        <form className="side-form">
            <div className="form__title">Create Customer</div>
            <hr className="h-divider" />
            <div className="form__content">
                <RightIconRectInput
                    name="id"
                    onChange={handleChange}
                    value={formData.id}
                    type="text"
                    placeholder="user0001"
                    icon="person"
                    inputLabel="User ID"
                />
                <RightIconRectInput
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    type="text"
                    placeholder="Full Name"
                    icon="person"
                    inputLabel="Name"
                />
                <RightIconRectInput
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    type="email"
                    placeholder="Email"
                    icon="email"
                    inputLabel="Email"
                />
                <RightIconRectInput
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    type="password"
                    placeholder="Password"
                    icon="lock"
                    inputLabel="Password"
                />
                <RightIconRectInput
                    name="type"
                    onChange={handleChange}
                    value={formData.type}
                    type="text"
                    placeholder="Customer Type"
                    icon="category"
                    inputLabel="Type"
                />
                <RightIconRectInput
                    name="accountLevel"
                    onChange={handleChange}
                    value={formData.accountLevel}
                    type="text"
                    placeholder="Account Level"
                    icon="star"
                    inputLabel="Account Level"
                />

                <br />
                <IconButton
                    icon="login"
                    content="Create Customer"
                    bg="green"
                    c="white"
                    extraClass="btn-margin login-btn"
                    type="submit"
                />
            </div>
        </form>
    );
}

export default CreateCustomer;
