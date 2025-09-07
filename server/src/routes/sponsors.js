import { Router } from 'express';

const router = Router();

const sponsors = [
  { id: 'sp1', name: 'Tech4All NGO', support: ['mentorship', 'scholarship'] },
  { id: 'sp2', name: 'Green Corp', support: ['resources'] }
];

const matches = [];

router.get('/', (req, res) => {
  res.json({ items: sponsors });
});

router.post('/connect', (req, res) => {
  const { studentName, need } = req.body || {};
  const sponsor = sponsors.find(s => s.support.includes(need)) || sponsors[0];
  const rec = { id: `mat-${Date.now()}`, studentName, need, sponsorId: sponsor.id };
  matches.push(rec);
  res.json({ match: rec });
});

router.get('/impact', (req, res) => {
  res.json({ matches });
});

export default router;

