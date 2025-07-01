import { useState } from 'react';
import './CalculatorPage.css';
import Footer from '../../components/Footer/Footer';

const CalculatorPage = () => {
  const [model, setModel] = useState(null);
  const [inputs, setInputs] = useState({
    class: '',
    sex: '',
    age: '',
    fare: '',
    alone: '',
    embarked: '',
    title: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [activeKeyFactor, setActiveKeyFactor] = useState('');
  
  const modelIdMap = {
    'random-forest': 1,
    'svm': 2
  };

  const inputOptions = {
    class: ['First', 'Second', 'Third'],
    sex: ['Male', 'Female'],
    alone: ['Yes', 'No'],
    embarked: ['Cherbourg', 'Queenstown', 'Southampton'],
    title: ['Master', 'Miss', 'Mr', 'Mrs', 'Rare']
  };

  const explanations = {
    class: 'Passenger class was a strong indicator of survival chance',
    sex: 'Women and children had higher survival rates',
    age: 'Children under 10 had better survival odds',
    fare: 'Price of your ticket in American Dollars',
    alone: 'Passengers with family often helped each other survive',
    embarked: 'Embarkation port indicated socioeconomic factors',
    title: 'Titles revealed social standing and marital status'
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setPrediction(null);
    setProbability(null);
    setApiResponse(null);
  };

  const resetInputs = () => {
    setInputs({
      class: '',
      sex: '',
      age: '',
      fare: '',
      alone: '',
      embarked: '',
      title: ''
    });
    setPrediction(null);
    setProbability(null);
    setExplanation(null);
    setApiResponse(null);
  };

  const makePrediction = async () => {
    if (!model) return; 
    setIsCalculating(true);
    setApiResponse(null);
    
    try {
      const embarkedMap = { Cherbourg: 1, Queenstown: 2, Southampton: 0 };
      const titleMap = { Master: 4, Miss: 2, Mr: 1, Mrs: 3, Rare: 5 };
      const getAgeBin = (age) => {
        if (age <= 16) return 0;
        if (age <= 32) return 1;
        if (age <= 48) return 2;
        if (age <= 64) return 3;
        return 4;
      };
      
      const getFareBin = (fare) => {
        if (fare <= 7.91) return 0;
        if (fare <= 14.454) return 1;
        if (fare <= 31) return 2;
        return 3;

      };
      const ageNum = parseFloat(inputs.age) || 0;
      const fareNum = parseFloat(inputs.fare) || 0;

      const binnedAge = getAgeBin(ageNum);
      const binnedFare = getFareBin(fareNum);


      const payload = {
        Age: parseFloat(inputs.age) || 0,
        Pclass: inputs.class === 'First' ? 1 : inputs.class === 'Second' ? 2 : 3,
        Fare: parseFloat(inputs.fare) || 0,
        Sex: inputs.sex === 'Male' ? 0 : 1,
        Embarked: embarkedMap[inputs.embarked] || 0,
        Title: titleMap[inputs.title] || 0,
        IsAlone: inputs.alone === 'Yes' ? 1 : 0,
        'Age*Class' : binnedAge * binnedFare,
        
      };
      const modelId = modelIdMap[model] || 1;
       
      const res = await fetch(`/api/model/predict/${modelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${res.status}`);
      }

      const result = await res.json();
      setApiResponse(result);

      if (result.prediction !== undefined && result.probability_class_0 !== undefined) {
        const label = result.prediction === 1 ? 'Survived' : 'Did not survive';
        setPrediction(label);
        setProbability(result.probability_class_0);
        
        // Determine key factor based on inputs
        if (inputs.class === 'First') setActiveKeyFactor('First Class');
        else if (inputs.sex === 'Female') setActiveKeyFactor('Female Gender');
        else if (inputs.age < 16) setActiveKeyFactor('Young Age');
        else setActiveKeyFactor('Ticket Fare');
      } else {
        throw new Error('Unexpected response format from server');
      }

    } catch (err) {
      console.error('Prediction failed:', err);
      setPrediction(`Error: ${err.message}`);
      setProbability(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const selectModel = (selectedModel) => {
    setModel(selectedModel);
    setShowInputs(true);
    setTimeout(() => {
      document.querySelector('.input-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const allInputsFilled = Object.values(inputs).every(val => val !== '');

  return (
    <div className="tech-calculator">
      <div className="circuit-lines"></div>
      <div className="data-dots"></div>
      <div className="container">
        {!model && (
          <div className="hero-section">
            <div className="glitch-container">
              <h1 className="glitch" data-text="Predictanic">Predictanic</h1>
            </div>
            <h2>SURVIVAL PREDICTION ENGINE</h2>
            <p className="subtitle">
              Advanced machine learning models analyze historical patterns to predict your fate on the maiden voyage
            </p>
          </div>
        )}

        {!model && (
          <div className="model-selection">
            <h3>SELECT PREDICTION ALGORITHM</h3>
            <div className="model-cards">
              <div className="model-card" onClick={() => selectModel('random-forest')}>
                <div className="card-content">
                  <div className="chip">ENSEMBLE METHOD</div>
                  <h4>RANDOM FOREST</h4>
                  <p>Multiple decision trees for robust prediction</p>
                  <div className="accuracy">Accuracy: 82.3%</div>
                </div>
                <div className="card-glow"></div>
              </div>
              <div className="model-card" onClick={() => selectModel('svm')}>
                <div className="card-content">
                  <div className="chip">KERNEL METHOD</div>
                  <h4>SUPPORT VECTOR MACHINE</h4>
                  <p>High-dimensional classification</p>
                  <div className="accuracy">Accuracy: 78.9%</div>
                </div>
                <div className="card-glow"></div>
              </div>
            </div>
          </div>
        )}

        {showInputs && (
          <>
            <div className="model-info">
              <div className="model-tag">
                ACTIVE MODEL: <span>{model === 'random-forest' ? 'RANDOM FOREST' : 'SUPPORT VECTOR MACHINE'}</span>
              </div>
              <button className="change-model" onClick={() => {
                setModel(null);
                setShowInputs(false);
                resetInputs();
              }}>
                CHANGE MODEL
              </button>
            </div>

            <div className="input-grid">
              {Object.entries(inputs).map(([field, value]) => (
                <div
                  key={field}
                  className={`input-cell ${value ? 'filled' : ''}`}
                  onClick={() => setExplanation(field)}
                >
                  <div className="input-header">
                    <div className="input-label">
                      <div className="label-text">{field.toUpperCase()}</div>
                      <div className="label-line"></div>
                    </div>
                    <div className="input-icon">
                      {field === 'class' && <span className="icon">ⅠⅡⅢ</span>}
                      {field === 'sex' && <span className="icon">⚧</span>}
                      {field === 'age' && <span className="icon">⌚</span>}
                      {field === 'fare' && <span className="icon">$</span>}
                      {field === 'alone' && <span className="icon">👤</span>}
                      {field === 'embarked' && <span className="icon">⛴</span>}
                      {field === 'title' && <span className="icon">🪪</span>}
                    </div>
                  </div>

                  {inputOptions[field] ? (
                    <div className="option-grid">
                      {inputOptions[field].map(option => (
                        <div
                          key={option}
                          className={`option ${value === option ? 'selected' : ''}`}
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
                        max={field === 'age' ? 110 : 700}
                        value={value}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = Number(val);
                          if (
                            val === '' ||
                            (Number.isFinite(num) &&
                              num >= 0 &&
                              num <= (field === 'age' ? 110 : 700))
                          ) {
                            handleInputChange(field, val);
                          }
                        }}
                        placeholder={field === 'age' ? 'AGE' : 'FARE'}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (['-', 'e', 'E'].includes(e.key)) {
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
                <button className="close-explanation" onClick={() => setExplanation(null)}>
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
                className={`predict-btn ${allInputsFilled ? 'active' : 'disabled'}`}
                onClick={allInputsFilled ? makePrediction : null}
                disabled={!allInputsFilled || isCalculating}
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

        {prediction && (
          <div className={`result-panel ${prediction === 'Survived' ? 'survived' : 'not-survived'}`}>
            <div className="result-header">
              <h3>PREDICTION RESULT</h3>
              <div className="model-indicator">
                {model === 'random-forest' ? 'RANDOM FOREST' : 'SVM'} ANALYSIS
              </div>
            </div>
            <div className="result-content">
              <div className="result-visual">
                <div className={`result-circle ${prediction === 'Survived' ? 'pulse' : ''}`}>
                  {prediction === 'Survived' ? (
                    <div className="survived-icon">✓</div>
                  ) : (
                    <div className="not-survived-icon">✕</div>
                  )}
                </div>
                <div className="result-rings">
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <div className="ring"></div>
                </div>
              </div>
              <div className="result-text">
                <h2>{prediction}</h2>
                {probability !== null && (
                  <p className="probability">
                    Confidence: {(probability * 100).toFixed(1)}%
                  </p>
                )}
                <p className="explanation">
                  {prediction === 'Survived'
                    ? 'The model indicates a high probability of survival based on these parameters.'
                    : 'The analysis suggests low survival probability for this passenger profile.'}
                </p>
                <div className="result-stats">
                  <div className="stat">
                    <div className="stat-label">KEY FACTOR</div>
                    <div className="stat-value">{activeKeyFactor}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">INFLUENCE</div>
                    <div className="stat-value">
                      {activeKeyFactor === 'First Class' ? '+42%' :
                       activeKeyFactor === 'Female Gender' ? '+38%' :
                       activeKeyFactor === 'Young Age' ? '+25%' : '+15%'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="cta-section">
          <div className="cta-content">
            <h3>UNLOCK FULL ANALYTICS SUITE</h3>
            <p>
              Create an account to save predictions, compare models, and access advanced analytics
            </p>
            <a href="/Signup">
              <button className="cta-btn">
                <span>SIGN UP</span>
                <div className="arrow">→</div>
              </button>
            </a>
          </div>
          <div className="cta-grid"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalculatorPage;