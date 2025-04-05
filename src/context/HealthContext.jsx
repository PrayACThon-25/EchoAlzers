import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useUser } from './UserContext';

const HealthContext = createContext();

export function HealthProvider({ children }) {
  const { profile } = useUser();
  const [moodData, setMoodData] = useState([]);
  const [medications, setMedications] = useState([]);
  const [fitnessSyncData, setFitnessSyncData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const updateMood = (mood) => {
    setMoodData(prev => [...prev, { mood, date: new Date() }]);
  };

  const syncWithGoogleFit = async () => {
    const dummyData = { steps: 8000, heartRate: 75 };
    setFitnessSyncData(dummyData);
  };

  const generateRecommendations = useCallback(() => {
    if (!profile) {
      setRecommendations([]);
      return;
    }
    
    const newRecommendations = [
      {
        type: 'exercise',
        recommendation: `Based on your age (${profile.age}) and conditions, we recommend...`,
      },
    ];
    setRecommendations(newRecommendations);
  }, [profile]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  return (
    <HealthContext.Provider value={{
      moodData,
      updateMood,
      medications,
      setMedications,
      fitnessSyncData,
      syncWithGoogleFit,
      recommendations,
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export const useHealth = () => useContext(HealthContext);
