import { useMemo } from "react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const content = useMemo(() => {
    if (user?.role === "admin") {
      return {
        title: "Admin Dashboard",
        subtitle:
          "Manage laundry operations, monitor customer orders, review billing flow, and keep service quality high.",
        cards: [
          {
            title: "Order Management",
            text: "Review all orders, track their status, and update them from pending to delivered.",
          },
          {
            title: "Pricing Control",
            text: "Maintain garment rates and ensure customers always see updated service prices.",
          },
          {
            title: "Schedule Management",
            text: "Update open and close timings, holidays, and service availability for customers.",
          },
        ],
      };
    }

    return {
      title: "Customer Dashboard",
      subtitle:
        "Place your laundry order, check latest service prices, view operating schedule, and enjoy a smooth service experience.",
      cards: [
        {
          title: "Place Orders",
          text: "Choose garment type, quantity, delivery method, and schedule your laundry request quickly.",
        },
        {
          title: "Track Status",
          text: "See whether your order is pending, approved, processing, ready, or delivered.",
        },
        {
          title: "Transparent Billing",
          text: "Know item rates, pickup charges, and any available first-order discount clearly.",
        },
      ],
    };
  }, [user]);

  return (
    <div className="page-wrapper">
      <section className="dashboard-hero">
        <div>
          <p className="section-tag">Dashboard Overview</p>
          <h1>{content.title}</h1>
          <p>{content.subtitle}</p>
        </div>

        <div className="discount-box">
          <h3>Special Offer</h3>
          <p>New customers may receive a first order discount on eligible orders.</p>
        </div>
      </section>

      <section className="dashboard-grid">
        {content.cards.map((card, index) => (
          <div className="info-card" key={index}>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </div>
        ))}
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2>About Our Laundry Service</h2>
          <p>
            We focus on convenience, cleanliness, and reliability. Customers can
            choose self drop service or pickup assistance, while staff can manage
            the full order lifecycle efficiently.
          </p>
        </div>

        <div className="benefit-grid">
          <div className="benefit-card">
            <h4>Fast Processing</h4>
            <p>Efficient service flow helps reduce turnaround time for regular orders.</p>
          </div>
          <div className="benefit-card">
            <h4>Flexible Delivery</h4>
            <p>Choose self-drop or pickup support based on your convenience and need.</p>
          </div>
          <div className="benefit-card">
            <h4>Clear Pricing</h4>
            <p>No hidden confusion. Rates are visible and extra service charges are easy to understand.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;