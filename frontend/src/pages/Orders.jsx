import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [form, setForm] = useState({
    deliveryType: "SELF",
    scheduledDate: "",
  });

  const [items, setItems] = useState([
    { garmentType: "", quantity: 1 },
  ]);

  const [loading, setLoading] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      setError("Failed to load orders");
    }
  };

  const loadPricing = async () => {
    try {
      setPricingLoading(true);
      const res = await API.get("/pricing");
      setPricing(res.data || []);
    } catch (err) {
      setError("Failed to load pricing");
    } finally {
      setPricingLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadPricing();
  }, []);

  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "quantity" ? Number(value) : value;
    setItems(updatedItems);
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { garmentType: "", quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const validItems = items.filter(
        (item) => item.garmentType && Number(item.quantity) > 0
      );

      if (validItems.length === 0) {
        setError("Please add at least one valid garment item");
        setLoading(false);
        return;
      }

      await API.post("/orders", {
        items: validItems,
        deliveryType: form.deliveryType,
        scheduledDate: form.scheduledDate,
      });

      setMessage("Bulk order placed successfully.");
      setForm({
        deliveryType: "SELF",
        scheduledDate: "",
      });
      setItems([{ garmentType: "", quantity: 1 }]);

      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setError("");
      await API.patch(`/orders/${id}`, { status });
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <p className="section-tag">Order Management</p>
        <h1>{user?.role === "admin" ? "Manage Orders" : "Place and Track Orders"}</h1>
        <p>
          {user?.role === "admin"
            ? "Review customer orders, update their current progress, and manage service flow."
            : "Add multiple garment items in one order, select delivery option, and choose your preferred schedule."}
        </p>
      </div>

      {user?.role === "customer" && (
        <div className="order-layout">
          <div className="order-form-card">
            <h2>Place Bulk Order</h2>
            <p className="sub-info">
              Add multiple garment items in one order. Self drop has no extra charge. Pickup service may include an extra fee.
            </p>

            <form onSubmit={submitOrder} className="order-form">
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr auto",
                    gap: "10px",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <select
                    value={item.garmentType}
                    onChange={(e) =>
                      handleItemChange(index, "garmentType", e.target.value)
                    }
                    required
                    disabled={pricingLoading}
                  >
                    <option value="">
                      {pricingLoading ? "Loading garments..." : "Select Garment Type"}
                    </option>
                    {pricing.map((p) => (
                      <option key={p._id} value={p.garmentType}>
                        {p.garmentType} - ₹{p.price}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="logout-btn"
                    onClick={() => removeItemRow(index)}
                    disabled={items.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button type="button" className="primary-btn" onClick={addItemRow}>
                + Add Another Item
              </button>

              <select
                name="deliveryType"
                value={form.deliveryType}
                onChange={handleFormChange}
              >
                <option value="SELF">Self Drop / Self Pickup</option>
                <option value="PICKUP">Pickup and Drop Service</option>
              </select>

              <input
                type="date"
                name="scheduledDate"
                value={form.scheduledDate}
                onChange={handleFormChange}
                required
              />

              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}

              <button
                type="submit"
                className="primary-btn"
                disabled={loading || pricingLoading || pricing.length === 0}
              >
                {loading ? "Submitting..." : "Place Order"}
              </button>
            </form>
          </div>

          <div className="order-side-info">
            <div className="mini-info-card">
              <h3>Bulk Ordering</h3>
              <p>
                You can now add multiple garment types in a single order instead of placing separate orders one by one.
              </p>
            </div>

            <div className="mini-info-card">
              <h3>Delivery Options</h3>
              <p>
                Choose self-drop if you want to deliver and collect clothes yourself. Select pickup service for extra convenience.
              </p>
            </div>

            <div className="mini-info-card">
              <h3>Discount Benefit</h3>
              <p>
                New customers may get a first-order discount depending on current offers.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="table-section">
        <h2>{user?.role === "admin" ? "All Customer Orders" : "My Orders"}</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Items</th>
                <th>Delivery</th>
                <th>Scheduled Date</th>
                <th>Total Bill</th>
                <th>Final Amount</th>
                <th>Status</th>
                {user?.role === "admin" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      {order.items?.map((item, idx) => (
                        <div key={idx}>
                          {item.garmentType} × {item.quantity} = ₹{item.itemTotal}
                        </div>
                      ))}
                    </td>
                    <td>{order.deliveryType}</td>
                    <td>{order.scheduledDate}</td>
                    <td>₹{order.totalBill}</td>
                    <td>₹{order.finalAmount}</td>
                    <td>
                      <span className={`status-pill status-${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    {user?.role === "admin" && (
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="READY">READY</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={user?.role === "admin" ? 7 : 6}>No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;