const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const colleges = [
  {
    name: 'College of Engineering, Pune (COEP)',
    location: 'Pune',
    type: 'Autonomous',
    rating: 9.2,
    placement_score: 92,
    branches: [
      { branch: 'Computer Engineering', open: 99.8, obc: 99.5, sc: 98.0, nt: 99.0, vjnt: 98.5 },
      { branch: 'Information Technology', open: 99.6, obc: 99.2, sc: 97.5, nt: 98.8, vjnt: 98.2 },
      { branch: 'Electronics & Telecom', open: 99.3, obc: 98.8, sc: 96.5, nt: 98.0, vjnt: 97.5 },
      { branch: 'Mechanical Engineering', open: 98.5, obc: 97.8, sc: 95.0, nt: 97.0, vjnt: 96.5 },
      { branch: 'Civil Engineering', open: 97.2, obc: 96.0, sc: 93.0, nt: 95.5, vjnt: 94.5 },
      { branch: 'Electrical Engineering', open: 98.0, obc: 97.2, sc: 94.5, nt: 96.5, vjnt: 95.8 }
    ]
  },
  {
    name: 'VJTI Mumbai',
    location: 'Mumbai',
    type: 'Autonomous',
    rating: 9.0,
    placement_score: 90,
    branches: [
      { branch: 'Computer Engineering', open: 99.7, obc: 99.3, sc: 97.8, nt: 98.9, vjnt: 98.4 },
      { branch: 'Information Technology', open: 99.4, obc: 98.9, sc: 97.2, nt: 98.6, vjnt: 98.0 },
      { branch: 'Electronics & Telecom', open: 99.0, obc: 98.5, sc: 96.5, nt: 98.2, vjnt: 97.5 },
      { branch: 'Mechanical Engineering', open: 98.2, obc: 97.5, sc: 94.8, nt: 96.8, vjnt: 96.0 },
      { branch: 'Civil Engineering', open: 96.8, obc: 95.5, sc: 92.5, nt: 95.0, vjnt: 94.2 },
      { branch: 'Electrical Engineering', open: 97.5, obc: 96.8, sc: 94.0, nt: 96.2, vjnt: 95.5 }
    ]
  },
  {
    name: 'VNIT Nagpur',
    location: 'Nagpur',
    type: 'Autonomous',
    rating: 9.1,
    placement_score: 91,
    branches: [
      { branch: 'Computer Engineering', open: 99.6, obc: 99.2, sc: 97.5, nt: 98.8, vjnt: 98.3 },
      { branch: 'Information Technology', open: 99.3, obc: 98.8, sc: 97.0, nt: 98.5, vjnt: 97.9 },
      { branch: 'Electronics & Telecom', open: 98.8, obc: 98.2, sc: 96.2, nt: 98.0, vjnt: 97.3 },
      { branch: 'Mechanical Engineering', open: 98.0, obc: 97.2, sc: 94.5, nt: 96.5, vjnt: 95.8 },
      { branch: 'Civil Engineering', open: 96.5, obc: 95.2, sc: 92.0, nt: 94.8, vjnt: 94.0 }
    ]
  },
  {
    name: 'VIT Pune',
    location: 'Pune',
    type: 'Autonomous',
    rating: 8.7,
    placement_score: 85,
    branches: [
      { branch: 'Computer Engineering', open: 99.2, obc: 98.8, sc: 96.5, nt: 98.0, vjnt: 97.5 },
      { branch: 'Information Technology', open: 99.0, obc: 98.5, sc: 96.0, nt: 97.7, vjnt: 97.2 },
      { branch: 'Electronics & Telecom', open: 98.5, obc: 97.8, sc: 95.0, nt: 97.0, vjnt: 96.5 },
      { branch: 'Mechanical Engineering', open: 97.5, obc: 96.5, sc: 93.5, nt: 95.8, vjnt: 95.0 },
      { branch: 'Civil Engineering', open: 95.5, obc: 94.0, sc: 90.5, nt: 93.5, vjnt: 92.5 }
    ]
  },
  {
    name: 'SPIT Mumbai',
    location: 'Mumbai',
    type: 'Autonomous',
    rating: 8.8,
    placement_score: 87,
    branches: [
      { branch: 'Computer Engineering', open: 99.3, obc: 98.8, sc: 97.0, nt: 98.5, vjnt: 98.0 },
      { branch: 'Information Technology', open: 99.0, obc: 98.5, sc: 96.5, nt: 98.2, vjnt: 97.5 },
      { branch: 'Electronics & Telecom', open: 98.6, obc: 98.0, sc: 95.8, nt: 97.8, vjnt: 97.0 }
    ]
  },
  {
    name: 'PICT Pune',
    location: 'Pune',
    type: 'Autonomous',
    rating: 8.5,
    placement_score: 83,
    branches: [
      { branch: 'Computer Engineering', open: 98.8, obc: 98.2, sc: 95.5, nt: 97.5, vjnt: 96.8 },
      { branch: 'Information Technology', open: 98.5, obc: 97.8, sc: 95.0, nt: 97.0, vjnt: 96.5 },
      { branch: 'Electronics & Telecom', open: 97.8, obc: 97.0, sc: 94.0, nt: 96.2, vjnt: 95.5 }
    ]
  },
  {
    name: 'KJ Somaiya Mumbai',
    location: 'Mumbai',
    type: 'Autonomous',
    rating: 8.4,
    placement_score: 82,
    branches: [
      { branch: 'Computer Engineering', open: 98.5, obc: 97.8, sc: 95.2, nt: 97.2, vjnt: 96.5 },
      { branch: 'Information Technology', open: 98.2, obc: 97.5, sc: 94.8, nt: 97.0, vjnt: 96.2 },
      { branch: 'Electronics & Telecom', open: 97.5, obc: 96.7, sc: 93.8, nt: 96.2, vjnt: 95.4 },
      { branch: 'Mechanical Engineering', open: 96.0, obc: 95.0, sc: 91.5, nt: 94.5, vjnt: 93.7 }
    ]
  },
  {
    name: 'Cummins College Pune',
    location: 'Pune',
    type: 'Autonomous',
    rating: 8.3,
    placement_score: 80,
    branches: [
      { branch: 'Computer Engineering', open: 98.2, obc: 97.5, sc: 94.5, nt: 96.8, vjnt: 96.0 },
      { branch: 'Information Technology', open: 98.0, obc: 97.2, sc: 94.0, nt: 96.5, vjnt: 95.8 },
      { branch: 'Electronics & Telecom', open: 97.2, obc: 96.3, sc: 93.0, nt: 95.5, vjnt: 94.8 },
      { branch: 'Mechanical Engineering', open: 96.0, obc: 95.0, sc: 91.5, nt: 94.2, vjnt: 93.5 }
    ]
  },
  {
    name: 'Walchand COE Sangli',
    location: 'Solapur',
    type: 'Autonomous',
    rating: 8.3,
    placement_score: 81,
    branches: [
      { branch: 'Computer Engineering', open: 97.8, obc: 96.8, sc: 93.5, nt: 96.2, vjnt: 95.4 },
      { branch: 'Information Technology', open: 97.3, obc: 96.3, sc: 93.0, nt: 95.7, vjnt: 94.9 },
      { branch: 'Electronics & Telecom', open: 96.5, obc: 95.3, sc: 92.0, nt: 94.9, vjnt: 94.0 },
      { branch: 'Mechanical Engineering', open: 94.5, obc: 93.3, sc: 89.8, nt: 92.8, vjnt: 91.8 },
      { branch: 'Civil Engineering', open: 91.5, obc: 90.3, sc: 86.8, nt: 89.8, vjnt: 88.8 }
    ]
  },
  {
    name: 'Govt COE Aurangabad',
    location: 'Aurangabad',
    type: 'Autonomous',
    rating: 8.2,
    placement_score: 80,
    branches: [
      { branch: 'Computer Engineering', open: 97.5, obc: 96.5, sc: 93.2, nt: 95.9, vjnt: 95.1 },
      { branch: 'Information Technology', open: 97.0, obc: 96.0, sc: 92.7, nt: 95.4, vjnt: 94.6 },
      { branch: 'Electronics & Telecom', open: 96.2, obc: 95.0, sc: 91.8, nt: 94.6, vjnt: 93.7 },
      { branch: 'Mechanical Engineering', open: 94.0, obc: 92.8, sc: 89.2, nt: 92.3, vjnt: 91.3 }
    ]
  },
  {
    name: 'MIT COE Pune',
    location: 'Pune',
    type: 'Non-Autonomous',
    rating: 8.0,
    placement_score: 78,
    branches: [
      { branch: 'Computer Engineering', open: 97.5, obc: 96.8, sc: 93.5, nt: 96.0, vjnt: 95.2 },
      { branch: 'Information Technology', open: 97.0, obc: 96.2, sc: 93.0, nt: 95.5, vjnt: 94.8 },
      { branch: 'Electronics & Telecom', open: 96.2, obc: 95.3, sc: 92.0, nt: 94.7, vjnt: 93.8 },
      { branch: 'Mechanical Engineering', open: 94.8, obc: 93.8, sc: 90.0, nt: 93.2, vjnt: 92.5 },
      { branch: 'Civil Engineering', open: 92.5, obc: 91.2, sc: 87.5, nt: 90.8, vjnt: 89.8 }
    ]
  },
  {
    name: 'YCCE Nagpur',
    location: 'Nagpur',
    type: 'Autonomous',
    rating: 8.1,
    placement_score: 79,
    branches: [
      { branch: 'Computer Engineering', open: 97.2, obc: 96.3, sc: 93.0, nt: 95.7, vjnt: 94.9 },
      { branch: 'Information Technology', open: 96.8, obc: 95.8, sc: 92.5, nt: 95.3, vjnt: 94.5 },
      { branch: 'Electronics & Telecom', open: 96.0, obc: 94.8, sc: 91.5, nt: 94.5, vjnt: 93.7 },
      { branch: 'Mechanical Engineering', open: 93.5, obc: 92.3, sc: 88.8, nt: 92.0, vjnt: 91.0 }
    ]
  },
  {
    name: 'Thadomal Shahani Mumbai',
    location: 'Mumbai',
    type: 'Non-Autonomous',
    rating: 7.8,
    placement_score: 75,
    branches: [
      { branch: 'Computer Engineering', open: 97.0, obc: 96.2, sc: 92.8, nt: 95.5, vjnt: 94.8 },
      { branch: 'Information Technology', open: 96.5, obc: 95.7, sc: 92.3, nt: 95.0, vjnt: 94.3 },
      { branch: 'Electronics & Telecom', open: 95.5, obc: 94.5, sc: 91.0, nt: 93.8, vjnt: 93.0 },
      { branch: 'Mechanical Engineering', open: 93.0, obc: 91.8, sc: 88.2, nt: 91.3, vjnt: 90.5 }
    ]
  },
  {
    name: 'Shivaji University COE Kolhapur',
    location: 'Kolhapur',
    type: 'Autonomous',
    rating: 7.6,
    placement_score: 73,
    branches: [
      { branch: 'Computer Engineering', open: 95.5, obc: 94.3, sc: 90.8, nt: 93.8, vjnt: 92.8 },
      { branch: 'Information Technology', open: 95.0, obc: 93.8, sc: 90.3, nt: 93.3, vjnt: 92.3 },
      { branch: 'Electronics & Telecom', open: 94.0, obc: 92.8, sc: 89.3, nt: 92.3, vjnt: 91.3 },
      { branch: 'Mechanical Engineering', open: 91.0, obc: 89.8, sc: 86.2, nt: 89.2, vjnt: 88.2 }
    ]
  },
  {
    name: 'Bharati Vidyapeeth Pune',
    location: 'Pune',
    type: 'Non-Autonomous',
    rating: 7.5,
    placement_score: 72,
    branches: [
      { branch: 'Computer Engineering', open: 96.0, obc: 95.0, sc: 91.5, nt: 94.3, vjnt: 93.5 },
      { branch: 'Information Technology', open: 95.5, obc: 94.5, sc: 91.0, nt: 93.8, vjnt: 93.0 },
      { branch: 'Electronics & Telecom', open: 94.5, obc: 93.3, sc: 89.5, nt: 92.7, vjnt: 91.8 },
      { branch: 'Mechanical Engineering', open: 92.0, obc: 90.8, sc: 87.0, nt: 90.2, vjnt: 89.2 },
      { branch: 'Civil Engineering', open: 88.5, obc: 87.2, sc: 83.5, nt: 86.8, vjnt: 85.8 }
    ]
  },
  {
    name: 'KK Wagh COE Nashik',
    location: 'Nashik',
    type: 'Non-Autonomous',
    rating: 7.4,
    placement_score: 70,
    branches: [
      { branch: 'Computer Engineering', open: 95.0, obc: 93.8, sc: 90.3, nt: 93.3, vjnt: 92.3 },
      { branch: 'Information Technology', open: 94.5, obc: 93.3, sc: 89.8, nt: 92.8, vjnt: 91.8 },
      { branch: 'Electronics & Telecom', open: 93.5, obc: 92.3, sc: 88.8, nt: 91.8, vjnt: 90.8 },
      { branch: 'Mechanical Engineering', open: 90.5, obc: 89.3, sc: 85.8, nt: 88.8, vjnt: 87.8 }
    ]
  },
  {
    name: 'Priyadarshini COE Nagpur',
    location: 'Nagpur',
    type: 'Non-Autonomous',
    rating: 7.2,
    placement_score: 68,
    branches: [
      { branch: 'Computer Engineering', open: 94.5, obc: 93.3, sc: 89.8, nt: 92.8, vjnt: 91.8 },
      { branch: 'Information Technology', open: 94.0, obc: 92.8, sc: 89.3, nt: 92.3, vjnt: 91.3 },
      { branch: 'Mechanical Engineering', open: 90.0, obc: 88.8, sc: 85.0, nt: 88.2, vjnt: 87.2 },
      { branch: 'Civil Engineering', open: 87.0, obc: 85.8, sc: 82.0, nt: 85.2, vjnt: 84.2 }
    ]
  },
  {
    name: 'Marathwada Institute Aurangabad',
    location: 'Aurangabad',
    type: 'Non-Autonomous',
    rating: 7.0,
    placement_score: 65,
    branches: [
      { branch: 'Computer Engineering', open: 93.0, obc: 91.8, sc: 88.2, nt: 91.3, vjnt: 90.3 },
      { branch: 'Information Technology', open: 92.5, obc: 91.3, sc: 87.7, nt: 90.8, vjnt: 89.8 },
      { branch: 'Mechanical Engineering', open: 88.5, obc: 87.3, sc: 83.5, nt: 86.7, vjnt: 85.7 },
      { branch: 'Civil Engineering', open: 85.0, obc: 83.8, sc: 80.0, nt: 83.2, vjnt: 82.2 }
    ]
  },
  {
    name: 'Solapur University COE',
    location: 'Solapur',
    type: 'Non-Autonomous',
    rating: 6.9,
    placement_score: 63,
    branches: [
      { branch: 'Computer Engineering', open: 91.5, obc: 90.3, sc: 86.8, nt: 89.8, vjnt: 88.8 },
      { branch: 'Information Technology', open: 91.0, obc: 89.8, sc: 86.3, nt: 89.3, vjnt: 88.3 },
      { branch: 'Mechanical Engineering', open: 86.0, obc: 84.8, sc: 81.2, nt: 84.2, vjnt: 83.2 }
    ]
  },
  {
    name: 'Sandip Institute Nashik',
    location: 'Nashik',
    type: 'Non-Autonomous',
    rating: 6.8,
    placement_score: 62,
    branches: [
      { branch: 'Computer Engineering', open: 90.0, obc: 88.8, sc: 85.2, nt: 88.2, vjnt: 87.2 },
      { branch: 'Information Technology', open: 89.5, obc: 88.3, sc: 84.7, nt: 87.7, vjnt: 86.7 },
      { branch: 'Mechanical Engineering', open: 85.0, obc: 83.8, sc: 80.2, nt: 83.2, vjnt: 82.2 }
    ]
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const college of colleges) {
      const collegeResult = await client.query(
        'INSERT INTO colleges(name, location, type, rating, placement_score, website) VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
        [college.name, college.location, college.type, college.rating, college.placement_score, null]
      );
      const collegeId = collegeResult.rows[0].id;
      for (const branch of college.branches) {
        await client.query(
          'INSERT INTO college_branches(college_id, branch, cutoff_open, cutoff_obc, cutoff_sc, cutoff_nt, cutoff_vjnt) VALUES($1,$2,$3,$4,$5,$6,$7)',
          [collegeId, branch.branch, branch.open, branch.obc, branch.sc, branch.nt, branch.vjnt]
        );
      }
    }
    await client.query('COMMIT');
    console.log('College seed completed');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed colleges', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
