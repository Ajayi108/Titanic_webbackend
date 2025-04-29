// SignupInvitation.jsx
import { useNavigate } from 'react-router-dom';

function SignupInvitation() {
  const navigate = useNavigate();

  return (
    <div className="signup-invitation-container">
      <div className="signup-invitation">
        <button 
          className="signup-button"
          onClick={() => navigate('login')}
        >
          <h2>Ready to Discover Your Fate?</h2>
          <p>Sign up now to use our AI prediction tool</p>
        </button>
      </div>
    </div>
  );
}

export default SignupInvitation;