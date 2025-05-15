import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./CalculatorPage.css";

// feature‐encoders for the payload
const pclassMap   = { First: 1, Second: 2, Third: 3 };
const sexMap      = { Female: 0, Male: 1 };
const aloneMap    = { Yes: 1, No: 0 };
const embarkedMap = { Cherbourg: 0, Queenstown: 1, Southampton: 2 };
const titleMap    = { Master: 0, Miss: 1, Mr: 2, Mrs: 3, Rare: 4 };

// the full list of models, in the exact order expected by the model backend 
const modelList = [
  "decision_tree",
  "gaussian",
  "knn",
  "linear_svc",
  "logreg",
  "perceptron",
  "randomForest",
  "svc",
  "sgd"
];

export default function CalculatorPage() {
  const [formData, setFormData] = useState({
    pclass:        "First",
    sex:           "Male",
    age:           "",
    fare:          "",
    traveledAlone: "Yes",
    embarked:      "Cherbourg",
    title:         "Mr",
    model:         modelList[0],  // default to "decision_tree"
  });
  const [predictionResult, setPredictionResult] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      pclass:        "First",
      sex:           "Male",
      age:           "",
      fare:          "",
      traveledAlone: "Yes",
      embarked:      "Cherbourg",
      title:         "Mr",
      model:         modelList[0],
    });
    setPredictionResult("");
  };

  const handlePredict = async () => {
    // encode features
    const Pclass    = pclassMap[formData.pclass];
    const Sex       = sexMap[formData.sex];
    const Age       = parseFloat(formData.age)  || 0;
    const Fare      = parseFloat(formData.fare) || 0;
    const IsAlone   = aloneMap[formData.traveledAlone];
    const Embarked  = embarkedMap[formData.embarked];
    const Title     = titleMap[formData.title];
    // to look up the index of the selected model
    const model     = modelList.indexOf(formData.model);
    const Age_Class = Age * Pclass;

    const payload = { model, Pclass, Sex, Age, Fare, Embarked, Title, IsAlone, Age_Class };

    try {
      const resp = await fetch("http://localhost:5000/predict", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const text = await resp.text();
      if (!text) throw new Error(`Empty response (status ${resp.status})`);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON: ${text}`);
      }

      if (!resp.ok) {
        const detail = data.detail || JSON.stringify(data);
        throw new Error(`Server Error ${resp.status}: ${detail}`);
      }

      const pred = data.prediction;
      const prob = data.probability;
      const resultText = pred === 1 ? "Survived" : "Did Not Survive";
      setPredictionResult(`${resultText} (${(prob * 100).toFixed(2)}% confidence)`);
    } catch (err) {
      console.error(err);
      setPredictionResult(`Error: ${err.message}`);
    }
  };

  return (
    <div className="calculator-page">
      <Navbar />
      <div className="calculator-container">
        <h1>Survival Calculator</h1>

        {/* Passenger Class */}
        <div className="form-group">
          <label>Class</label>
          <select name="pclass" value={formData.pclass} onChange={handleChange}>
            <option>First</option>
            <option>Second</option>
            <option>Third</option>
          </select>
        </div>

        {/* Sex */}
        <div className="form-group">
          <label>Sex</label>
          <select name="sex" value={formData.sex} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        {/* Age */}
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 29"
          />
        </div>

        {/* Fare */}
        <div className="form-group">
          <label>Fare ($)</label>
          <input
            type="number"
            name="fare"
            value={formData.fare}
            onChange={handleChange}
            placeholder="e.g. 72.50"
          />
        </div>

        {/* Traveled Alone */}
        <div className="form-group">
          <label>Traveled Alone</label>
          <select name="traveledAlone" value={formData.traveledAlone} onChange={handleChange}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Embarkation Port */}
        <div className="form-group">
          <label>Embarked</label>
          <select name="embarked" value={formData.embarked} onChange={handleChange}>
            <option>Cherbourg</option>
            <option>Queenstown</option>
            <option>Southampton</option>
          </select>
        </div>

        {/* Title */}
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



        {/* Prediction Model */}
        <div className="form-group">
          <label>Model</label>
          <select name="model" value={formData.model} onChange={handleChange}>
            {modelList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="form-buttons">
          <button className="predict-btn" onClick={handlePredict}>Predict</button>
          <button className="reset-btn"   onClick={handleReset}>Reset</button>
        </div>

        {/* Result Display */}
        {predictionResult && (
          <div className="prediction-result">{predictionResult}</div>
        )}
      </div>
    </div>
  );
}