import { useState } from 'react';

function Treatment() {
  const [treatments, setTreatments] = useState([
    {
      id: 1,
      name: 'Physical Therapy',
      schedule: 'Mon, Wed, Fri',
      progress: '8/12',
      completed: 8,
      total: 12,
      isExpanded: false,
    },
    {
      id: 2,
      name: 'Medication Routine',
      schedule: 'Daily',
      progress: '28/30',
      completed: 28,
      total: 30,
      isExpanded: false,
    }
  ]);

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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-6 border-b">
        <div>
          <h2 className="section-title mb-1">Treatment Plan</h2>
          <p className="text-gray-500">Manage your ongoing treatments and progress</p>
        </div>
        <button className="btn btn-primary">
          Add Treatment
        </button>
      </div>

      <div className="grid gap-4">
        {treatments.map((treatment) => (
          <div key={treatment.id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {treatment.name}
                </h3>
                <p className="text-gray-600">Schedule: {treatment.schedule}</p>
              </div>
              <div className="flex items-center gap-4">
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
                <div className="mt-4 flex justify-end gap-2">
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
    </div>
  );
}

export default Treatment;
