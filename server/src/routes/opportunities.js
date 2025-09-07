import { Router } from 'express';

const router = Router();

// in-memory sample data for demo
const opportunities = [
  { 
    id: 'sch-1', 
    type: 'scholarship', 
    title: 'STEM Scholarship', 
    eligibility: 'Grade 9-12', 
    country: 'IN',
    url: 'https://www.scholarships.com/financial-aid/college-scholarships/scholarships-by-type/stem-scholarships'
  },
  { 
    id: 'int-1', 
    type: 'internship', 
    title: 'Web Dev Internship', 
    eligibility: 'All students', 
    country: 'IN',
    url: 'https://internshala.com/internships/web-development-internship/'
  },
  { 
    id: 'comp-1', 
    type: 'competition', 
    title: 'Hackathon', 
    eligibility: 'All', 
    country: 'GLOBAL',
    url: 'https://unstop.com/hackathons?oppstatus=open&domain=2&course=6&specialization=Computer%20Science%20and%20Engineering&usertype=students&passingOutYear=2028'
  }
];

router.get('/', (req, res) => {
  const { type, country } = req.query;
  const filtered = opportunities.filter(o => (!type || o.type === type) && (!country || o.country === country));
  res.json({ items: filtered });
});

export default router;

