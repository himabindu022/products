import './App.css';
import products from './products'
import ProductList from './components/productList';
import { useState } from 'react';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

console.log("API Key:", apiKey);
function App() {
  const [input, setInput] = useState('')
  const [recommendations, setRecommendations] = useState([])
  //const [loading, setLoading] = useState(false);

  const handleInputSubmit = (e) => setInput(e.target.value)

  const fetchRecommendations = async() => {
     
      const data = products
        .map(p => `${p.name}- $${p.price}-${p.category}`)
        .join('')
    
      const prompt = `Here is a list of products:\n${data}\n\nUser preference: "${input}".\nRecommend the best matching products. Return only product names.`;

      try {
        console.log('OpenAI API Key:', process.env.REACT_APP_OPENAI_API_KEY);

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful AI that recommends products based on user preferences." },
              { role: "user", content: prompt }
            ],
            temperature: 0.7
          })
        })

        const response = await res.json();
        console.log(response)

        const aiText = response.choices?.[0]?.message?.content || '';

        const matchedProducts = products.filter(product =>
          aiText.toLowerCase().includes(product.name.toLowerCase())
      );

      setRecommendations(matchedProducts);

    } catch (error) {
        if (error.status === 429) {
          alert("You've hit the API rate limit. Please wait and try again later.");
        } else {
          console.error(error);
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
    </div>
  );
}

export default App;