import './App.css';
import products from './products'
import ProductList from './components/productList';
import { useState } from 'react';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

console.log("API Key:", apiKey);
function App() {
  const [input, setInput] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [errorMessage, setErrorMessage] = useState('');

  //const [loading, setLoading] = useState(false);

  const handleInputSubmit = (e) => setInput(e.target.value)

const fetchRecommendations = async () => {
  const data = products
    .map(p => `${p.name} - $${p.price} - ${p.category}`)
    .join('\n');

  const prompt = `Here is a list of products:\n${data}\n\nUser preference: "${input}".\nRecommend the best matching products. Return only product names as a comma-separated list.`;
  try {
    const res = await fetch('http://localhost:3000/api/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),  // ✅ send only the prompt
    });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Rate limit exceeded. Please wait and try again.');
      }
      const error = await res.json();
      throw new Error(error.error || 'Unknown error');
    }

    const data = await res.json();
    console.log('AI response:', data.result);

    // Parse result to match products
    const aiText = data.result;
    const matchedProducts = products.filter(product =>
      aiText.toLowerCase().includes(product.name.toLowerCase())
    );

    setRecommendations(matchedProducts);
  } catch (err) {
    if (err.message.includes('Rate limit exceeded')) {
      setRecommendations(products.slice(0, 5));  // Show top 5 products or any preset list
    } else {
      setErrorMessage(err.message);
      setRecommendations([]);
    }
  } 
};

  return (
    <div className="App">
      <h1>AI Product Recommender</h1>
      <input
        type="text"
        value={input}
        onChange={handleInputSubmit}
        placeholder="E.g. I want a phone under $500"
      />
      <button onClick={fetchRecommendations}>recommendations</button>
      <h2>Recommended Products:</h2>
      <ProductList products={recommendations} />
      {errorMessage && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {errorMessage}</p>}
    </div>
  );
}

export default App;