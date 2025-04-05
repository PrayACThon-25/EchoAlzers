import { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { useUser } from '../context/UserContext';

function Dashboard() {
  const { moodData, fitnessSyncData, syncWithGoogleFit } = useHealth();
  const { profile } = useUser();
  const [activeMetric, setActiveMetric] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    if (profile?.conditions) {
      const conditions = profile.conditions.toLowerCase();
      let message = '';
      
      if (conditions.includes('diabetes')) {
        message = "Remember, managing diabetes is a journey of small victories. Every healthy choice counts!";
      } else if (conditions.includes('heart')) {
        message = "Your heart gets stronger with every step. Keep up with your cardiac care routine!";
      } else if (conditions.includes('arthritis')) {
        message = "gentle movement is progress. You're building strength every day!";
      } else {
        message = "Every day is a step toward better health. You're doing great!";
      }
      
      setMotivationalMessage(message);
    }
  }, [profile]);

  const metrics = [
    { 
      label: 'Recovery Progress',
      value: '75%',
      detail: `Stay strong, ${profile?.name}! Your dedication to recovery is showing results`,
      color: 'bg-green-500'
    },
    {
      label: 'Days Since Treatment',
      value: '14',
      detail: '2 weeks post-surgery recovery',
      color: 'bg-blue-500'
    },
    {
      label: 'Upcoming Check-ups',
      value: '2',
      detail: 'Next appointment: Tomorrow 10:00 AM',
      color: 'bg-purple-500'
    }
  ];

  const activities = [
    { time: '8:00 AM', task: 'Morning Medication' },
    { time: '9:30 AM', task: 'Physical Therapy Session' },
    { time: '2:00 PM', task: 'Doctor\'s Appointment' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b">
        <div className="mb-4 sm:mb-0">
          <h2 className="section-title">Welcome back, {profile?.name}</h2>
          <p className="text-gray-500">Your personal health dashboard</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-secondary flex items-center gap-2"
        >
          <span>↻</span> Refresh
        </button>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
        <p className="text-lg font-medium text-gray-800">
          {motivationalMessage}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="card hover:scale-105 transition-transform cursor-pointer"
                onClick={() => setActiveMetric(metric.label)}
              >
                <div className={`w-12 h-1 ${metric.color} rounded-full mb-3`} />
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                {activeMetric === metric.label && (
                  <p className="text-sm text-gray-600 mt-2">{metric.detail}</p>
                )}
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="section-title">Today's Schedule</h3>
            <div className="divide-y">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-gray-600">{activity.time}</span>
                    <span className="font-medium">{activity.task}</span>
                  </div>
                  <button className="text-sm text-primary hover:text-primary-dark">
                    Complete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="section-title">How are you feeling?</h3>
            <div className="flex justify-around">
              {['😊', '😐', '😢'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => updateMood(emoji)}
                  className="text-3xl p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="section-title mb-0">Fitness Activity</h3>
              <button
                onClick={syncWithGoogleFit}
                className="btn btn-outline"
              >
                Sync
              </button>
            </div>
            {fitnessSyncData && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Steps Today</p>
                  <p className="text-2xl font-bold mt-1">{fitnessSyncData.steps}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Heart Rate</p>
                  <p className="text-2xl font-bold mt-1">{fitnessSyncData.heartRate} bpm</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
