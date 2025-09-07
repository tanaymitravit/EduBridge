import { Router } from 'express';

const router = Router();

const paths = [
  { 
    id: 'career-se', 
    title: 'Software Engineer', 
    skills: ['DSA', 'JS', 'System Design'], 
    achievements: ['Hello World', 'Build CRUD App'],
    icon: '💻',
    description: 'Build scalable applications and solve complex problems',
    difficulty: 'Hard',
    rating: '4.8'
  },
  { 
    id: 'career-me', 
    title: 'Mechanical Engineer', 
    skills: ['Thermo', 'CAD'], 
    achievements: ['Design a Gear'],
    icon: '⚙️',
    description: 'Design and analyze mechanical systems',
    difficulty: 'Medium',
    rating: '4.2'
  },
  {
    id: 'career-ds',
    title: 'Data Scientist',
    skills: ['Python', 'ML', 'Statistics'],
    achievements: ['First Model', 'Data Pipeline'],
    icon: '📊',
    description: 'Extract insights from data using machine learning',
    difficulty: 'Hard',
    rating: '4.6'
  }
];

const dsaRoadmap = {
  steps: [
    {
      id: 'step1',
      title: 'Learn the basics',
      total: 31,
      completed: 0,
      topics: [
        {
          id: 'lec1',
          title: 'Lec 1: Things to Know in C++/Java/Python or any language',
          total: 9,
          completed: 0,
          problems: [
            { id: 'p1', title: 'User Input / Output', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: false } },
            { id: 'p2', title: 'Data Types', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: false } },
            { id: 'p3', title: 'If Else statements', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: false } },
            { id: 'p4', title: 'Switch Statement', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: false } },
            { id: 'p5', title: 'What are arrays, strings?', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: false } },
            { id: 'p6', title: 'For loops', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: false } },
            { id: 'p7', title: 'While loops', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: false } },
            { id: 'p8', title: 'Functions', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: false } },
            { id: 'p9', title: 'Recursion', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: false } }
          ]
        },
        {
          id: 'lec2',
          title: 'Lec 2: Learn Important Sorting Techniques',
          total: 7,
          completed: 0,
          problems: [
            { id: 'p10', title: 'Bubble Sort', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p11', title: 'Selection Sort', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p12', title: 'Insertion Sort', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p13', title: 'Merge Sort', difficulty: 'Medium', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p14', title: 'Quick Sort', difficulty: 'Medium', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p15', title: 'Heap Sort', difficulty: 'Medium', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p16', title: 'Counting Sort', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: true } }
          ]
        },
        {
          id: 'lec3',
          title: 'Lec 3: Learn Binary Search',
          total: 15,
          completed: 0,
          problems: [
            { id: 'p17', title: 'Binary Search', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p18', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p19', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p20', title: 'Search in 2D Matrix', difficulty: 'Medium', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p21', title: 'Find Peak Element', difficulty: 'Medium', status: 'pending', resources: { tuf: true, free: true, practice: true } }
          ]
        }
      ]
    },
    {
      id: 'step2',
      title: 'Learn Important Sorting Techniques',
      total: 7,
      completed: 0,
      topics: [
        {
          id: 'lec4',
          title: 'Lec 4: Arrays - 1D',
          total: 12,
          completed: 0,
          problems: [
            { id: 'p22', title: 'Two Sum', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p23', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p24', title: 'Maximum Subarray', difficulty: 'Medium', status: 'pending', resources: { tuf: true, free: true, practice: true } },
            { id: 'p25', title: 'Product of Array Except Self', difficulty: 'Medium', status: 'pending', resources: { tuf: true, free: true, practice: true } }
          ]
        }
      ]
    },
    {
      id: 'step3',
      title: 'Learn Arrays - 2D',
      total: 15,
      completed: 0,
      topics: []
    },
    {
      id: 'step4',
      title: 'Learn Strings',
      total: 20,
      completed: 0,
      topics: []
    },
    {
      id: 'step5',
      title: 'Learn Linked List',
      total: 25,
      completed: 0,
      topics: []
    },
    {
      id: 'step6',
      title: 'Learn Stacks and Queues',
      total: 18,
      completed: 0,
      topics: []
    },
    {
      id: 'step7',
      title: 'Learn Trees',
      total: 30,
      completed: 0,
      topics: []
    },
    {
      id: 'step8',
      title: 'Learn Graphs',
      total: 35,
      completed: 0,
      topics: []
    },
    {
      id: 'step9',
      title: 'Learn Dynamic Programming',
      total: 40,
      completed: 0,
      topics: []
    }
  ]
};

const progress = {};
const dsaProgress = {};

router.get('/paths', (req, res) => {
  res.json({ items: paths });
});

router.post('/progress', (req, res) => {
  const { studentId = 'demo', careerId, achievement } = req.body || {};
  progress[studentId] = progress[studentId] || {};
  const p = progress[studentId];
  p[careerId] = p[careerId] || { unlocked: [] };
  if (achievement && !p[careerId].unlocked.includes(achievement)) p[careerId].unlocked.push(achievement);
  res.json({ progress: p });
});

router.get('/progress', (req, res) => {
  const { studentId = 'demo' } = req.query;
  res.json({ progress: progress[studentId] || {} });
});

// DSA Roadmap endpoints
router.get('/dsa/roadmap', (req, res) => {
  const { studentId = 'demo' } = req.query;
  const userProgress = dsaProgress[studentId] || {};
  
  // Calculate progress for each step and topic
  const roadmapWithProgress = dsaRoadmap.steps.map(step => {
    const stepProgress = userProgress[step.id] || {};
    let stepCompleted = 0;
    
    const topicsWithProgress = step.topics.map(topic => {
      const topicProgress = stepProgress[topic.id] || {};
      let topicCompleted = 0;
      
      const problemsWithProgress = topic.problems.map(problem => {
        const problemStatus = topicProgress[problem.id] || 'pending';
        if (problemStatus === 'completed') {
          topicCompleted++;
          stepCompleted++;
        }
        return { ...problem, status: problemStatus };
      });
      
      return {
        ...topic,
        completed: topicCompleted,
        problems: problemsWithProgress
      };
    });
    
    return {
      ...step,
      completed: stepCompleted,
      topics: topicsWithProgress
    };
  });
  
  res.json({ 
    roadmap: { ...dsaRoadmap, steps: roadmapWithProgress },
    userProgress: userProgress
  });
});

router.post('/dsa/progress', (req, res) => {
  const { studentId = 'demo', stepId, topicId, problemId, status } = req.body || {};
  
  if (!dsaProgress[studentId]) {
    dsaProgress[studentId] = {};
  }
  
  if (!dsaProgress[studentId][stepId]) {
    dsaProgress[studentId][stepId] = {};
  }
  
  if (!dsaProgress[studentId][stepId][topicId]) {
    dsaProgress[studentId][stepId][topicId] = {};
  }
  
  dsaProgress[studentId][stepId][topicId][problemId] = status;
  
  res.json({ 
    success: true, 
    progress: dsaProgress[studentId],
    message: `Problem ${status === 'completed' ? 'completed' : 'marked as pending'}`
  });
});

router.get('/dsa/stats', (req, res) => {
  const { studentId = 'demo' } = req.query;
  const userProgress = dsaProgress[studentId] || {};
  
  let totalProblems = 0;
  let completedProblems = 0;
  let easyCompleted = 0, mediumCompleted = 0, hardCompleted = 0;
  let easyTotal = 0, mediumTotal = 0, hardTotal = 0;
  
  dsaRoadmap.steps.forEach(step => {
    step.topics.forEach(topic => {
      topic.problems.forEach(problem => {
        totalProblems++;
        
        if (problem.difficulty === 'Easy') easyTotal++;
        else if (problem.difficulty === 'Medium') mediumTotal++;
        else if (problem.difficulty === 'Hard') hardTotal++;
        
        const stepProgress = userProgress[step.id] || {};
        const topicProgress = stepProgress[topic.id] || {};
        const problemStatus = topicProgress[problem.id] || 'pending';
        
        if (problemStatus === 'completed') {
          completedProblems++;
          if (problem.difficulty === 'Easy') easyCompleted++;
          else if (problem.difficulty === 'Medium') mediumCompleted++;
          else if (problem.difficulty === 'Hard') hardCompleted++;
        }
      });
    });
  });
  
  const progressPercent = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;
  
  res.json({
    total: totalProblems,
    completed: completedProblems,
    progress: progressPercent,
    difficulty: {
      easy: { completed: easyCompleted, total: easyTotal },
      medium: { completed: mediumCompleted, total: mediumTotal },
      hard: { completed: hardCompleted, total: hardTotal }
    }
  });
});

export default router;

