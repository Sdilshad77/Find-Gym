import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const INITIAL = {
  gymName: "",
  description: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  membershipPrice: "",
  openingTime: "06:00 AM",
  closingTime: "10:00 PM",
  facilities: "",
  latitude: "",
  longitude: "",
};

export default function GymForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(INITIAL);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api
        .get(`/gyms/${id}`)
        .then((res) => {
          const g = res.data.gym;
          setForm({
            gymName: g.gymName,
            description: g.description,
            address: g.address,
            city: g.city,
            state: g.state,
            pincode: g.pincode,
            phone: g.phone,
            email: g.email || "",
            membershipPrice: g.membershipPrice,
            openingTime: g.openingTime,
            closingTime: g.closingTime,
            facilities: (g.facilities || []).join(", "),
            latitude: g.location?.latitude || "",
            longitude: g.location?.longitude || "",
          });
          setExistingImages(g.images || []);
        })
        .catch(() => toast.error("Failed to load gym"))
        .finally(() => setLoading(false));
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
        const { data } = await api.put(`/gyms/${id}`, buildFormData());
        toast.success(data.message);
      } else {
        const { data } = await api.post("/gyms", buildFormData());
        toast.success(data.message);
      }
      navigate("/owner/gyms");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save gym");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-24 text-slate-400">Loading...</div>;
  }

  const inputCls = "input";
  const field = (label, key, opts = {}) => (
    <div className={opts.full ? "sm:col-span-2" : ""}>
      <label className="label">{label}</label>
      <input
        className={inputCls}
        value={form[key]}
        onChange={set(key)}
        {...opts.props}
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">{isEdit ? "Edit Gym" : "Add New Gym"}</h1>
      <form onSubmit={submit} className="card space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Gym Name *", "gymName", { props: { required: true } })}
          {field("Phone *", "phone", { props: { required: true } })}
        </div>
        <div>
          <label className="label">Description *</label>
          <textarea
            className="input"
            rows="4"
            required
            value={form.description}
            onChange={set("description")}
          />
        </div>
        <div>
          <label className="label">Address *</label>
          <input className="input" required value={form.address} onChange={set("address")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {field("City *", "city", { props: { required: true } })}
          {field("State *", "state", { props: { required: true } })}
          {field("Pincode *", "pincode", { props: { required: true } })}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Email", "email", { props: { type: "email" } })}
          {field("Membership Price (₹/mo) *", "membershipPrice", {
            props: { type: "number", required: true },
          })}
          {field("Opening Time", "openingTime")}
          {field("Closing Time", "closingTime")}
        </div>
        <div>
          <label className="label">Facilities (comma separated)</label>
          <input
            className="input"
            placeholder="Cardio, Weights, Yoga, Sauna..."
            value={form.facilities}
            onChange={set("facilities")}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Latitude", "latitude", { props: { type: "number", step: "any" } })}
          {field("Longitude", "longitude", { props: { type: "number", step: "any" } })}
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
          {existingImages.length > 0 && !isEdit && null}
          {existingImages.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs text-slate-500">Current images ({existingImages.length})</p>
              <div className="flex gap-2">
                {existingImages.map((im, i) => (
                  <img key={i} src={im} alt="" className="h-14 w-20 rounded-lg object-cover" />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Uploading new images replaces old ones.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1" disabled={busy}>
            {busy ? "Saving..." : isEdit ? "Update Gym" : "Create Gym"}
          </button>
          <button type="button" className="btn-outline" onClick={() => navigate("/owner/gyms")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}