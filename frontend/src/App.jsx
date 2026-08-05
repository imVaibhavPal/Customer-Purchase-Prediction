import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    Age: 30,
    AnnualIncome: 60000,
    NumberOfPurchases: 10,
    TimeSpentOnWebsite: 15.0,
    CustomerTenureYears: 2.5,
    LastPurchaseDaysAgo: 10,
    Gender: 'Female',
    ProductCategory: 'Electronics',
    PreferredDevice: 'Desktop',
    Region: 'North',
    ReferralSource: 'Organic',
    CustomerSegment: 'VIP',
    LoyaltyProgram: 1,
    DiscountsAvailed: 2,
    SessionCount: 5,
    CustomerSatisfaction: 4
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Parse numeric fields properly
    let parsedValue = value;
    if (type === 'number') {
      if (value === "") {
        parsedValue = "";
      } else {
        parsedValue = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
      }
    } else if (name === 'LoyaltyProgram') {
      parsedValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://customer-purchase-prediction-otnn.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        if (response.status === 422) {
          const errData = await response.json();
          const msg = errData.detail.map(d => `${d.loc[d.loc.length-1]}: ${d.msg}`).join(' | ');
          throw new Error(`Validation Error: ${msg}`);
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || 'Prediction failed. Ensure backend is running.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Predict Customer Purchase</h1>
        <p>AI-Based Customer Purchase Prediction System</p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="Age" value={formData.Age} onChange={handleChange} required min="18" max="120" />
            </div>
            <div className="form-group">
              <label>Annual Income ($)</label>
              <input type="number" step="0.01" name="AnnualIncome" value={formData.AnnualIncome} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Number Of Purchases</label>
              <input type="number" name="NumberOfPurchases" value={formData.NumberOfPurchases} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Time Spent On Website (mins)</label>
              <input type="number" step="0.1" name="TimeSpentOnWebsite" value={formData.TimeSpentOnWebsite} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Customer Tenure (Years)</label>
              <input type="number" step="0.1" name="CustomerTenureYears" value={formData.CustomerTenureYears} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Last Purchase (Days Ago)</label>
              <input type="number" name="LastPurchaseDaysAgo" value={formData.LastPurchaseDaysAgo} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="Gender" value={formData.Gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Product Category</label>
              <select name="ProductCategory" value={formData.ProductCategory} onChange={handleChange}>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Groceries">Groceries</option>
                <option value="Sports">Sports</option>
                <option value="Health">Health & Beauty</option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Device</label>
              <select name="PreferredDevice" value={formData.PreferredDevice} onChange={handleChange}>
                <option value="Desktop">Desktop</option>
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
              </select>
            </div>
            <div className="form-group">
              <label>Region</label>
              <select name="Region" value={formData.Region} onChange={handleChange}>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>
            <div className="form-group">
              <label>Referral Source</label>
              <select name="ReferralSource" value={formData.ReferralSource} onChange={handleChange}>
                <option value="Organic">Organic Search</option>
                <option value="Paid Ads">Paid Ads</option>
                <option value="Social Media">Social Media</option>
                <option value="Email">Email Marketing</option>
                <option value="Direct">Direct</option>
              </select>
            </div>
            <div className="form-group">
              <label>Customer Segment</label>
              <select name="CustomerSegment" value={formData.CustomerSegment} onChange={handleChange}>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Premium">Premium</option>
                <option value="New">New</option>
              </select>
            </div>
            <div className="form-group">
              <label>Loyalty Program</label>
              <select name="LoyaltyProgram" value={formData.LoyaltyProgram} onChange={handleChange}>
                <option value={0}>No (0)</option>
                <option value={1}>Yes (1)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Discounts Availed</label>
              <input type="number" name="DiscountsAvailed" value={formData.DiscountsAvailed} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Session Count</label>
              <input type="number" name="SessionCount" value={formData.SessionCount} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Customer Satisfaction (1-5)</label>
              <input type="number" name="CustomerSatisfaction" value={formData.CustomerSatisfaction} onChange={handleChange} required min="1" max="5" />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Predict Purchase'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className="result-panel">
            <div className={`prediction-badge ${result.Prediction === 1 ? 'success' : 'danger'}`}>
              {result.Prediction === 1 ? 'Will Purchase 🎉' : 'No Purchase 😞'}
            </div>
            <div className="metrics">
              <div className="metric">
                <div className="metric-label">Probability</div>
                <div className="metric-value">{(result.Probability).toFixed(2)}</div>
              </div>
              <div className="metric">
                <div className="metric-label">Confidence</div>
                <div className="metric-value">{result.Confidence}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
