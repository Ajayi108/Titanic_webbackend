import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function CalculatorPage() {
  const [formData, setFormData] = useState({
    pclass: "First",
    sex: "Male",
    age: "",
    fare: "",
    traveledAlone: "Yes",
    embarked: "Cherbourg",
    title: "Mr",
    model: "Random Forest",
  });

  const [predictionResult, setPredictionResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = () => {
    const survived = Math.random() > 0.5 ? "Survived" : "Did Not Survive";
    setPredictionResult(survived);
  };

  const handleReset = () => {
    setFormData({
      pclass: "First",
      sex: "Male",
      age: "",
      fare: "",
      traveledAlone: "Yes",
      embarked: "Cherbourg",
      title: "Mr",
      model: "Random Forest",
    });
    setPredictionResult(null);
  };

  return (
    <div>
      <Navbar />
      <div className="calculator-container">
        <h1 className="calculator-title">Titanic Survival Calculator</h1>

        <div className="form-group">
          <label>Class</label>
          <select name="pclass" value={formData.pclass} onChange={handleChange}>
            <option>First</option>
            <option>Second</option>
            <option>Third</option>
          </select>
        </div>

        <div className="form-group">
          <label>Sex</label>
          <select name="sex" value={formData.sex} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Fare ($)</label>
          <input type="number" name="fare" value={formData.fare} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Traveled Alone</label>
          <select name="traveledAlone" value={formData.traveledAlone} onChange={handleChange}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Embarked</label>
          <select name="embarked" value={formData.embarked} onChange={handleChange}>
            <option>Cherbourg</option>
            <option>Queenstown</option>
            <option>Southampton</option>
          </select>
        </div>

        <div className="form-group">
          <label>Title</label>
          <select name="title" value={formData.title} onChange={handleChange}>
            <option>Master</option>
            <option>Miss</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Rare</option>
          </select>
        </div>

        <div className="form-group">
          <p>Select Prediction Model</p>
          <label><input type="radio" name="model" value="Random Forest" checked={formData.model === "Random Forest"} onChange={handleChange} /> Random Forest</label><br />
          <label><input type="radio" name="model" value="Support Vector Machine" checked={formData.model === "Support Vector Machine"} onChange={handleChange} /> Support Vector Machine</label>
        </div>

        <div className="form-buttons">
          <button className="predict-btn" onClick={handlePredict}>Predict</button>
          <button className="reset-btn" onClick={handleReset}>Reset Inputs</button>
        </div>

        {predictionResult && (
          <div className="prediction-result">
            Prediction Result: {predictionResult}
          </div>
        )}
      </div>
    </div>
  );
}
