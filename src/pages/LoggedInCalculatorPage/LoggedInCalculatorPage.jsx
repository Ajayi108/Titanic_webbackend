import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./LoggedInCalculatorPage.css";
import Footer from "../../components/Footer/Footer";

const LoggedInCalculatorPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const [modelProbas,   setModelProbas]   = useState({});
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Input options
  const inputOptions = {
    class: ["First", "Second", "Third"],
    sex: ["Male", "Female"],
    alone: ["Yes", "No"],
    embarked: ["Cherbourg", "Queenstown", "Southampton"],
    title: ["Master", "Miss", "Mr", "Mrs", "Rare"],
  };

  // Fetch available models on component mount
  useEffect(() => {
    const fetchAvailableModels = async () => {
      try {
        const response = await fetch("/api/model/Model_list");
        if (!response.ok) throw new Error("Failed to fetch models");

        const modelsData = await response.json();
        const transformedModels = modelsData.map((model) => ({
          id: model.id,
          name: model.display_name || model.file_name,
          model_name: model.model_name,
          trained_at: model.trained_at,
          features: model.features,  // already an array from backend
          type: getAlgorithmType(model.model_name),
          description: getAlgorithmDescription(model.model_name),
        }));

        setAvailableModels(transformedModels);
      } catch (error) {
        console.error("Error fetching available models:", error);
        setAvailableModels([]);
      }
    };

    fetchAvailableModels();

    // Load prediction history from localStorage
    const savedHistory = localStorage.getItem("predictionHistory");
    if (savedHistory) {
      setPredictionHistory(JSON.parse(savedHistory));
    }
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
    if (field === "age" || field === "fare") {
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
    setModelProbas({});
  };

  const toggleModelSelection = (modelId) => {
    const model = availableModels.find((m) => m.id === modelId);
    if (!model) return;

    setSelectedModels([modelId]);

    // Set up dynamic inputs from that model's features
    const rawFeatures = model.features;
    const dynamicInputs = {};
    rawFeatures.forEach(f => {
      // normalize the field names to match your inputOptions keys
      let key;
      switch (f) {
        case "Pclass":     key = "class";  break;
        case "IsAlone":    key = "alone";  break;
        case "Age#Class":  key = null;     break; // skip the combined feature
        default:           key = f.toLowerCase();
      }
      if (key) dynamicInputs[key] = "";
    });
    // if the model uses Age*Class, make sure both age & class appear
    if (rawFeatures.includes("Age#Class")) {
      if (!dynamicInputs.age)   dynamicInputs.age   = "";
      if (!dynamicInputs.class) dynamicInputs.class = "";
    }
    setInputs(dynamicInputs);
    // Move straight to input
    setShowInputs(true);
    setShowHistory(false);

    setTimeout(() => {
      document.querySelector(".input-grid")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };


  // Save prediction to history
  const saveToHistory = (inputs, predictions) => {
    const newHistoryEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      inputs: { ...inputs },
      predictions: { ...predictions },
    };

    const updatedHistory = [newHistoryEntry, ...predictionHistory].slice(0, 10);
    setPredictionHistory(updatedHistory);
    localStorage.setItem("predictionHistory", JSON.stringify(updatedHistory));
  };

  // Load history item into calculator
  const loadHistoryItem = (historyItem) => {
    const sanitizedInputs = { ...historyItem.inputs };
    setModelPredictions(historyItem.predictions);
    setSelectedModels(Object.keys(historyItem.predictions));
    setShowHistory(false);
    setShowInputs(true);
  };

  // Prediction function with proper Age*Class validation
  const makePrediction = async () => {
    if (selectedModels.length === 0) return;
    setIsCalculating(true);

    try {
      // Convert inputs to numerical values
      const ageNum = parseFloat(inputs.age) || 0;
      const fareNum = parseFloat(inputs.fare) || 0;
      const pclassNum =
        inputs.class === "First" ? 1 : inputs.class === "Second" ? 2 : 3;

      // Calculate and constrain Age*Class between 0 and 12
      const ageClassValue = Math.min(Math.max(ageNum * pclassNum, 0), 12);

      // Prepare payload with properly constrained values
      const model = availableModels.find((m) => m.id === selectedModels[0]);
      const payload = {};
      if (model) {
        const featureSet = new Set(model.features);
        const age = parseFloat(inputs.age) || 0;
        const fare = parseFloat(inputs.fare) || 0;
        const pclass =
          inputs.class === "First" ? 1 : inputs.class === "Second" ? 2 : 3;
        for (const rawFeature of model.features) {
          const feature = rawFeature.replace("#", "*");
          switch (feature) {
            case "Age":
              payload["Age"] = age;
              break;
            case "Pclass":
              payload["Pclass"] =
                payload["Pclass"] = pclass;
              break;
            case "Fare":
              payload["Fare"] = fare;
              break;
            case "Sex":
              payload["Sex"] = inputs.sex === "Male" ? 0 : 1;
              break;
            case "Embarked":
              payload["Embarked"] =
                inputs.embarked === "Cherbourg"
                  ? 0
                  : inputs.embarked === "Queenstown"
                  ? 1
                  : 2;
              break;
            case "Title":
              payload["Title"] =
                inputs.title === "Mr"
                  ? 1
                  : inputs.title === "Miss"
                  ? 2
                  : inputs.title === "Mrs"
                  ? 3
                  : inputs.title === "Master"
                  ? 4
                  : 5;
              break;
            case "IsAlone":
              payload["IsAlone"] = inputs.alone === "Yes" ? 1 : 0;
              break;
            case "Age*Class": {
              const rawAge = parseFloat(inputs.age);
              const classInput = inputs.class;
              if (!rawAge || !classInput) {
                throw new Error("Missing Age or Class input needed to compute Age*Class.");
              }
              const classValue =
                classInput === "First" ? 1 : classInput === "Second" ? 2 : 3;
              // Binning Age
              let binnedAge = 0;
              if (rawAge <= 16) binnedAge = 0;
              else if (rawAge <= 32) binnedAge = 1;
              else if (rawAge <= 48) binnedAge = 2;
              else if (rawAge <= 64) binnedAge = 3;
              else binnedAge = 4;
              payload["Age*Class"] = binnedAge * classValue;
              break;
            }
          }
        }
      }

      const predictions = {};

      for (const modelId of selectedModels) {
        try {
          const response = await fetch(
            `/api/model/predict/${modelId}`,
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
          // store the probability for display
          setModelProbas(probas => ({
            ...probas,
            [modelId]: result.probability_class_0
          }));

        } catch (error) {
          console.error(`Prediction error for model ${modelId}:`, error);
          predictions[modelId] = "Error: " + error.message;
        }
      }

      setModelPredictions(predictions);
      saveToHistory(inputs, predictions);
    } catch (error) {
      console.error("Prediction failed:", error);
      setModelPredictions({ error: error.message });
    } finally {
      setIsCalculating(false);
    }
  };

  const allInputsFilled = Object.values(inputs).every((val) => val !== "");

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="tech-calculator logged-in-calculator">
      <div className="circuit-lines"></div>
      <div className="data-dots"></div>

      <div className="container">
        {!showInputs && !showHistory && (
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
              <span>LOGGED IN {user?.username?.toUpperCase()}</span>
              {predictionHistory.length > 0 && (
                <button
                  className="history-toggle"
                  onClick={() => setShowHistory(true)}
                >
                  VIEW HISTORY
                </button>
              )}
            </div>
          </div>
        )}

        {showHistory && (
          <div className="history-panel">
            <div className="history-header">
              <h3>PREDICTION HISTORY</h3>
              <button
                className="close-history"
                onClick={() => setShowHistory(false)}
              >
                ×
              </button>
            </div>
            <div className="history-items">
              {predictionHistory.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => loadHistoryItem(item)}
                >
                  <div className="history-timestamp">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  <div className="history-summary">
                    {Object.values(item.predictions).filter((p) =>
                      p.includes("Survived")
                    ).length > 0
                      ? "Mostly Survived"
                      : "Mostly Did Not Survive"}
                  </div>
                  <div className="history-models">
                    {Object.keys(item.predictions).length} models
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showInputs && !showHistory && (
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
                    <div className="card-meta">
                      <span>🧠 {model.model_name}</span>
                      <span>📅 {new Date(model.trained_at).toLocaleString()}</span>
                      <span>🧬 Features: {model.features.join(", ")}</span>
                    </div>
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
              {Object.entries(inputs)
                .filter(([field]) => field.toLowerCase() !== "age#class")
                .map(([field, value]) => (
                <div
                  key={field}
                  className={`input-cell ${value ? "filled" : ""}`}
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
                          onClick={() => handleInputChange(field, option)}
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
                const model = availableModels.find(m => m.id === selectedModels[0]);
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
                      {result.includes("Error") ? (
                        <div className="error-message">
                          Error:{" "}
                          {JSON.parse(result.replace("Error: ", "")).detail}
                        </div>
                      ) : (
                        <h3>{result}</h3>
                      )}
                      {!result.includes("Error") && (
                        <p className="confidence">
                          Confidence: {(modelProbas[modelId] * 100).toFixed(1)}%
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
