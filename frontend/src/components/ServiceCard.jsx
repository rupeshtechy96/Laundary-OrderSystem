function ServiceCard({ title, price, description }) {
  return (
    <div className="service-card">
      <h3>{title}</h3>
      <p className="service-price">Starting at ₹{price}</p>
      <p className="service-description">{description}</p>
    </div>
  );
}

export default ServiceCard;