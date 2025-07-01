import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // const { user } = useContext(AuthContext);
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const algorithmOptions = [
    { id: "random-forest", name: "Random Forest", type: "ENSEMBLE METHOD" },
    { id: "decision-tree", name: "Decision Tree", type: "HIERARCHICAL METHOD" },
    { id: "knn", name: "K-Nearest Neighbors", type: "INSTANCE-BASED METHOD" },
    { id: "svm", name: "Support Vector Machine", type: "KERNEL METHOD" },
    { id: "logistic-regression", name: "Logistic Regression", type: "STATISTICAL METHOD" },
  ];

  const featureOptions = [
    { id: "Pclass", name: "Passenger Class", description: "The class of ticket purchased (1st, 2nd, 3rd)" },
    { id: "Sex", name: "Sex", description: "Gender of the passenger" },
    { id: "Age", name: "Age", description: "Age of the passenger in years" },
    { id: "Fare", name: "Fare", description: "Price paid for the ticket" },
    { id: "Embarked", name: "Embarked", description: "Port of embarkation (C = Cherbourg, Q = Queenstown, S = Southampton)" },
    { id: "Title", name: "Title", description: "Title extracted from name (Mr, Mrs, Miss, etc.)" },
    { id: "IsAlone", name: "Is Alone", description: "Whether the passenger was traveling alone" },
  ];

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5002/model/list");
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.warn("Using mock data due to error:", error.message);
      setModels(getMockModels());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockModels = () => [
    {
      id: 1,
      name: "Default Random Forest",
      algorithm: "random-forest",
      features: ["Pclass", "Sex", "Age", "Fare", "Embarked", "Title", "IsAlone"],
      model_index: 0,
      createdAt: "2023-06-15",
    },
  ];

  const handleTrainModel = async () => {
    if (!newModelName.trim()) return showNotification("Please provide a model name", "error");
    if (!selectedAlgorithm) return showNotification("Please select an algorithm", "error");
    if (selectedFeatures.length < 2) return showNotification("Please select at least 2 features", "error");

    setIsTraining(true);
    try {
      const response = await fetch("http://localhost:5002/model/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_index: models.length,
          features: selectedFeatures,
          algorithm: selectedAlgorithm,
          model_name: newModelName,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Training failed");
      }

      const newModel = {
        id: models.length + 1,
        name: newModelName,
        algorithm: selectedAlgorithm,
        features: selectedFeatures,
        model_index: models.length,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setModels([newModel, ...models]);
      showNotification("Model trained successfully", "success");
      setNewModelName("");
      setSelectedAlgorithm("");
      setSelectedFeatures([]);
    } catch (err) {
      console.error("Training error:", err.message);
      showNotification(err.message, "error");
    } finally {
      setIsTraining(false);
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (confirmDelete === modelId) {
      setModels(models.filter((model) => model.id !== modelId));
      setConfirmDelete(null);
      showNotification("Model deleted successfully", "success");
    } else {
      setConfirmDelete(modelId);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleFeature = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="circuit-lines"></div>
      <div className="data-dots"></div>
      <div className="container">
        <div className="hero-section">
          <div className="glitch-container">
            <h1 className="glitch" data-text="ADMIN.CONTROL">ADMIN.CONTROL</h1>
          </div>
          <h2>MODEL MANAGEMENT INTERFACE</h2>
          <p className="subtitle">Create, manage and monitor ML models for Titanic predictions</p>
        </div>

        {notification && (
          <div className={`notification ${notification.type}`}>
            <div className="notification-content">
              <span className="notification-icon">{notification.type === "success" ? "✓" : "!"}</span>
              <span className="notification-message">{notification.message}</span>
            </div>
            <div className="notification-progress"></div>
          </div>
        )}

        <section className="models-section">
          <div className="section-header">
            <h3>ACTIVE PREDICTION MODELS</h3>
            <div className="header-line"></div>
          </div>
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>LOADING MODELS...</p>
            </div>
          ) : (
            <div className="models-grid">
              {models.map((model) => (
                <div key={model.id} className="model-card">
                  <div className="model-header">
                    <div className="model-algorithm">
                      <div className="algorithm-chip">
                        {algorithmOptions.find((a) => a.id === model.algorithm)?.type || "ALGORITHM"}
                      </div>
                      <h4>{model.name}</h4>
                    </div>
                    <button
                      className={`delete-btn ${confirmDelete === model.id ? "confirm" : ""}`}
                      onClick={() => handleDeleteModel(model.id)}
                    >
                      {confirmDelete === model.id ? "CONFIRM" : "DELETE"}
                    </button>
                  </div>
                  <div className="model-details">
                    <div className="details-row">
                      <div className="detail"><div className="detail-label">ALGORITHM</div><div className="detail-value">{algorithmOptions.find((a) => a.id === model.algorithm)?.name || model.algorithm}</div></div>
                      <div className="detail"><div className="detail-label">MODEL INDEX</div><div className="detail-value">{model.model_index}</div></div>
                      <div className="detail"><div className="detail-label">CREATED</div><div className="detail-value">{model.createdAt}</div></div>
                    </div>
                    <div className="features-container">
                      <div className="features-label">FEATURES</div>
                      <div className="features-tags">
                        {model.features.map((fid) => (
                          <div key={fid} className="feature-tag">{featureOptions.find(f => f.id === fid)?.name || fid}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="train-section">
          <div className="section-header"><h3>TRAIN NEW MODEL</h3><div className="header-line"></div></div>
          <div className="train-form">
            <div className="form-row">
              <div className="form-group model-name-group">
                <label>MODEL NAME</label>
                <div className="input-container">
                  <input type="text" value={newModelName} onChange={(e) => setNewModelName(e.target.value)} placeholder="Enter unique model identifier" />
                  <div className="input-underline"></div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group algorithm-group">
                <label>ALGORITHM SELECTION</label>
                <div className="algorithm-options">
                  {algorithmOptions.map((a) => (
                    <div key={a.id} className={`algorithm-option ${selectedAlgorithm === a.id ? "selected" : ""}`} onClick={() => setSelectedAlgorithm(a.id)}>
                      <div className="option-content">
                        <div className="algorithm-type">{a.type}</div>
                        <div className="algorithm-name">{a.name}</div>
                      </div>
                      <div className="selection-indicator"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group features-group">
                <label>
                  FEATURE SELECTION <span className="feature-count">{selectedFeatures.length} SELECTED</span>
                </label>
                <div className="features-options">
                  {featureOptions.map((feature) => (
                    <div key={feature.id} className={`feature-option ${selectedFeatures.includes(feature.id) ? "selected" : ""}`} onClick={() => toggleFeature(feature.id)}>
                      <div className="feature-checkbox">
                        {selectedFeatures.includes(feature.id) && <div className="checkbox-inner"></div>}
                      </div>
                      <div className="feature-info">
                        <div className="feature-name">{feature.name}</div>
                        <div className="feature-description">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="reset-btn" onClick={() => {
                setNewModelName("");
                setSelectedAlgorithm("");
                setSelectedFeatures([]);
              }}><span className="btn-icon">↻</span> RESET FORM</button>

              <button className={`train-btn ${isTraining ? "training" : ""}`} onClick={handleTrainModel} disabled={isTraining}>
                {isTraining ? (
                  <div className="training-indicator">
                    <span>TRAINING MODEL</span>
                    <div className="training-progress"><div className="progress-bar"></div></div>
                  </div>
                ) : (
                  <>
                    <span className="btn-icon">⚙</span> TRAIN MODEL
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
