import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI-Powered Insights',
      description: 'Get personalized treatment recommendations based on your recovery progress',
      icon: '🤖'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your recovery journey with detailed analytics and milestones',
      icon: '📊'
    },
    {
      title: '24/7 Support',
      description: 'Access to medical resources and support whenever you need them',
      icon: '🏥'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Your AI-Powered Health Companion
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          HealSync uses advanced AI to provide personalized post-treatment care
          and recovery tracking, making your healing journey smoother and more effective.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Dashboard
          </button>
          <button
            onClick={() => navigate('/treatment')}
            className="bg-white text-primary px-8 py-3 rounded-lg border-2 border-primary hover:bg-gray-50 transition-colors"
          >
            Start Treatment
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 px-4">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
