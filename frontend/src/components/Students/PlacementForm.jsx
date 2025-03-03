import { useState } from "react";

const PlacementForm = () => {
    const [placements, setPlacements] = useState([
        { companyName: "", role: "", package: "", isOnCampus: false }
    ]);
    const studentId = localStorage.getItem("studentID");

    const handleChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedPlacements = [...placements];
        updatedPlacements[index][name] = type === "checkbox" ? checked : value;
        setPlacements(updatedPlacements);
    };

    const addPlacement = () => {
        setPlacements([...placements, { companyName: "", role: "", package: "", isOnCampus: false }]);
    };

    const removePlacement = (index) => {
        setPlacements(placements.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await fetch("http://localhost:3000/addPlacementRecords", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    placements: placements.map(p => ({ ...p, package: Number(p.package), student: studentId }))
                })
            });
            if (response.ok) {
                alert("Placement records added successfully!");
                setPlacements([{ companyName: "", role: "", package: "", isOnCampus: false }]);
            } else {
                alert("Failed to add placement records");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)", maxWidth: "400px", margin: "auto" }}>
            {placements.map((placement, index) => (
                <div key={index} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Company Name:</label>
                        <input type="text" name="companyName" value={placement.companyName} onChange={(e) => handleChange(index, e)} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Role:</label>
                        <input type="text" name="role" value={placement.role} onChange={(e) => handleChange(index, e)} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Package:</label>
                        <input type="number" name="package" value={placement.package} onChange={(e) => handleChange(index, e)} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label>
                            <input type="checkbox" name="isOnCampus" checked={placement.isOnCampus} onChange={(e) => handleChange(index, e)} style={{ marginRight: "5px" }} />
                            On Campus
                        </label>
                    </div>
                    {index > 0 && (
                        <button type="button" onClick={() => removePlacement(index)} style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                    )}
                </div>
            ))}
            <button type="button" onClick={addPlacement} style={{ width: "100%", padding: "10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginBottom: "10px" }}>Add Another</button>
            <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Submit</button>
        </form>
    );
};

export default PlacementForm;
