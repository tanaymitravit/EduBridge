import { Router } from 'express';

const router = Router();

const mentors = [
  { id: 'm1', name: 'Asha Gupta', domain: 'Software', languages: ['en', 'hi'] },
  { id: 'm2', name: 'Ravi Kumar', domain: 'Mechanical', languages: ['en', 'hi'] },
  { id: 'm3', name: 'Neha Singh', domain: 'Finance', languages: ['en'] }
];

router.get('/', (req, res) => {
  const { domain, language } = req.query;
  const filtered = mentors.filter(m => (!domain || m.domain === domain) && (!language || m.languages.includes(language)));
  res.json({ items: filtered });
});

router.post('/match', (req, res) => {
  const { interests = [], language = 'en' } = req.body || {};
  const match = mentors.find(m => m.languages.includes(language) && (interests.includes(m.domain)) ) || mentors[0];
  res.json({ mentor: match });
});

export default router;

