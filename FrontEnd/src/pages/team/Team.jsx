import React from 'react';
import './Team.css';
import sanjeev from '../../assets/members/Sanjeev.jpg';
import gokul from '../../assets/members/Gokul.jpg';
import saravana from '../../assets/members/Saravana.jpg';
import prakalya from '../../assets/members/Prakalya.jpg';
import jaya from '../../assets/members/jaya.jpg';

const teamMembers = [
  { name: 'Sanjeev Krishna T', role: 'Team Lead, Feature Engineering', image: sanjeev },
  { name: 'Gokula Krishnan M', role: 'Model Developer', image: gokul },
  { name: 'Saravanavel C', role: 'Frontend Developer, Documentation', image: saravana },
  { name: 'Jayantha Sri M', role: 'EDA, Frontend Developer', image: jaya },
  { name: 'Prakalya M', role: 'Data Cleaning', image: prakalya },
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
