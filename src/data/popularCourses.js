import fundamentals from '../assets/courses/fundamentals.png';
import titanic from '../assets/courses/titanic-course.png';
import python from '../assets/courses/python_course.png';
import ethics from '../assets/courses/ai-ethics.png';
import deeplearning from '../assets/courses/deep-learning.png';
import nlp from '../assets/courses/nlp.png';
import computer from '../assets/courses/cv.png';
import robot from '../assets/courses/robotics.png';

export const popularCourses = [
  {
    id: 'titanic-survival-predictor',
    title: 'Titanic Survival Predictor',
    description: 'Build an AI model to predict Titanic survival using real passenger data.',
    profName: 'Dr. Emily Clark',
    availablePlaces:  15,
    image: titanic,
    skills: ['Data preprocessing', 'Logistic regression', 'Model evaluation'],
  },
  {
    id: 'ml-fundamentals',
    title: 'Machine Learning Fundamentals',
    description: 'Understand core ML algorithms and workflows for real-world projects.',
    profName: 'Prof. John Doe',
    availablePlaces: 15,
    image: fundamentals,
    skills: ['Supervised learning', 'Model training & testing', 'Feature engineering'],
  },
  {
    id: 'python-data-visualization',
    title: 'Data Visualization with Python',
    description: 'Master libraries like Matplotlib and Seaborn to tell data-driven stories.',
    profName: 'Dr. Jane Smith',
    availablePlaces: 10,
    image: python,
    skills: ['Matplotlib & Seaborn', 'Data storytelling', 'Exploratory Data Analysis (EDA)'],   
  },
  {
    id: 'ai-ethics',
    title: 'Ethics in AI',
    description: 'Explore ethical considerations and best practices in AI development.',
    profName: 'Dr. Alice Johnson',
    availablePlaces: 8,
    image: ethics,
    skills: ['Bias detection', 'Responsible AI', 'AI regulation awareness'],
  },
  {
    id: 'deep-learning-essentials',
    title: 'Deep Learning Essentials',
    description: 'Dive into neural networks and learn how deep learning powers modern AI.',
    profName: 'Dr. Marco Rivera',
    availablePlaces: 14,
    image: deeplearning,
    skills: ['Neural network architecture', 'Backpropagation', 'TensorFlow/PyTorch basics'],
  },
  {
    id: 'natural-language-processing',
    title: 'Natural Language Processing',
    description: 'Learn how machines understand and generate human language with NLP techniques.',
    profName: 'Dr. Susan Lin',
    availablePlaces: 11,
    image: nlp,
    skills: ['Text preprocessing', 'Sentiment analysis', 'Transformer models'],
  },
  {
    id: 'computer-vision-basics',
    title: 'Computer Vision Basics',
    description: 'Build systems that interpret and act on image data using OpenCV and deep learning.',
    profName: 'Prof. Ahmed Nouri',
    availablePlaces: 9,
    image: computer,
    skills: ['Image processing', 'OpenCV', 'Convolutional Neural Networks (CNNs)'],
  },
  {
    id: 'ai-for-robotics',
    title: 'AI for Robotics',
    description: 'Combine AI and robotics to create intelligent autonomous agents.',
    profName: 'Dr. Natalia Reyes',
    availablePlaces: 7,
    image: robot,
    skills: ['Path planning', 'Sensor integration', 'Reinforcement learning']
  },
  {
    id: 'generative-ai',
    title: 'Generative AI with Transformers',
    description: 'Explore cutting-edge generative models like GPT and Stable Diffusion.',
    profName: 'Prof. Alex Kim',
    availablePlaces: 13,
    image: fundamentals,
    skills: ['Transformer architecture', 'Text/image generation', 'Fine-tuning models'],
  },
  {
    id: 'ai-in-healthcare',
    title: 'AI in Healthcare',
    description: 'Analyze how AI is revolutionizing diagnostics, treatments, and patient care.',
    profName: 'Dr. Priya Mehta',
    availablePlaces: 10,
    image: fundamentals,
    skills: ['Medical data analysis', 'Predictive modeling', 'Ethical decision-making'],
  },
  {
    id: 'reinforcement-learning',
    title: 'Reinforcement Learning',
    description: 'Train agents to make optimal decisions using trial and error learning.',
    profName: 'Dr. Kai Watanabe',
    availablePlaces: 6,
    image: fundamentals,
    skills: ['Markov Decision Processes', 'Policy learning', 'Q-Learning'],
  },
  {
    id: 'ai-project-lifecycle',
    title: 'AI Project Lifecycle',
    description: 'Master the end-to-end process of developing and deploying AI solutions.',
    profName: 'Prof. Lisa Müller',
    availablePlaces: 9,
    image: fundamentals,
    skills: ['Data pipeline design', 'Model deployment', 'MLOps fundamentals'],
  }
];
