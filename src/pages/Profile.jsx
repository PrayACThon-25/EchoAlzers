import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Profile() {
  const { profile, setProfile } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(profile || {
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    conditions: '',
    allergies: '',
    medications: '',
    emergencyContact: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="section-title mb-6">Your Health Profile</h2>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Emergency Contact</label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Medical Conditions</label>
          <textarea
            name="conditions"
            value={formData.conditions}
            onChange={handleChange}
            className="input w-full h-20"
            placeholder="List any medical conditions..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Allergies</label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            className="input w-full h-20"
            placeholder="List any allergies..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Current Medications</label>
          <textarea
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            className="input w-full h-20"
            placeholder="List current medications..."
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          {profile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
