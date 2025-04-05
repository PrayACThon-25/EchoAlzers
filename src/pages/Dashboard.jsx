import { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { useUser } from '../context/UserContext';

function Dashboard() {
  const { moodData, fitnessSyncData, syncWithGoogleFit, updateMoodData } = useHealth();
  const { profile } = useUser();
  const [activeMetric, setActiveMetric] = useState(null);
  const [currentMood, setCurrentMood] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [moodFeedback, setMoodFeedback] = useState('');
  const [activities, setActivities] = useState([]);
  const [completedActivities, setCompletedActivities] = useState(new Set());
  const [dietRecommendations, setDietRecommendations] = useState([]);
  const [isDietLoading, setIsDietLoading] = useState(false);

  const moodMessages = {
    '😊': "That's wonderful! Keep up that positive energy!",
    '😐': "It's okay to have neutral days. Take care of yourself.",
    '😢': "I hear you. Remember it's okay to not be okay. Consider talking to someone you trust."
  };

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

  useEffect(() => {
    const generateDailySchedule = () => {
      const schedule = [];
      const today = new Date();

      // Add medications from profile if they exist
      if (profile?.medications) {
        const medications = profile.medications.split('\n').filter(med => med.trim());
        medications.forEach((med, index) => {
          schedule.push({
            id: `med-${index}`,
            time: `${8 + index}:00 AM`,
            task: `Take ${med.split('|')[0].trim()}`,
            type: 'medication'
          });
        });
      }

      // Add upcoming appointments if they exist
      if (profile?.appointments) {
        profile.appointments.forEach((apt, index) => {
          const aptDate = new Date(apt.date);
          if (aptDate.toDateString() === today.toDateString()) {
            schedule.push({
              id: `apt-${index}`,
              time: apt.time,
              task: apt.description || 'Medical Appointment',
              type: 'appointment'
            });
          }
        });
      }

      // Sort activities by time
      schedule.sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a.time}`);
        const timeB = new Date(`1970/01/01 ${b.time}`);
        return timeA - timeB;
      });

      setActivities(schedule);
    };

    generateDailySchedule();
  }, [profile]);

  const updateMood = (mood) => {
    setCurrentMood(mood);
    setMoodFeedback(moodMessages[mood]);
    updateMoodData({
      mood,
      timestamp: new Date().toISOString(),
    });
  };

  const toggleActivityCompletion = (activityId) => {
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const getDietRecommendations = async () => {
    setIsDietLoading(true);
    try {
      const healthContext = `Health: ${profile?.conditions || 'None'}. Allergies: ${profile?.allergies || 'None'}`;

      const prompt = `List 5 traditional Tamil Nadu dishes that are safe for someone with ${healthContext}. Only provide foods that are suitable for a person recovering from the condition.
        DO NOT include any dish that could potentially worsen their condition.
        Output format: Just the dish names, one per line, nothing else.
        Example:
        Keerai Poriyal
        Ragi Kanji`;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD7x2iHKovPb_SHcI6i5kHVs6uLvRl-Bsk",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      const data = await response.json();
      const recommendations = data.candidates[0].content.parts[0].text
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim());

      setDietRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to get diet recommendations:', error);
      setDietRecommendations(['Unable to load recommendations. Please try again.']);
    } finally {
      setIsDietLoading(false);
    }
  };

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
            <div className="flex justify-between items-center mb-6">
              <h3 className="section-title mb-0">Recommended Foods</h3>
              <button
                onClick={getDietRecommendations}
                className="btn btn-outline"
                disabled={isDietLoading}
              >
                {isDietLoading ? 'Loading...' : 'Get Foods'}
              </button>
            </div>
            <div className="grid gap-3">
              {dietRecommendations.map((food, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-gray-50 rounded-lg flex items-center gap-3"
                >
                  <span className="text-lg">🍽️</span>
                  <p className="text-gray-800 font-medium">{food}</p>
                </div>
              ))}
              {dietRecommendations.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Click to get personalized food recommendations
                </p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Today's Schedule</h3>
            <div className="divide-y">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className={`flex items-center justify-between py-3 ${
                      completedActivities.has(activity.id) ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'medication' ? 'bg-primary' : 'bg-secondary'
                      }`}></div>
                      <span className="text-gray-600">{activity.time}</span>
                      <span className={`font-medium ${
                        completedActivities.has(activity.id) ? 'line-through' : ''
                      }`}>{activity.task}</span>
                    </div>
                    <button 
                      onClick={() => toggleActivityCompletion(activity.id)}
                      className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                        completedActivities.has(activity.id)
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'text-primary hover:text-primary-dark'
                      }`}
                    >
                      {completedActivities.has(activity.id) ? 'Completed' : 'Complete'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No activities scheduled for today
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">How are you feeling?</h3>
            <div className="flex justify-around mb-4">
              {['😊', '😐', '😢'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => updateMood(emoji)}
                  className={`text-3xl p-3 rounded-xl transition-all duration-300 transform ${
                    currentMood === emoji 
                      ? 'bg-primary/10 scale-110 ring-2 ring-primary/20' 
                      : 'hover:bg-gray-50 hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            {moodFeedback && (
              <div className="text-center py-3 px-4 bg-gray-50 rounded-lg animate-fade-in">
                <p className="text-gray-700">{moodFeedback}</p>
              </div>
            )}

            {moodData && moodData.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">Your last mood:</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{moodData[moodData.length - 1].mood}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(moodData[moodData.length - 1].timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            )}
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
