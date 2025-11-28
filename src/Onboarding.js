import React, { useState } from 'react';
import './App.css';

function Onboarding() {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    { name: 'Teacher', image: '/teacher.png' },
    { name: 'Parent', image: '/parent.png' },
    { name: 'Student', image: '/student.png' }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Navigate to next step or home
      window.location.href = '/';
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', fontFamily: 'Roboto, sans-serif', overflow: 'hidden' }}>
      {/* Header with Logo */}
      <header style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <h1 style={{
          color: '#B344F1',
          fontSize: '24px',
          fontWeight: '700',
          margin: 0,
          width: '242px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'AG Capitals, sans-serif'
        }}>SmartLearn</h1>
      </header>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        {/* Prompt */}
        <h2 style={{ color: '#333', fontSize: '45px', fontWeight: '500', marginBottom: '40px', textAlign: 'center', ontFamily: 'Quicksand' }}>
          How are you using SmartLearn?
        </h2>

        {/* Role Selection Cards */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginBottom: '60px',
          flexWrap: 'wrap'
        }}>
          {roles.map((role) => (
            <div
              key={role.name}
              onClick={() => handleRoleSelect(role.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '20px',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                border: selectedRole === role.name ? '3px solid #800080' : '3px solid transparent',
                boxShadow: selectedRole === role.name ? '0 0 20px rgba(128, 0, 128, 0.3)' : 'none',
                backgroundColor: selectedRole === role.name ? '#f9f9ff' : 'transparent'
              }}
            >
              {/* Circular Image Area */}
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                marginBottom: '15px',
                border: '4px solid #e0e0e0'
              }}>
                <img
                  src={role.image}
                  alt={role.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              {/* Label Pill */}
              <div style={{
                backgroundColor: '#CF7DEF',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#333',
                width: '130px',
                height: '27                                          px',
              }}>
                {role.name}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '15px',
            backgroundColor: selectedRole ? '#800080' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: '500',
            cursor: selectedRole ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s ease'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
