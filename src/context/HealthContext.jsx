import { createContext, useState, useContext } from 'react';

const HealthContext = createContext();

export function HealthProvider({ children }) {
  const [moodData, setMoodData] = useState([]);
  const [medications, setMedications] = useState([]);
  const [fitnessSyncData, setFitnessSyncData] = useState(null);

  const updateMood = (mood) => {
    setMoodData(prev => [...prev, { mood, date: new Date() }]);
  };

  const syncWithGoogleFit = async () => {
    // Google Fit API integration would go here
    const dummyData = { steps: 8000, heartRate: 75 };
    setFitnessSyncData(dummyData);
  };

  return (
    <HealthContext.Provider value={{
      moodData,
      updateMood,
      medications,
      setMedications,
      fitnessSyncData,
      syncWithGoogleFit
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export const useHealth = () => useContext(HealthContext);
