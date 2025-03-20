// ... (previous imports and setup)

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Routes
// ... (keep existing auth routes)

// Loan Applications
app.get('/api/loan-applications', authenticateToken, async (req, res) => {
  try {
    const [applications] = await pool.query('SELECT * FROM loan_applications ORDER BY created_at DESC');
    res.json(applications);
  } catch (error) {
    console.error('Error fetching loan applications:', error);
    res.status(500).json({ message: 'Server error fetching loan applications' });
  }
});

app.post('/api/loan-applications', authenticateToken, upload.fields([
  { name: 'employment_proof', maxCount: 1 },
  { name: 'sponsor1_doc', maxCount: 1 },
  { name: 'sponsor2_doc', maxCount: 1 },
  { name: 'terms_doc', maxCount: 1 }
]), async (req, res) => {
  // ... (implement loan application creation logic)
});

app.put('/api/loan-applications/:id/status', authenticateToken, async (req, res) => {
  // ... (implement status update logic)
});

// Cash Flow
app.get('/api/cash-flow', authenticateToken, async (req, res) => {
  try {
    const [transactions] = await pool.query('SELECT * FROM cash_flow ORDER BY date DESC');
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching cash flow data:', error);
    res.status(500).json({ message: 'Server error fetching cash flow data' });
  }
});

app.post('/api/cash-flow', authenticateToken, async (req, res) => {
  // ... (implement cash flow entry creation logic)
});

// Repayments
app.get('/api/repayments', authenticateToken, async (req, res) => {
  try {
    const [repayments] = await pool.query(
      `SELECT r.*, a.applicant_name, a.nida_id, a.loan_amount as total_loan,
       (SELECT SUM(amount) FROM loan_repayments WHERE loan_application_id = r.loan_application_id AND paid = 1) as amount_paid
       FROM loan_repayments r
       JOIN loan_applications a ON r.loan_application_id = a.id
       ORDER BY r.due_date ASC`
    );
    res.json(repayments);
  } catch (error) {
    console.error('Error fetching repayments:', error);
    res.status(500).json({ message: 'Server error fetching repayments' });
  }
});

app.post('/api/repayments/:id/pay', authenticateToken, async (req, res) => {
  // ... (implement repayment marking as paid logic)
});

// Reports
app.get('/api/reports/cash-flow', authenticateToken, async (req, res) => {
  // ... (implement cash flow report logic)
});

app.get('/api/reports/loan-applications', authenticateToken, async (req, res) => {
  // ... (implement loan applications report logic)
});

// ... (keep existing server start logic)