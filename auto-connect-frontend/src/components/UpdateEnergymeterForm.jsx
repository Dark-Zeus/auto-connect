import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import RightIconRectInput from "./atoms/RightIconRectInput";
import DropdownMenu from "./atoms/DropdownMenu";
import IconButton from "./atoms/IconButton";

import "./Form.css";

function EnergyMeterForm() {
    const { id } = useParams();
    
    const [formData, setFormData] = useState({
        id: "",
        measurement: "",
        zoneId: "",
        description: "",
        installationDate: "",
        meterStatus: "",
    });
    
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            const fetchMeterData = async () => {
                try {
                    const response = await fetch(`/api/energymeters/${id}`);
                    const data = await response.json();
                    
                    if (response.ok) {
                        setFormData({
                            id: data.id,
                            measurement: data.measurement,
                            zoneId: data.zoneId,
                            description: data.description,
                            installationDate: data.installationDate,
                            meterStatus: data.meterStatus,
                        });
                    } else {
                        console.error("Failed to fetch meter data");
                    }
                } catch (error) {
                    console.error("Error fetching meter data:", error);
                }
            };
            
            fetchMeterData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <form className="side-form">
            <div className="form__title">
                {isEditing ? "Update Energy Meter" : "Add New Energy Meter"}
            </div>
            <hr className="h-divider" />
            <div className="form__content">
                {!isEditing && (
                    <RightIconRectInput
                        name="id"
                        onChange={handleChange}
                        value={formData.id}
                        type="text"
                        placeholder="Meter ID"
                        icon="badge"
                        inputLabel="Meter ID"
                        required
                    />
                )}
                
                <DropdownMenu
                    name="meterStatus"
                    inputLabel="Meter Type"
                    icon="toggle_on"
                    value={formData.meterStatus}
                    onChange={handleChange}
                    options={[
                        { value: "3phase", label: "3phase" },
                        { value: "1phase", label: "1phase" },
                    ]}
                    required
                />
                
                <RightIconRectInput
                    name="measurement"
                    onChange={handleChange}
                    value={formData.measurement}
                    type="text"
                    placeholder="Measurement"
                    icon="speed"
                    inputLabel="Measurement"
                    required
                />
                
                <RightIconRectInput
                    name="zoneId"
                    onChange={handleChange}
                    value={formData.zoneId}
                    type="text"
                    placeholder="Zone ID"
                    icon="map"
                    inputLabel="Zone ID"
                    required
                />
                
                <RightIconRectInput
                    name="description"
                    onChange={handleChange}
                    value={formData.description}
                    type="text"
                    placeholder="Description"
                    icon="description"
                    inputLabel="Description"
                />
                
                <RightIconRectInput
                    name="installationDate"
                    onChange={handleChange}
                    value={formData.installationDate}
                    type="date"
                    placeholder="Installation Date"
                    icon="event"
                    inputLabel="Installation Date"
                    required
                />
                
                <br />
                <IconButton
                    icon={isEditing ? "update" : "add"}
                    content={isEditing ? "Update Energy Meter" : "Add Energy Meter"}
                    bg="green"
                    c="white"
                    extraClass="btn-margin login-btn"
                    type="submit"
                />
            </div>
        </form>
    );
}

export default EnergyMeterForm;