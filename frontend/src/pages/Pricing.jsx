import { useEffect, useState } from "react";
import API from "../services/api";
import ServiceCard from "../components/ServiceCard";

function Pricing() {
  const [prices, setPrices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await API.get("/pricing");
        setPrices(res.data || []);
      } catch (err) {
        setError("Unable to load pricing right now.");
      }
    };

    fetchPricing();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <p className="section-tag">Price List</p>
        <h1>Laundry Pricing</h1>
        <p>
          Explore our current garment rates. Final billing depends on selected
          garment type, quantity, delivery option, and discount eligibility.
        </p>
      </div>

      <div className="highlight-strip">
        <div className="highlight-item">
          <strong>Self Drop:</strong> No extra service charge
        </div>
        <div className="highlight-item">
          <strong>Pickup Service:</strong> Extra charge may apply
        </div>
        <div className="highlight-item">
          <strong>New Users:</strong> First order discount available
        </div>
      </div>

      {error && <p className="error-message page-error">{error}</p>}

      <div className="services-grid">
        {prices.length > 0 ? (
          prices.map((item) => (
            <ServiceCard
              key={item._id}
              title={item.garmentType}
              price={item.price}
              description={
                item.description ||
                "Professional wash and care service with transparent billing."
              }
            />
          ))
        ) : (
          !error && (
            <>
              <ServiceCard
                title="Shirt"
                price="40"
                description="Standard wash and press for daily wear shirts."
              />
              <ServiceCard
                title="Pants"
                price="50"
                description="Careful cleaning and finishing for trousers and pants."
              />
              <ServiceCard
                title="Saree"
                price="120"
                description="Gentle handling for delicate fabric and traditional wear."
              />
              <ServiceCard
                title="Jacket"
                price="150"
                description="Deep cleaning service for jackets and heavy garments."
              />
            </>
          )
        )}
      </div>
    </div>
  );
}

export default Pricing;