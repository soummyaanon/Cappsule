import React, { useState, useEffect } from 'react';
import '../components/Results.css';

const Results = ({ results }) => {
  const [selectedOptions, setSelectedOptions] = useState(
    results.map(result => {
      const form = result.salt_forms_json ? Object.keys(result.salt_forms_json)[0] || '' : '';
      const strength = form && result.salt_forms_json[form] ? Object.keys(result.salt_forms_json[form])[0] || '' : '';
      const packing = strength && result.salt_forms_json[form][strength] ? Object.keys(result.salt_forms_json[form][strength])[0] || '' : '';
      return { form, strength, packing };
    })
  );

  const [showMore, setShowMore] = useState({
    form: false,
    strength: false,
    packing: false,
  });

  useEffect(() => {
    const selectedOption = selectedOptions.find(option => option.form && option.strength && option.packing);
    if (selectedOption) {
      const matchingResult = results.find(result => {
        if (result.salt_forms_json && result.salt_forms_json[selectedOption.form] && result.salt_forms_json[selectedOption.form][selectedOption.strength] && result.salt_forms_json[selectedOption.form][selectedOption.strength][selectedOption.packing]) {
          return true;
        } else {
          return false;
        }
      });
    }
  }, [selectedOptions, results]);

  const getPrice = (result, form, strength, packing) => {
    let price = null;
    let available = false;

    if (
      result.salt_forms_json &&
      result.salt_forms_json[form] &&
      result.salt_forms_json[form][strength] &&
      result.salt_forms_json[form][strength][packing]
    ) {
      available = true;
      const productPrices = result.salt_forms_json[form][strength][packing];
      if (productPrices) {
        for (const product of Object.values(productPrices)) {
          if (product) {
            for (const priceObj of product) {
              if (priceObj !== null) {
                price = priceObj.selling_price;
                break;
              }
            }
          }
          if (price !== null) {
            break;
          }
        }
      }
    }

    return { price, available };
  };

  const handleOptionClick = (index, option, value) => {
    setSelectedOptions(prev => {
      const newOptions = [...prev];
      newOptions[index][option] = value;
      return newOptions;
    });
  };

  const handleShowMoreClick = (option) => {
    setShowMore(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const getButtonClass = (available, selected) => {
    if (available) {
      return selected ? 'button-available-selected' : 'button-available-not-selected';
    } else {
      return selected ? 'button-not-available-selected' : 'button-not-available-not-selected';
    }
  };

  return (
    <div className="results">
      {results.map((result, index) => {
        const { form, strength, packing } = selectedOptions[index];
        const { available, price } = getPrice(result, form, strength, packing);

        return (
          <div key={index} className="result" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
            <div className="options" style={{ flex: 1, borderRight: '1px solid #000', paddingRight: '10px' }}>
              {/* Form options */}
              <div>
                <h2>Form</h2>
                {result.salt_forms_json && Object.keys(result.salt_forms_json).slice(0, showMore.form ? undefined : 2).map(value => (
                  <button
                    key={value}
                    className={getButtonClass(available, value === form)}
                    onClick={() => handleOptionClick(index, 'form', value)}
                  >
                    {value}
                  </button>
                ))}
                {Object.keys(result.salt_forms_json).length > 2 && (
                  <button onClick={() => handleShowMoreClick('form')}>
                    {showMore.form ? 'Hide' : 'More'}
                  </button>
                )}
              </div>

              {/* Strength options */}
              {form && (
                <div>
                  <h2>Strength</h2>
                  {result.salt_forms_json[form] && Object.keys(result.salt_forms_json[form]).slice(0, showMore.strength ? undefined : 2).map(value => (
                    <button
                      key={value}
                      className={getButtonClass(available, value === strength)}
                      onClick={() => handleOptionClick(index, 'strength', value)}
                    >
                      {value}
                    </button>
                  ))}
                  {Object.keys(result.salt_forms_json[form]).length > 2 && (
                    <button onClick={() => handleShowMoreClick('strength')}>
                      {showMore.strength ? 'Hide' : 'More'}
                    </button>
                  )}
                </div>
              )}

              {/* Packing options */}
{form && strength && result.salt_forms_json[form][strength] && (
  <div>
    <h2>Packing</h2>
    {Object.keys(result.salt_forms_json[form][strength]).slice(0, showMore.packing ? undefined : 2).map(value => (
      <button
        key={value}
        className={getButtonClass(available, value === packing)}
        onClick={() => handleOptionClick(index, 'packing', value)}
      >
        {value}
      </button>
    ))}
    {Object.keys(result.salt_forms_json[form][strength]).length > 2 && (
      <button onClick={() => handleShowMoreClick('packing')}>
        {showMore.packing ? 'Hide' : 'More'}
      </button>
    )}
  </div>
)}
            </div>

            <div className="options" style={{ flex: 1, paddingLeft: '10px' }}>
              <h2>Salt Name</h2>
              <p style={{ fontWeight: 'bold' }}>{result.salt}</p>
              <p>Form: {form} || Strength: {strength} || Packing: {packing}</p>

              <h2>Price and Availability</h2>
              {available ? (price !== null && <h1><strong>From: ₹{price}</strong></h1>) : <p>No stores selling this product near you</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Results;