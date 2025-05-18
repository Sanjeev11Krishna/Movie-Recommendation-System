import React from 'react';
import './Team.css';

const teamMembers = [
  { name: 'Sanjeev Krishna T', role: 'Team Lead', image: '/images/image_test.JPG' },
  { name: 'Gokula Krishnan M', role: 'Model Developer', image: '/images/image_test.JPG' },
  { name: 'Saravanavel C', role: 'Frontend Developer, Documentation', image: '/images/image_test.JPG' },
  { name: 'Jayantha Sri M', role: 'EDA, Frontend Developer', image: '/images/image_test.JPG' },
  { name: 'Prakalya M', role: 'Data Preprocessing', image: '/images/image_test.JPG' },
];

const Team = () => {
  return (
    <div className="team-container">
      <h2>Meet Our Team</h2>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.image} alt={member.name} className="team-image" />
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
