import React from 'react'

const productList = ({products}) => {
    if(!products.lenght) 
        return <p>NO recommendations found</p>
  return (
    <ul>
        { products.map((products)=> (
            <li key={products.id}>
                <strong>{products.name}</strong> - ${products.price} ({products.category})
            </li>
        ))}
    </ul>
  )
}

export default productList