import client from "./axios.js";

const normalizeStatus = (status) => {
  const map = {
    pending: "Order Placed",
    confirmed: "Confirmed",
    processing: "Harvest Ready",
    packed: "Harvest Ready",
    shipped: "In Transit",
    out_for_delivery: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
    returned: "Cancelled",
    failed: "Cancelled",
  };

  return map[status] || status || "Order Placed";
};

const normalizeOrder = (order = {}) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const qty = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const cropNames = items.map((item) => item.product?.name || item.product?.cropName || "Produce");
  const farmerName = items
    .map((item) => item.product?.farmer?.farmName || item.product?.farmer?.user?.name || item.product?.farmer?.name)
    .find(Boolean) || "KRISHIQ Farmer";

  return {
    id: order.id || order._id,
    _id: order._id || order.id,
    crop: cropNames.join(", ") || "Produce",
    buyer: order.buyer?.name || "Buyer",
    farmer: farmerName,
    qty,
    value: Number(order.totalAmount ?? (items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0) || 0)),
    status: normalizeStatus(order.orderStatus),
    location: order.shippingAddress || "KRISHIQ Hub",
    placedOn: order.createdAt ? new Date(order.createdAt).toISOString().slice(0, 10) : "",
    eta: order.eta || "TBD",
    driver: "Pending assignment",
    vehicle: "TBD",
    currentLocation: order.shippingAddress || "Assigned hub",
    distance: "Calculating",
    ...order,
  };
};

const mapFrontendStatusToBackend = (status) => {
  const map = {
    "Order Placed": "pending",
    Confirmed: "confirmed",
    "Harvest Ready": "packed",
    "Pickup Scheduled": "shipped",
    "In Transit": "out_for_delivery",
    Delivered: "delivered",
    Cancelled: "cancelled",
  };

  return map[status] || status || "pending";
};

export const orderApi = {
  async list(role) {
    const { data } = await client.get("/orders");
    const list = (data?.data || []).map(normalizeOrder);

    if (role === "buyer") {
      return list.filter((order) => !["Cancelled", "Cancelled"].includes(order.status));
    }

    if (role === "farmer") {
      return list;
    }

    return list;
  },

  async get(id) {
    const { data } = await client.get(`/orders/${id}`);
    return normalizeOrder(data?.data || data);
  },

  async create(payload) {
    const shippingAddress = payload.shippingAddress || `${payload.address?.line || ""}, ${payload.address?.city || ""} ${payload.address?.postalCode || ""}`.trim();
    const items = (payload.items || []).map((item) => ({
      productId: item.productId || item.id || item._id,
      quantity: Number(item.quantity || 1),
    }));

    const { data } = await client.post("/orders", {
      items,
      shippingAddress,
      deliveryFee: Number(payload.deliveryFee || 0),
    });

    return normalizeOrder(data?.data || data);
  },

  async updateStatus(id, status) {
    const { data } = await client.patch(`/orders/${id}/status`, {
      status: mapFrontendStatusToBackend(status),
    });

    return normalizeOrder(data?.data || data);
  },

  async cancel(id) {
    const { data } = await client.post(`/orders/${id}/cancel`);
    return normalizeOrder(data?.data || data);
  },
};

export default orderApi;
