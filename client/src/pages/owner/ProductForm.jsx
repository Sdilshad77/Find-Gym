import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const CATEGORIES = [
  "Protein",
  "Creatine",
  "Mass Gainer",
  "Pre Workout",
  "BCAA",
  "Accessories",
  "Others",
];

const INITIAL = {
  productName: "",
  description: "",
  category: "Protein",
  brand: "",
  price: "",
  discountPrice: "",
  stock: "",
  gym: "",
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(INITIAL);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [myGyms, setMyGyms] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get("/gyms?limit=100")
      .then((res) => setMyGyms(res.data.gyms || []))
      .catch(() => {});

    if (isEdit) {
      api
        .get(`/products/${id}`)
        .then((res) => {
          const p = res.data.product;
          setForm({
            productName: p.productName,
            description: p.description,
            category: p.category,
            brand: p.brand,
            price: p.price,
            discountPrice: p.discountPrice,
            stock: p.stock,
            gym: p.gym?._id || "",
          });
          setExistingImages(p.images || []);
        })
        .catch(() => toast.error("Failed to load product"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const buildFormData = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "" && v !== undefined) fd.append(k, v);
    });
    images.forEach((file) => fd.append("images", file));
    return fd;
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isEdit) {
        const { data } = await api.put(`/products/${id}`, buildFormData());
        toast.success(data.message);
      } else {
        const { data } = await api.post("/products", buildFormData());
        toast.success(data.message);
      }
      navigate("/owner/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-24 text-slate-400">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">{isEdit ? "Edit Product" : "Add New Product"}</h1>
      <form onSubmit={submit} className="card space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Product Name *</label>
            <input
              className="input"
              required
              value={form.productName}
              onChange={set("productName")}
            />
          </div>
          <div>
            <label className="label">Brand *</label>
            <input className="input" required value={form.brand} onChange={set("brand")} />
          </div>
        </div>
        <div>
          <label className="label">Description *</label>
          <textarea className="input" rows="4" required value={form.description} onChange={set("description")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category *</label>
            <select className="input" value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Selling Gym *</label>
            <select className="input" required value={form.gym} onChange={set("gym")}>
              <option value="">Select gym</option>
              {myGyms.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.gymName} ({g.city})
                </option>
              ))}
            </select>
            {myGyms.length === 0 && (
              <p className="mt-1 text-xs text-amber-400">
                No gyms yet — create a gym first.
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">MRP (₹) *</label>
            <input className="input" type="number" required value={form.price} onChange={set("price")} />
          </div>
          <div>
            <label className="label">Selling Price (₹)</label>
            <input className="input" type="number" value={form.discountPrice} onChange={set("discountPrice")} />
          </div>
          <div>
            <label className="label">Stock *</label>
            <input className="input" type="number" required value={form.stock} onChange={set("stock")} />
          </div>
        </div>
        <div>
          <label className="label">Images (up to 5, jpg/png/webp, max 5MB each)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="input !cursor-pointer"
            onChange={(e) => setImages([...e.target.files])}
          />
          {existingImages.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs text-slate-500">Current images ({existingImages.length})</p>
              <div className="flex gap-2">
                {existingImages.map((im, i) => (
                  <img key={i} src={im} alt="" className="h-14 w-20 rounded-lg object-cover" />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1" disabled={busy}>
            {busy ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button type="button" className="btn-outline" onClick={() => navigate("/owner/products")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}