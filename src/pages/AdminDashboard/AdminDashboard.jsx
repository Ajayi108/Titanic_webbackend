import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  //   const { user } = useContext(AuthContext);
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  //   // Admin check - redirect if not admin
  //   if (!user || !user.isAdmin) {
  //     return <Navigate to="/login" replace />;
  //   }

  const algorithmOptions = [
    { id: "random-forest", name: "Random Forest", type: "ENSEMBLE METHOD" },
    { id: "decision-tree", name: "Decision Tree", type: "HIERARCHICAL METHOD" },
    { id: "knn", name: "K-Nearest Neighbors", type: "INSTANCE-BASED METHOD" },
    { id: "svm", name: "Support Vector Machine", type: "KERNEL METHOD" },
    {
      id: "logistic-regression",
      name: "Logistic Regression",
      type: "STATISTICAL METHOD",
    },
  ];

  const featureOptions = [
    {
      id: "pclass",
      name: "Passenger Class",
      description: "The class of ticket purchased (1st, 2nd, 3rd)",
    },
    { id: "sex", name: "Sex", description: "Gender of the passenger" },
    { id: "age", name: "Age", description: "Age of the passenger in years" },
    { id: "fare", name: "Fare", description: "Price paid for the ticket" },
    {
      id: "embarked",
      name: "Embarked",
      description:
        "Port of embarkation (C = Cherbourg, Q = Queenstown, S = Southampton)",
    },
    {
      id: "title",
      name: "Title",
      description: "Title extracted from name (Mr, Mrs, Miss, etc.)",
    },
    {
      id: "isalone",
      name: "Is Alone",
      description: "Whether the passenger was traveling alone",
    },
    {
      id: "ageclass",
      name: "Age*Class",
      description: "Interaction feature of age and passenger class",
    },
  ];

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setIsLoading(true);
    // This would be a real API call in production
    setTimeout(() => {
      // Mock data for demonstration
      const mockModels = [
        {
          id: 1,
          name: "Default Random Forest",
          algorithm: "random-forest",
          features: [
            "pclass",
            "sex",
            "age",
            "fare",
            "embarked",
            "title",
            "isalone",
            "ageclass",
          ],
          accuracy: 83.4,
          createdAt: "2023-06-15",
        },
        {
          id: 2,
          name: "SVM Classic",
          algorithm: "svm",
          features: ["pclass", "sex", "age", "fare"],
          accuracy: 79.2,
          createdAt: "2023-06-15",
        },
        {
          id: 3,
          name: "Decision Tree v1",
          algorithm: "decision-tree",
          features: ["pclass", "sex", "age", "fare", "embarked"],
          accuracy: 76.8,
          createdAt: "2023-07-22",
        },
        {
          id: 4,
          name: "KNN Proximity",
          algorithm: "knn",
          features: ["pclass", "sex", "age", "fare", "embarked", "title"],
          accuracy: 74.5,
          createdAt: "2023-08-10",
        },
        {
          id: 5,
          name: "Logistic Gender Focus",
          algorithm: "logistic-regression",
          features: ["sex", "age", "pclass"],
          accuracy: 72.3,
          createdAt: "2023-09-05",
        },
      ];
      setModels(mockModels);
      setIsLoading(false);
    }, 1500);
  };

  const handleTrainModel = async () => {
    // Validation
    if (!newModelName.trim()) {
      showNotification("Please provide a model name", "error");
      return;
    }

    if (!selectedAlgorithm) {
      showNotification("Please select an algorithm", "error");
      return;
    }

    if (selectedFeatures.length < 2) {
      showNotification("Please select at least 2 features", "error");
      return;
    }

    setIsTraining(true);

    // This would be a real API call in production
    setTimeout(() => {
      // Add the new model to the list
      const newModel = {
        id: models.length + 1,
        name: newModelName,
        algorithm: selectedAlgorithm,
        features: selectedFeatures,
        accuracy: (Math.random() * 15 + 70).toFixed(1),
        createdAt: new Date().toISOString().split("T")[0],
      };

      setModels([...models, newModel]);

      // Reset form
      setNewModelName("");
      setSelectedAlgorithm("");
      setSelectedFeatures([]);
      setIsTraining(false);

      showNotification("Model trained successfully", "success");
    }, 5000); // Simulating a 5-second training process
  };

  const handleDeleteModel = async (modelId) => {
    if (confirmDelete === modelId) {
      // Actual delete operation would happen here with API call
      setModels(models.filter((model) => model.id !== modelId));
      setConfirmDelete(null);
      showNotification("Model deleted successfully", "success");
    } else {
      // First click sets up confirmation
      setConfirmDelete(modelId);

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const toggleFeature = (featureId) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter((id) => id !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Animated background elements */}
      <div className="circuit-lines"></div>
      <div className="data-dots"></div>

      <div className="container">
        {/* Header Section */}
        <div className="hero-section">
          <div className="glitch-container">
            <h1 className="glitch" data-text="ADMIN.CONTROL">
              ADMIN.CONTROL
            </h1>
          </div>
          <h2>MODEL MANAGEMENT INTERFACE</h2>
          <p className="subtitle">
            Create, manage and monitor machine learning models for the Titanic
            Survival Prediction Engine
          </p>
        </div>

        {/* Notification System */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            <div className="notification-content">
              {notification.type === "success" ? (
                <span className="notification-icon">✓</span>
              ) : (
                <span className="notification-icon">!</span>
              )}
              <span className="notification-message">
                {notification.message}
              </span>
            </div>
            <div className="notification-progress"></div>
          </div>
        )}

        {/* Models Section */}
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
                        {algorithmOptions.find((a) => a.id === model.algorithm)
                          ?.type || "ALGORITHM"}
                      </div>
                      <h4>{model.name}</h4>
                    </div>
                    <button
                      className={`delete-btn ${
                        confirmDelete === model.id ? "confirm" : ""
                      }`}
                      onClick={() => handleDeleteModel(model.id)}
                    >
                      {confirmDelete === model.id ? "CONFIRM" : "DELETE"}
                    </button>
                  </div>

                  <div className="model-details">
                    <div className="details-row">
                      <div className="detail">
                        <div className="detail-label">ALGORITHM</div>
                        <div className="detail-value">
                          {algorithmOptions.find(
                            (a) => a.id === model.algorithm
                          )?.name || model.algorithm}
                        </div>
                      </div>
                      <div className="detail">
                        <div className="detail-label">ACCURACY</div>
                        <div className="detail-value">{model.accuracy}%</div>
                      </div>
                      <div className="detail">
                        <div className="detail-label">CREATED</div>
                        <div className="detail-value">{model.createdAt}</div>
                      </div>
                    </div>

                    <div className="features-container">
                      <div className="features-label">FEATURES</div>
                      <div className="features-tags">
                        {model.features.map((featureId) => (
                          <div key={featureId} className="feature-tag">
                            {featureOptions.find((f) => f.id === featureId)
                              ?.name || featureId}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Train New Model Section */}
        <section className="train-section">
          <div className="section-header">
            <h3>TRAIN NEW MODEL</h3>
            <div className="header-line"></div>
          </div>

          <div className="train-form">
            <div className="form-row">
              <div className="form-group model-name-group">
                <label>MODEL NAME</label>
                <div className="input-container">
                  <input
                    type="text"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="Enter unique model identifier"
                  />
                  <div className="input-underline"></div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group algorithm-group">
                <label>ALGORITHM SELECTION</label>
                <div className="algorithm-options">
                  {algorithmOptions.map((algorithm) => (
                    <div
                      key={algorithm.id}
                      className={`algorithm-option ${
                        selectedAlgorithm === algorithm.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAlgorithm(algorithm.id)}
                    >
                      <div className="option-content">
                        <div className="algorithm-type">{algorithm.type}</div>
                        <div className="algorithm-name">{algorithm.name}</div>
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
                  FEATURE SELECTION{" "}
                  <span className="feature-count">
                    {selectedFeatures.length} SELECTED
                  </span>
                </label>
                <div className="features-options">
                  {featureOptions.map((feature) => (
                    <div
                      key={feature.id}
                      className={`feature-option ${
                        selectedFeatures.includes(feature.id) ? "selected" : ""
                      }`}
                      onClick={() => toggleFeature(feature.id)}
                    >
                      <div className="feature-checkbox">
                        {selectedFeatures.includes(feature.id) && (
                          <div className="checkbox-inner"></div>
                        )}
                      </div>
                      <div className="feature-info">
                        <div className="feature-name">{feature.name}</div>
                        <div className="feature-description">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="reset-btn"
                onClick={() => {
                  setNewModelName("");
                  setSelectedAlgorithm("");
                  setSelectedFeatures([]);
                }}
              >
                <span className="btn-icon">↻</span>
                RESET FORM
              </button>

              <button
                className={`train-btn ${isTraining ? "training" : ""}`}
                onClick={handleTrainModel}
                disabled={isTraining}
              >
                {isTraining ? (
                  <div className="training-indicator">
                    <span>TRAINING MODEL</span>
                    <div className="training-progress">
                      <div className="progress-bar"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="btn-icon">⚙</span>
                    TRAIN MODEL
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
