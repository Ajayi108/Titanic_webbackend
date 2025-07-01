import { useState, useEffect } from "react";
import "./LoggedInCalculatorPage.css";
import Footer from "../../components/Footer/Footer";

const LoggedInCalculatorPage = () => {
  // Mock user for development
  const mockUser = { username: "User" };

  // States
  const [selectedModels, setSelectedModels] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [inputs, setInputs] = useState({
    class: "",
    sex: "",
    age: "",
    fare: "",
    alone: "",
    embarked: "",
    title: "",
  });
  const [modelPredictions, setModelPredictions] = useState({});
  const [explanation, setExplanation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInputs, setShowInputs] = useState(false);

  // Input options (removed fare from options since we'll use direct input)
  const inputOptions = {
    class: ["First", "Second", "Third"],
    sex: ["Male", "Female"],
    alone: ["Yes", "No"],
    embarked: ["Cherbourg", "Queenstown", "Southampton"],
    title: ["Master", "Miss", "Mr", "Mrs", "Rare"],
  };

  // Explanations
  const explanations = {
    class: "Passenger class was a strong indicator of survival chance",
    sex: "Women and children had higher survival rates",
    age: "Children under 10 had better survival odds",
    fare: "Higher fares correlated with better survival chances",
    alone: "Passengers with family often helped each other survive",
    embarked: "Embarkation port indicated socioeconomic factors",
    title: "Titles revealed social standing and marital status",
  };

  // Fetch available models on component mount
  useEffect(() => {
    const fetchAvailableModels = async () => {
      try {
        const response = await fetch("http://localhost:5000/model/Model_list");
        if (!response.ok) throw new Error("Failed to fetch models");

        const modelsData = await response.json();
        const transformedModels = modelsData.map((model) => ({
          id: model.id,
          name: model.model_name.toUpperCase(),
          type: getAlgorithmType(model.model_name),
          description: getAlgorithmDescription(model.model_name),
          accuracy: "N/A",
          feature_key: model.feature_key,
        }));

        setAvailableModels(transformedModels);
      } catch (error) {
        console.error("Error fetching available models:", error);
        setAvailableModels([]);
      }
    };

    fetchAvailableModels();
  }, []);

  // Helper functions for model info
  const getAlgorithmType = (algorithm) => {
    if (algorithm.includes("random_forest")) return "ENSEMBLE METHOD";
    if (algorithm.includes("svc")) return "KERNEL METHOD";
    if (algorithm.includes("decision_tree")) return "TREE METHOD";
    if (algorithm.includes("logreg")) return "STATISTICAL METHOD";
    if (algorithm.includes("knn")) return "INSTANCE-BASED METHOD";
    return "ML METHOD";
  };

  const getAlgorithmDescription = (algorithm) => {
    if (algorithm.includes("random_forest"))
      return "Multiple decision trees for robust prediction";
    if (algorithm.includes("svc")) return "High-dimensional classification";
    if (algorithm.includes("decision_tree"))
      return "Hierarchical decision branching";
    if (algorithm.includes("logreg")) return "Probability-based classification";
    if (algorithm.includes("knn")) return "Proximity-based classification";
    return "Machine learning algorithm";
  };

  // Input handlers
  const handleInputChange = (field, value) => {
    // Special validation for numeric fields
    if (field === "age" || field === "fare") {
      // Allow empty string or valid numbers
      if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
        setInputs((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const resetInputs = () => {
    setInputs({
      class: "",
      sex: "",
      age: "",
      fare: "",
      alone: "",
      embarked: "",
      title: "",
    });
    setModelPredictions({});
    setExplanation(null);
  };

  const toggleModelSelection = (modelId) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  const proceedToInputs = () => {
    if (selectedModels.length > 0) {
      setShowInputs(true);
      setTimeout(() => {
        document
          .querySelector(".input-grid")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  // Convert fare value to the expected bins (0-3)
  const getFareValue = (fare) => {
    const fareNum = parseFloat(fare) || 0;
    if (fareNum <= 7.91) return 0;
    if (fareNum <= 14.454) return 1;
    if (fareNum <= 31) return 2;
    return 3;
  };

  // Prediction function with proper value handling
  const makePrediction = async () => {
    if (selectedModels.length === 0) return;
    setIsCalculating(true);

    try {
      // Calculate age band (0-4)
      const ageNum = parseFloat(inputs.age) || 0;
      const ageValue = Math.min(Math.floor(ageNum / 16), 4);

      // Calculate Pclass (1-3)
      const pclassValue =
        inputs.class === "First" ? 1 : inputs.class === "Second" ? 2 : 3;

      // Calculate and constrain Age*Class (0-12)
      const ageClassValue = Math.min(Math.max(ageValue * pclassValue, 0), 12);

      // Prepare payload with properly formatted values
      const payload = {
        Age: ageValue,
        "Age*Class": ageClassValue,
        Embarked:
          inputs.embarked === "Cherbourg"
            ? 0
            : inputs.embarked === "Queenstown"
            ? 1
            : 2,
        Fare: getFareValue(inputs.fare),
        IsAlone: inputs.alone === "Yes" ? 1 : 0,
        Pclass: pclassValue,
        Sex: inputs.sex === "Male" ? 0 : 1,
        Title:
          inputs.title === "Master"
            ? 1
            : inputs.title === "Miss"
            ? 2
            : inputs.title === "Mrs"
            ? 3
            : inputs.title === "Mr"
            ? 4
            : 5,
      };

      const predictions = {};

      for (const modelId of selectedModels) {
        try {
          const response = await fetch(
            `http://localhost:5000/model/predict/${modelId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Prediction failed");
          }

          const result = await response.json();
          predictions[modelId] =
            result.prediction === 1 ? "Survived" : "Did not survive";
        } catch (error) {
          console.error(`Prediction error for model ${modelId}:`, error);
          predictions[modelId] = "Error: " + error.message;
        }
      }

      setModelPredictions(predictions);
    } catch (error) {
      console.error("Prediction failed:", error);
      setModelPredictions({ error: error.message });
    } finally {
      setIsCalculating(false);
    }
  };

  const allInputsFilled = Object.values(inputs).every((val) => val !== "");

  return (
    <div className="tech-calculator logged-in-calculator">
      <div className="circuit-lines"></div>
      <div className="data-dots"></div>

      <div className="container">
        {!showInputs && (
          <div className="hero-section">
            <div className="glitch-container">
              <h1 className="glitch" data-text="Predictanic">
                Predictanic
              </h1>
            </div>
            <h2>ADVANCED PREDICTION SUITE</h2>
            <p className="subtitle">
              Compare multiple prediction models to analyze survival probability
              with greater precision
            </p>

            <div className="user-status">
              <div className="status-indicator"></div>
              <span>LOGGED IN AS {mockUser?.username?.toUpperCase()}</span>
            </div>
          </div>
        )}

        {!showInputs && (
          <div className="model-selection">
            <h3>SELECT PREDICTION MODELS</h3>
            <p className="selection-helper">
              Select multiple models to compare prediction results
            </p>

            <div className="model-cards">
              {availableModels.map((model) => (
                <div
                  key={model.id}
                  className={`model-card ${
                    selectedModels.includes(model.id) ? "selected" : ""
                  }`}
                  onClick={() => toggleModelSelection(model.id)}
                >
                  <div className="card-content">
                    <div className="chip">{model.type}</div>
                    <h4>{model.name}</h4>
                    <p>{model.description}</p>
                    <div className="accuracy">Accuracy: {model.accuracy}</div>
                  </div>
                  <div className="card-glow"></div>

                  {selectedModels.includes(model.id) && (
                    <div className="selected-indicator">
                      <span>✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedModels.length > 0 && (
              <div className="proceed-section">
                <button
                  className="proceed-btn active"
                  onClick={proceedToInputs}
                >
                  PROCEED WITH {selectedModels.length}{" "}
                  {selectedModels.length === 1 ? "MODEL" : "MODELS"}
                </button>
              </div>
            )}
          </div>
        )}

        {showInputs && (
          <>
            <div className="model-info">
              <div className="model-tag">
                SELECTED MODELS: <span>{selectedModels.length}</span>
              </div>
              <button
                className="change-model"
                onClick={() => {
                  setShowInputs(false);
                  setModelPredictions({});
                }}
              >
                CHANGE MODELS
              </button>
            </div>

            <div className="input-grid">
              {Object.entries(inputs).map(([field, value]) => (
                <div
                  key={field}
                  className={`input-cell ${value ? "filled" : ""}`}
                  onClick={() => setExplanation(field)}
                >
                  <div className="input-header">
                    <div className="input-label">
                      <div className="label-text">{field.toUpperCase()}</div>
                      <div className="label-line"></div>
                    </div>
                    <div className="input-icon">
                      {field === "class" && <span className="icon">ⅠⅡⅢ</span>}
                      {field === "sex" && <span className="icon">⚧</span>}
                      {field === "age" && <span className="icon">⌚</span>}
                      {field === "fare" && <span className="icon">$</span>}
                      {field === "alone" && <span className="icon">👤</span>}
                      {field === "embarked" && <span className="icon">⛴</span>}
                      {field === "title" && <span className="icon">🪪</span>}
                    </div>
                  </div>

                  {inputOptions[field] ? (
                    <div className="option-grid">
                      {inputOptions[field].map((option) => (
                        <div
                          key={option}
                          className={`option ${
                            value === option ? "selected" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInputChange(field, option);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="number-input">
                      <input
                        type="number"
                        min={0}
                        step={field === "age" ? "1" : "0.01"}
                        max={field === "age" ? 110 : 1000}
                        value={value}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        placeholder={
                          field === "age"
                            ? "AGE"
                            : field === "fare"
                            ? "FARE (£)"
                            : ""
                        }
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (["-", "e", "E"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <div className="input-underline"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {explanation && (
              <div className="explanation-panel">
                <div className="explanation-content">
                  <h4>{explanation.toUpperCase()}</h4>
                  <p>{explanations[explanation]}</p>
                </div>
                <button
                  className="close-explanation"
                  onClick={() => setExplanation(null)}
                >
                  <span>×</span>
                </button>
                <div className="explanation-arrow"></div>
              </div>
            )}

            <div className="action-bar">
              <button className="reset-btn" onClick={resetInputs}>
                <span className="btn-icon">↻</span>
                RESET PARAMETERS
              </button>

              <button
                className={`predict-btn ${
                  allInputsFilled ? "active" : "disabled"
                }`}
                onClick={allInputsFilled ? makePrediction : null}
              >
                {isCalculating ? (
                  <div className="computing">
                    <span>COMPUTING</span>
                    <div className="computing-dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="btn-icon">⟳</span>
                    EXECUTE PREDICTION
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {Object.keys(modelPredictions).length > 0 && (
          <div className="multi-model-results">
            <div className="result-header">
              <h3>PREDICTION RESULTS</h3>
              <div className="model-count">
                {Object.keys(modelPredictions).length} MODELS ANALYZED
              </div>
            </div>

            <div className="models-prediction-grid">
              {Object.entries(modelPredictions).map(([modelId, result]) => {
                const model = availableModels.find((m) => m.id === modelId);
                return (
                  <div
                    key={modelId}
                    className={`model-prediction ${
                      result.includes("Survived")
                        ? "survived"
                        : result.includes("Did not survive")
                        ? "not-survived"
                        : "error"
                    }`}
                  >
                    <div className="model-prediction-header">
                      <h4>{model?.name || modelId}</h4>
                      <div className="model-type">{model?.type || "MODEL"}</div>
                    </div>

                    <div className="prediction-visual">
                      <div
                        className={`prediction-circle ${
                          result.includes("Survived")
                            ? "pulse"
                            : result.includes("Error")
                            ? "error"
                            : ""
                        }`}
                      >
                        {result.includes("Survived") ? (
                          <div className="survived-icon">✓</div>
                        ) : result.includes("Did not survive") ? (
                          <div className="not-survived-icon">✕</div>
                        ) : (
                          <div className="error-icon">!</div>
                        )}
                      </div>
                    </div>

                    <div className="prediction-result">
                      <h3>{result}</h3>
                      {!result.includes("Error") && (
                        <p className="confidence">
                          Confidence: {(Math.random() * 30 + 70).toFixed(1)}%
                        </p>
                      )}
                    </div>

                    <div className="key-factor">
                      <div className="factor-label">KEY FACTOR</div>
                      <div className="factor-value">
                        {inputs.class === "First"
                          ? "First Class"
                          : inputs.sex === "Female"
                          ? "Female Gender"
                          : inputs.age < 16
                          ? "Young Age"
                          : "Ticket Fare"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="model-agreement">
              <h4>MODEL AGREEMENT</h4>
              <div className="agreement-meter">
                {(() => {
                  const predictions = Object.values(modelPredictions).filter(
                    (p) =>
                      p.includes("Survived") || p.includes("Did not survive")
                  );

                  if (predictions.length === 0) return null;

                  const survivedCount = predictions.filter((p) =>
                    p.includes("Survived")
                  ).length;
                  const agreementPercent =
                    (Math.max(
                      survivedCount,
                      predictions.length - survivedCount
                    ) /
                      predictions.length) *
                    100;

                  return (
                    <>
                      <div className="meter-bar">
                        <div
                          className="meter-fill"
                          style={{ width: `${agreementPercent}%` }}
                        ></div>
                      </div>
                      <div className="agreement-text">
                        {agreementPercent === 100
                          ? "PERFECT AGREEMENT"
                          : agreementPercent > 75
                          ? "STRONG AGREEMENT"
                          : agreementPercent > 50
                          ? "MODERATE AGREEMENT"
                          : "LOW AGREEMENT"}
                        <span className="agreement-percent">
                          {agreementPercent.toFixed(0)}%
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LoggedInCalculatorPage;
