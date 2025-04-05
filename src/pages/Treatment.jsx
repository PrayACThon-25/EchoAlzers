import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

function Treatment() {
  const { profile } = useUser();
  const [treatments, setTreatments] = useState([]);
  const [shownAlerts, setShownAlerts] = useState({});

  useEffect(() => {
    if (profile?.medications) {
      // Convert profile medications to treatment format
      const medicationsList = profile.medications
        .split('\n')
        .filter(med => med.trim())
        .map((med, index) => {
          const [name, duration] = med.trim().split('|');
          const defaultDuration = 30;
          
          let recurrence = {
            type: 'for',
            duration: defaultDuration,
            endDate: new Date(Date.now() + defaultDuration * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };

          if (duration) {
            if (duration.includes('-')) {
              recurrence = {
                type: 'until',
                endDate: duration,
                duration: Math.ceil((new Date(duration) - new Date()) / (1000 * 60 * 60 * 24))
              };
            } else {
              const days = parseInt(duration);
              recurrence = {
                type: 'for',
                duration: days,
                endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              };
            }
          }

          return {
            id: `prescription-${index}`,
            name: name.trim(),
            schedule: 'Daily',
            progress: '0/30',
            completed: 0,
            total: 30,
            isExpanded: false,
            times: ['09:00'],
            reminderEnabled: true,
            recurrence,
            isPrescription: true
          };
        });

      setTreatments(prev => {
        // Filter out old prescriptions and add new ones
        const nonPrescriptions = prev.filter(t => !t.isPrescription);
        return [...nonPrescriptions, ...medicationsList];
      });
    }
  }, [profile]);

  const [newTreatment, setNewTreatment] = useState({
    name: '',
    schedule: 'Daily',
    total: 30,
    times: ['09:00'],
    reminderEnabled: true,
    recurrence: {
      type: 'until',
      endDate: new Date().toISOString().split('T')[0],
      duration: 30
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    treatmentId: null
  });

  const [alertDialog, setAlertDialog] = useState({
    show: false,
    treatment: null,
    time: null
  });

  const [editingDuration, setEditingDuration] = useState(null);
  const [editableTreatment, setEditableTreatment] = useState(null);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const checkMedications = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      const today = now.toDateString();

      treatments.forEach(treatment => {
        if (treatment.reminderEnabled) {
          treatment.times.forEach(time => {
            const alertKey = `${treatment.id}-${time}-${today}`;
            if (shownAlerts[alertKey]) return; // Skip if alert was already shown today

            const timeDate = new Date(`1970/01/01 ${time}`);
            const currentDate = new Date(`1970/01/01 ${currentTime}`);
            const diffInSeconds = Math.abs((currentDate - timeDate) / 1000);

            if (time === currentTime || diffInSeconds <= 30) {
              // Mark this alert as shown
              setShownAlerts(prev => ({
                ...prev,
                [alertKey]: true
              }));

              setAlertDialog({
                show: true,
                treatment: treatment,
                time: time
              });
              
              // Show browser notification
              if (Notification.permission === 'granted') {
                new Notification('Medication Reminder', {
                  body: `Time to take ${treatment.name}`,
                  icon: '/favicon.ico'
                });
              }
            }
          });
        }
      });
    };

    // Check immediately when component mounts or treatments change
    checkMedications();

    // Check every 10 seconds
    const interval = setInterval(checkMedications, 10000);

    return () => clearInterval(interval);
  }, [treatments, shownAlerts]);

  const toggleExpand = (id) => {
    setTreatments(treatments.map(t => 
      t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
    ));
  };

  const markProgress = (id) => {
    setTreatments(treatments.map(t => 
      t.id === id && t.completed < t.total ? 
      { ...t, 
        completed: t.completed + 1,
        progress: `${t.completed + 1}/${t.total}`
      } : t
    ));
    setAlertDialog({ show: false, treatment: null, time: null });
  };

  const undoProgress = (id) => {
    setTreatments(treatments.map(t => 
      t.id === id && t.completed > 0 ? 
      { ...t, 
        completed: t.completed - 1,
        progress: `${t.completed - 1}/${t.total}`
      } : t
    ));
  };

  const addTreatment = () => {
    setTreatments([...treatments, {
      ...newTreatment,
      id: treatments.length + 1,
      completed: 0,
      progress: `0/${newTreatment.total}`,
      isExpanded: false,
    }]);
    setShowAddForm(false);
    setNewTreatment({
      name: '',
      schedule: 'Daily',
      total: 30,
      times: ['09:00'],
      reminderEnabled: true,
      recurrence: {
        type: 'until',
        endDate: new Date().toISOString().split('T')[0],
        duration: 30
      }
    });
  };

  const updateTreatmentTime = (treatmentId, timeIndex, newTime) => {
    setTreatments(treatments.map(t =>
      t.id === treatmentId
        ? { ...t, times: t.times.map((time, i) => i === timeIndex ? newTime : time) }
        : t
    ));
  };

  const toggleReminder = (treatmentId) => {
    setTreatments(treatments.map(t =>
      t.id === treatmentId
        ? { ...t, reminderEnabled: !t.reminderEnabled }
        : t
    ));
  };

  const deleteTreatment = (id) => {
    setTreatments(treatments.filter(t => t.id !== id));
    setDeleteConfirm({ show: false, treatmentId: null });
  };

  const startEditingDuration = (treatment) => {
    const currentRecurrence = {
      type: treatment.recurrence?.type || 'for',
      duration: treatment.recurrence?.duration || 30,
      endDate: treatment.recurrence?.endDate || new Date().toISOString().split('T')[0]
    };
    
    setEditableTreatment({
      ...treatment,
      recurrence: currentRecurrence
    });
    setEditingDuration(treatment.id);
  };

  const cancelEditingDuration = () => {
    setEditingDuration(null);
    setEditableTreatment(null);
  };

  const updateTreatmentDuration = (treatmentId, updatedRecurrence) => {
    try {
      // Calculate the new duration and end date
      let newDuration, newEndDate;
      
      if (updatedRecurrence.type === 'for') {
        newDuration = parseInt(updatedRecurrence.duration);
        if (isNaN(newDuration) || newDuration < 1) {
          throw new Error('Please enter a valid duration');
        }
        newEndDate = new Date(Date.now() + newDuration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      } else {
        newEndDate = updatedRecurrence.endDate;
        newDuration = Math.ceil((new Date(newEndDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (newDuration < 1) {
          throw new Error('End date must be in the future');
        }
      }

      // Update the treatment
      setTreatments(treatments.map(t => {
        if (t.id === treatmentId) {
          return {
            ...t,
            total: newDuration,
            progress: `${t.completed}/${newDuration}`,
            recurrence: {
              type: updatedRecurrence.type,
              duration: newDuration,
              endDate: newEndDate
            }
          };
        }
        return t;
      }));

      // Reset editing state
      setEditingDuration(null);
      setEditableTreatment(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const dismissAlert = () => {
    setAlertDialog({ show: false, treatment: null, time: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-6 border-b">
        <div>
          <h2 className="section-title mb-1">Treatment Plan</h2>
          <p className="text-gray-500">Manage your ongoing treatments and progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          Add Treatment
        </button>
      </div>

      <div className="grid gap-4">
        {treatments.map((treatment) => (
          <div key={treatment.id} className={`card ${treatment.isPrescription ? 'border-l-4 border-l-primary' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {treatment.name}
                  {treatment.isPrescription && (
                    <span className="ml-2 text-sm text-primary">(Prescribed)</span>
                  )}
                </h3>
                <p className="text-gray-600">Schedule: {treatment.schedule}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDeleteConfirm({ show: true, treatmentId: treatment.id })}
                  className="text-red-500 hover:text-red-700"
                >
                  <span className="sr-only">Delete</span>
                  🗑️
                </button>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="text-primary font-semibold">
                    {treatment.progress}
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(treatment.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {treatment.isExpanded ? '▼' : '▶'}
                </button>
              </div>
            </div>

            {treatment.isExpanded && (
              <div className="mt-4 pt-4 border-t">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${(treatment.completed / treatment.total) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Treatment Duration:</h4>
                      <button
                        onClick={() => editingDuration === treatment.id ? cancelEditingDuration() : startEditingDuration(treatment)}
                        className="text-primary text-sm hover:text-primary-dark"
                      >
                        {editingDuration === treatment.id ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    {editingDuration === treatment.id && editableTreatment ? (
                      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                        <select
                          value={editableTreatment.recurrence.type}
                          onChange={(e) => {
                            const type = e.target.value;
                            setEditableTreatment(prev => ({
                              ...prev,
                              recurrence: {
                                type,
                                duration: 30,
                                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                              }
                            }));
                          }}
                          className="w-full border rounded px-3 py-2 mb-2"
                        >
                          <option value="for">For Duration</option>
                          <option value="until">Until Date</option>
                        </select>

                        {editableTreatment.recurrence.type === 'until' ? (
                          <div className="flex gap-2">
                            <input 
                              type="date"
                              value={editableTreatment.recurrence.endDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => {
                                const endDate = e.target.value;
                                setEditableTreatment(prev => ({
                                  ...prev,
                                  recurrence: {
                                    ...prev.recurrence,
                                    endDate
                                  }
                                }));
                              }}
                              className="w-full border rounded px-3 py-2"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editableTreatment.recurrence.duration}
                              min="1"
                              onChange={(e) => {
                                const duration = parseInt(e.target.value) || 1;
                                setEditableTreatment(prev => ({
                                  ...prev,
                                  recurrence: {
                                    ...prev.recurrence,
                                    duration
                                  }
                                }));
                              }}
                              className="w-full border rounded px-3 py-2"
                            />
                            <span className="text-gray-600">days</span>
                          </div>
                        )}
                        
                        <div className="flex justify-end mt-2">
                          <button 
                            onClick={() => updateTreatmentDuration(treatment.id, editableTreatment.recurrence)}
                            className="btn btn-primary"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-gray-600">
                          {treatment.recurrence?.type === 'until' 
                            ? `Until ${new Date(treatment.recurrence.endDate).toLocaleDateString()}`
                            : `For ${treatment.recurrence.duration} days`}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Medication Times:</h4>
                    <div className="flex flex-wrap gap-2">
                      {treatment.times.map((time, index) => (
                        <input
                          key={index}
                          type="time"
                          value={time}
                          onChange={(e) => updateTreatmentTime(treatment.id, index, e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={treatment.reminderEnabled}
                        onChange={() => toggleReminder(treatment.id)}
                        className="rounded"
                      />
                      Enable Reminders
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => undoProgress(treatment.id)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    disabled={treatment.completed <= 0}
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => markProgress(treatment.id)}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                    disabled={treatment.completed >= treatment.total}
                  >
                    Mark Progress
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to remove this treatment?</p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setDeleteConfirm({ show: false, treatmentId: null })}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteTreatment(deleteConfirm.treatmentId)}
                className="btn bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add New Treatment</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Treatment Name"
                value={newTreatment.name}
                onChange={(e) => setNewTreatment({...newTreatment, name: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
              <select
                value={newTreatment.schedule}
                onChange={(e) => setNewTreatment({...newTreatment, schedule: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Mon, Wed, Fri</option>
              </select>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Recurrence</label>
                <select
                  value={newTreatment.recurrence.type}
                  onChange={(e) => setNewTreatment({
                    ...newTreatment,
                    recurrence: { ...newTreatment.recurrence, type: e.target.value }
                  })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="until">Until Date</option>
                  <option value="for">For Duration</option>
                </select>

                {newTreatment.recurrence.type === 'until' ? (
                  <input
                    type="date"
                    value={newTreatment.recurrence.endDate}
                    onChange={(e) => setNewTreatment({
                      ...newTreatment,
                      recurrence: { ...newTreatment.recurrence, endDate: e.target.value }
                    })}
                    className="w-full border rounded px-3 py-2"
                    min={new Date().toISOString().split('T')[0]}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newTreatment.recurrence.duration}
                      onChange={(e) => setNewTreatment({
                        ...newTreatment,
                        recurrence: { ...newTreatment.recurrence, duration: parseInt(e.target.value) }
                      })}
                      className="w-full border rounded px-3 py-2"
                      min="1"
                    />
                    <span className="text-gray-600">days</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={addTreatment} className="btn btn-primary">Add</button>
                <button onClick={() => setShowAddForm(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medication Alert Dialog */}
      {alertDialog.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Medication Reminder</h3>
            <p className="text-gray-600 mb-4">
              It's time to take {alertDialog.treatment?.name} ({alertDialog.time})
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => markProgress(alertDialog.treatment?.id)}
                className="btn btn-primary"
              >
                Mark as Taken
              </button>
              <button
                onClick={dismissAlert}
                className="btn btn-secondary"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Treatment;
