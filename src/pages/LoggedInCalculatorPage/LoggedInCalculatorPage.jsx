import { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
import "./LoggedInCalculatorPage.css";
import Footer from "../../components/Footer/Footer";

const LoggedInCalculatorPage = () => {
  // Auth context for production (commented out for development)
  // const { user } = useContext(AuthContext);
  // const navigate = useNavigate();

  // Redirect if not authenticated (commented out for development)
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/calculator");
  //   }
  // }, [user, navigate]);

  // State for development
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
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Input options
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
    fetchAvailableModels();
  }, []);

  // Fetch prediction history on mount
  useEffect(() => {
    fetchPredictionHistory();
  }, []);

  // API call to fetch available models comes here
  const fetchAvailableModels = async () => {
    try {
      // API call to fetch models
      // const response = await api.get('/api/models');
      // setAvailableModels(response.data);

      // Mock data for development
      setTimeout(() => {
        const mockModels = [
          {
            id: "random-forest",
            name: "RANDOM FOREST",
            type: "ENSEMBLE METHOD",
            description: "Multiple decision trees for robust prediction",
            accuracy: "82.3%",
          },
          {
            id: "svm",
            name: "SUPPORT VECTOR MACHINE",
            type: "KERNEL METHOD",
            description: "High-dimensional classification",
            accuracy: "78.9%",
          },
          {
            id: "decision-tree",
            name: "DECISION TREE",
            type: "TREE METHOD",
            description: "Hierarchical decision branching",
            accuracy: "76.4%",
          },
          {
            id: "logistic-regression",
            name: "LOGISTIC REGRESSION",
            type: "STATISTICAL METHOD",
            description: "Probability-based classification",
            accuracy: "77.8%",
          },
          {
            id: "knn",
            name: "K-NEAREST NEIGHBORS",
            type: "INSTANCE-BASED METHOD",
            description: "Proximity-based classification",
            accuracy: "75.1%",
          },
        ];
        setAvailableModels(mockModels);
      }, 500);
    } catch (error) {
      console.error("Error fetching available models:", error);
    }
  };

  // API call to fetch 10 persistent prediction history comes here
  const fetchPredictionHistory = async () => {
    try {
      // API call to fetch prediction history
      // const response = await api.get('/api/prediction-history');
      // setPredictionHistory(response.data);

      // Mock data for development
      setTimeout(() => {
        const mockHistory = Array(10)
          .fill()
          .map((_, i) => ({
            id: i,
            timestamp: new Date(
              Date.now() - i * 24 * 60 * 60 * 1000
            ).toISOString(),
            inputs: {
              class: ["First", "Second", "Third"][
                Math.floor(Math.random() * 3)
              ],
              sex: Math.random() > 0.5 ? "Male" : "Female",
              age: String(Math.floor(Math.random() * 70) + 5),
              fare: String(Math.floor(Math.random() * 100) + 10),
              alone: Math.random() > 0.5 ? "Yes" : "No",
              embarked: ["Cherbourg", "Queenstown", "Southampton"][
                Math.floor(Math.random() * 3)
              ],
              title: ["Master", "Miss", "Mr", "Mrs", "Rare"][
                Math.floor(Math.random() * 5)
              ],
            },
            predictions: {
              "random-forest":
                Math.random() > 0.4 ? "Survived" : "Did not survive",
              svm: Math.random() > 0.4 ? "Survived" : "Did not survive",
              "decision-tree":
                Math.random() > 0.4 ? "Survived" : "Did not survive",
            },
          }));
        setPredictionHistory(mockHistory);
      }, 500);
    } catch (error) {
      console.error("Error fetching prediction history:", error);
    }
  };

  // Handler functions
  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
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
      // Small delay for animation
      setTimeout(() => {
        document
          .querySelector(".input-grid")
          .scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  // API call to make prediction comes here
  const makePrediction = async () => {
    if (selectedModels.length === 0) return;

    setIsCalculating(true);

    try {
      // Prepare data for API call
      const predictionData = {
        inputs: {
          ...inputs,
          // Convert data types as needed
          age: inputs.age ? parseFloat(inputs.age) : null,
          fare: inputs.fare ? parseFloat(inputs.fare) : null,
        },
        models: selectedModels,
      };

      // API call to make prediction
      // const response = await api.post('/api/predict-multi', predictionData);
      // setModelPredictions(response.data.predictions);

      // Mock response for development || delete after connection
      setTimeout(() => {
        const predictions = {};

        selectedModels.forEach((modelId) => {
          const features = {
            ...inputs,
            class:
              inputs.class === "First" ? 1 : inputs.class === "Second" ? 2 : 3,
            sex: inputs.sex === "Male" ? 0 : 1,
            alone: inputs.alone === "Yes" ? 1 : 0,
          };

          // Simple mock prediction logic with slight variations per model
          let survivalScore = 0;
          if (features.class === 1) survivalScore += 0.4;
          if (features.sex === 1) survivalScore += 0.3;
          if (parseFloat(features.age) < 16) survivalScore += 0.2;
          if (parseFloat(features.fare) > 100) survivalScore += 0.1;

          // Add some variation between models
          if (modelId === "random-forest") survivalScore += 0.05;
          if (modelId === "svm") survivalScore -= 0.03;
          if (modelId === "decision-tree") survivalScore += 0.02;
          if (modelId === "logistic-regression") survivalScore -= 0.01;
          if (modelId === "knn") survivalScore += 0.04;

          predictions[modelId] =
            survivalScore > 0.5 ? "Survived" : "Did not survive";
        });

        setModelPredictions(predictions);

        if (Object.keys(predictions).length > 0) {
          const newHistoryItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            inputs: { ...inputs },
            predictions: predictions,
          };

          setPredictionHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);

          // API call to save prediction history
          // await api.post('/api/save-prediction', newHistoryItem);
        }

        setIsCalculating(false);
      }, 1200);
    } catch (error) {
      console.error("Error making prediction:", error);
      setIsCalculating(false);
    }
  };

  // Load a history item into the calculator
  const loadHistoryItem = (historyItem) => {
    setInputs(historyItem.inputs);
    setModelPredictions(historyItem.predictions);
    setSelectedModels(Object.keys(historyItem.predictions));
    setShowHistory(false);
    setShowInputs(true);
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

            {/* User status and history toggle */}
            <div className="user-status">
              <div className="status-indicator"></div>
              <span>LOGGED IN AS {mockUser?.username?.toUpperCase()}</span>
              {predictionHistory.length > 0 && (
                <button
                  className="history-toggle"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? "HIDE HISTORY" : "VIEW HISTORY"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Prediction History Panel */}
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

            <div className="history-list">
              {predictionHistory.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => loadHistoryItem(item)}
                >
                  <div className="history-timestamp">
                    {new Date(item.timestamp).toLocaleDateString()} -{" "}
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="history-details">
                    <div className="history-params">
                      <span>{item.inputs.class} Class</span>
                      <span>{item.inputs.sex}</span>
                      <span>Age: {item.inputs.age}</span>
                    </div>
                    <div className="history-results">
                      {Object.entries(item.predictions).map(
                        ([modelId, result]) => (
                          <div
                            key={modelId}
                            className={`history-result ${
                              result === "Survived"
                                ? "survived"
                                : "not-survived"
                            }`}
                          >
                            {availableModels
                              .find((m) => m.id === modelId)
                              ?.name.split(" ")[0] || modelId}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                        max={field === "age" ? 110 : 5000}
                        value={value}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = Number(val);
                          if (
                            val === "" ||
                            (Number.isFinite(num) &&
                              num >= 0 &&
                              num <= (field === "age" ? 110 : 5000))
                          ) {
                            handleInputChange(field, val);
                          }
                        }}
                        placeholder={field === "age" ? "AGE" : "FARE"}
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

        {/* Multi-Model Prediction Results */}
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
                      result === "Survived" ? "survived" : "not-survived"
                    }`}
                  >
                    <div className="model-prediction-header">
                      <h4>{model?.name || modelId}</h4>
                      <div className="model-type">{model?.type || "MODEL"}</div>
                    </div>

                    <div className="prediction-visual">
                      <div
                        className={`prediction-circle ${
                          result === "Survived" ? "pulse" : ""
                        }`}
                      >
                        {result === "Survived" ? (
                          <div className="survived-icon">✓</div>
                        ) : (
                          <div className="not-survived-icon">✕</div>
                        )}
                      </div>
                    </div>

                    <div className="prediction-result">
                      <h3>{result}</h3>
                      <p className="confidence">
                        Confidence: {(Math.random() * 30 + 70).toFixed(1)}%
                      </p>
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

            {/* Model Agreement Indicator */}
            <div className="model-agreement">
              <h4>MODEL AGREEMENT</h4>
              <div className="agreement-meter">
                {(() => {
                  const predictions = Object.values(modelPredictions);
                  const survivedCount = predictions.filter(
                    (p) => p === "Survived"
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
