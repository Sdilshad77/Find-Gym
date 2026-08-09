import api from "../api/axios.js";

let razorpayScriptPromise = null;

export function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
}

function normalizeSignature(sig) {
  if (!sig) return sig;
  return sig.includes("/") && sig.includes("+") ? sig : sig;
}

export async function payWithRazorpay({ amount, receipt, orderId, paymentMethod }) {
  const orderRes = await api.post("/payments/razorpay/order", {
    amount,
    receipt,
  });

  const { keyId, orderId: rpOrderId, demo } = orderRes.data;

  if (demo) {
    const simulated = window.confirm(
      "Razorpay keys configured nahi hain. Simulate payment? (Demo mode)"
    );
    if (!simulated) throw new Error("Payment cancelled");
    const verifyRes = await api.post("/payments/razorpay/verify", {
      orderId,
      paymentMethod,
      razorpay_order_id: rpOrderId,
      razorpay_payment_id: "pay_demo_" + Date.now(),
      razorpay_signature: "demo_signature",
    });
    return verifyRes.data;
  }

  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const options = {
      key: keyId,
      amount: Math.round(amount * 100),
      currency: "INR",
      name: "GymHub",
      description: receipt || "GymHub Payment",
      order_id: rpOrderId,
      handler: async (response) => {
        try {
          const verifyRes = await api.post("/payments/razorpay/verify", {
            orderId,
            paymentMethod,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: normalizeSignature(response.razorpay_signature),
          });
          resolve(verifyRes.data);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
      theme: { color: "#a3e635" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}