import { useState } from 'react';
import './index.css';

function App() {
  const [income, setIncome] = useState('30000');
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState({ timeStr: '', comment: '', priceStr: '' });

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeNum = parseFloat(income.replace(/,/g, ''));
    const priceNum = parseFloat(price.replace(/,/g, ''));
    
    if (isNaN(incomeNum) || isNaN(priceNum) || incomeNum <= 0) return;

    // 22 working days, 8 hours a day
    const hourlyIncome = incomeNum / (22 * 8);
    const totalHours = priceNum / hourlyIncome;

    const formatTime = (hours: number) => {
      if (hours < 1) {
        const mins = Math.round(hours * 60);
        return `${mins} minute${mins !== 1 ? 's' : ''}`;
      }
      if (hours <= 24) {
        const hrs = Math.floor(hours);
        const mins = Math.round((hours - hrs) * 60);
        if (mins === 0) return `${hrs} hour${hrs !== 1 ? 's' : ''}`;
        return `${hrs} hour${hrs !== 1 ? 's' : ''}, ${mins} minute${mins !== 1 ? 's' : ''}`;
      }
      if (hours <= 168) {
        const days = Math.floor(hours / 24);
        const hrs = Math.floor(hours % 24);
        if (hrs === 0) return `${days} day${days !== 1 ? 's' : ''}`;
        return `${days} day${days !== 1 ? 's' : ''}, ${hrs} hour${hrs !== 1 ? 's' : ''}`;
      }
      if (hours <= 720) {
        const weeks = Math.floor(hours / 168);
        const days = Math.floor((hours % 168) / 24);
        if (days === 0) return `${weeks} week${weeks !== 1 ? 's' : ''}`;
        return `${weeks} week${weeks !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`;
      }
      const months = Math.floor(hours / 720);
      const days = Math.floor((hours % 720) / 24);
      if (days === 0) return `${months} month${months !== 1 ? 's' : ''}`;
      return `${months} month${months !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`;
    };

    const getCommentary = (hours: number, itemName: string) => {
      const name = itemName || 'this';
      const workingDays = (hours / 8).toFixed(1).replace(/\.0$/, '');
      
      if (hours < 1) {
        return `Honestly, you've spent longer scrolling TikTok.`;
      } else if (hours <= 8) {
        return `You just spent roughly <strong>1 working day</strong> on ${name}.`;
      } else if (hours <= 24) {
        return `You spent roughly <strong>${workingDays} working days</strong> on ${name}.`;
      } else if (hours <= 40) {
        return `You have effectively donated an entire working week to ${name}.`;
      } else if (hours <= 168) { // 1 week
        return `You just traded away <strong>${workingDays} working days</strong> of your limited time on earth.`;
      } else if (hours <= 2880) { // 4 months
        return `Congratulations. You have exchanged a season of your life for ${name}.`;
      } else {
        return `I hope ${name} was worth sacrificing a portion of your mortal existence.`;
      }
    };

    setResult({
      timeStr: formatTime(totalHours),
      comment: getCommentary(totalHours, item),
      priceStr: priceNum.toLocaleString('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 })
    });
    setCalculated(true);
  };

  const reset = () => {
    setCalculated(false);
    setItem('');
    setPrice('');
  };

  return (
    <div className="app-container">
      {!calculated ? (
        <form onSubmit={calculate} className="animate-fade-in">
          <h1>How Much Is This?</h1>
          <p className="subtitle">Convert price tags into time of your life.</p>
          
          <div className="form-group">
            <label>Monthly Income</label>
            <div className="input-wrapper">
              <span className="currency-symbol">₱</span>
              <input 
                type="number" 
                className="has-symbol"
                value={income}
                onChange={e => setIncome(e.target.value)}
                placeholder="30000"
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>What are you buying?</label>
            <input 
              type="text" 
              value={item}
              onChange={e => setItem(e.target.value)}
              placeholder="e.g. New headphones"
              required
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <div className="input-wrapper">
              <span className="currency-symbol">₱</span>
              <input 
                type="number" 
                className="has-symbol"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="3000"
                required
                min="1"
              />
            </div>
          </div>

          <button type="submit">Calculate Time Cost</button>
        </form>
      ) : (
        <div className="result-container animate-fade-in">
          <div className="result-price">{result.priceStr}</div>
          <div className="result-subtitle">That's like working for</div>
          <div className="result-time" style={{ marginBottom: '0.5rem' }}>{result.timeStr}</div>
          <div className="result-subtitle" style={{ marginBottom: '2rem' }}>straight.</div>
          <div className="result-comment" dangerouslySetInnerHTML={{ __html: result.comment }}></div>
          <button onClick={reset}>Calculate another item</button>
          <button className="secondary" onClick={() => setCalculated(false)}>Edit current item</button>
        </div>
      )}
    </div>
  );
}

export default App;
