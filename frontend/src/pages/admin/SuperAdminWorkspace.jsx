import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Send, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import { Button, Card, Input, PageHeader } from "../../components/common/ui.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import adminApi from "../../api/adminApi.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import HeroMediaEditor from "../../components/admin/HeroMediaEditor.jsx";

const defaultContent = {
  brandName: "KRISHIQ", brandLine: "AgriTech", brandSubtitle: "Built to simplify the journey from produce to purchase.", navReviewsLabel: "Reviews",
  heroBadge: "Direct farm-to-market platform", heroHeading: "From Farm to Market. Smarter. Direct. Fair.", heroSubheading: "KRISHIQ connects farmers and buyers directly, making agricultural trade more transparent, accessible and efficient.", heroCtaText: "Get Started", heroCtaLink: "/register", heroSecondaryCtaText: "Explore Marketplace", heroSecondaryCtaLink: "/marketplace", heroMedia: [],
  features: [{ title: "Fresh listings", text: "From farms and FPOs", icon: "sprout", active: true }, { title: "Clear pricing", text: "Compare before ordering", icon: "price", active: true }, { title: "Order visibility", text: "Track each handoff", icon: "package", active: true }, { title: "Secure by design", text: "Payment-ready checkout", icon: "shield", active: true }],
  howSteps: [{ number: "01", title: "Create your account", text: "Join as a farmer, FPO or buyer.", active: true }, { number: "02", title: "List or discover produce", text: "Share supply or find the right listing.", active: true }, { number: "03", title: "Connect and place order", text: "Agree on quantity, price and delivery.", active: true }, { number: "04", title: "Get produce delivered", text: "Follow the order from pickup to arrival.", active: true }],
  marketplaceHeading: "Explore fresh produce directly from the source.", marketplaceText: "Search crops, compare available lots, review seller details and place an order from one straightforward marketplace.",
  farmerHeading: "Sell directly. Reach more buyers.", farmerText: "List produce, manage orders, view market prices and manage deliveries.", farmerBullets: ["List your produce", "Manage orders", "View market prices", "Manage deliveries"], farmerCtaText: "Start Selling", farmerCtaLink: "/register",
  buyerHeading: "Source directly from the farm.", buyerText: "Discover fresh produce, compare listings and track every delivery.", buyerBullets: ["Discover fresh produce", "Compare listings", "Buy required quantities", "Track deliveries"], buyerCtaText: "Explore Produce", buyerCtaLink: "/marketplace",
  insightsHeading: "Useful signals, when live market data is connected.", insightsText: "KRISHIQ helps users understand demand trends, price trends, suitable connections and delivery options.", insights: [{ title: "Demand trends", text: "Market demand signals", icon: "route", active: true }, { title: "Price trends", text: "Compare current prices", icon: "price", active: true }, { title: "Suitable connections", text: "Find relevant partners", icon: "users", active: true }, { title: "Delivery optimization", text: "Plan each handoff", icon: "truck", active: true }],
  deliveryHeading: "Every handoff stays visible.", deliverySteps: [{ number: "01", title: "Order confirmed", active: true }, { number: "02", title: "Pickup scheduled", active: true }, { number: "03", title: "In transit", active: true }, { number: "04", title: "Delivered", active: true }],
  aboutHeading: "Connecting farms with markets.", aboutText: "KRISHIQ is building a more direct and transparent agricultural marketplace where farmers, FPOs and buyers can connect through one digital platform.", ctaHeading: "Make the next market decision simpler.", ctaText: "Join a direct, transparent marketplace for agricultural trade.", developers: [],
};

const sections = [["brand", "Logo & Brand"], ["hero", "Home Hero"], ["features", "Key Features"], ["how", "How It Works"], ["marketplace", "Marketplace"], ["farmer", "Farmers / Sellers"], ["buyer", "Buyers / Consumers"], ["insights", "Smart Insights"], ["delivery", "Order Tracking"], ["about", "About"], ["contact", "Contact"], ["footer", "Footer & Social"], ["policies", "Policies"], ["built", "Built By"]];

export default function SuperAdminWorkspace() {
  const location = useLocation(); const navigate = useNavigate(); const { toast } = useToast();
  const [content, setContent] = useState(defaultContent); const [status, setStatus] = useState({ draft: false }); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const activeId = new URLSearchParams(location.search).get("section") || "brand"; const active = sections.find(([id]) => id === activeId) || sections[0];
  const extractErrorMessage = (err, fallback) => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (typeof err?.response?.data === "string" && err.response.data.trim()) {
      return err.response.data.length < 120 ? err.response.data.trim() : `Server error (${err.response.status})`;
    }
    if (err?.response?.status) {
      return `Request failed with status ${err.response.status} (${err.response.statusText || "Error"})`;
    }
    if (err?.message) return err.message;
    return fallback;
  };

  useEffect(() => {
    adminApi
      .settings()
      .then((rows) => {
        const loaded = Object.fromEntries(rows.map((row) => [row.key, row.value]));
        setContent({ ...defaultContent, ...loaded });
        setStatus({ draft: Boolean(loaded._draft), publishedAt: loaded._publishedAt });
      })
      .catch((err) => {
        console.error("Settings load error:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          endpoint: err.config?.url,
          baseURL: err.config?.baseURL,
          message: err.message,
        });
        setError(extractErrorMessage(err, "Unable to load website content."));
      });
  }, []);

  const setValue = (key, value) => setContent((current) => ({ ...current, [key]: value }));

  const upload = async (file, onSuccess) => {
    if (!file) return;
    setSaving(true);
    setError("");
    try {
      const result = await adminApi.uploadMedia(file);
      onSuccess(result);
      toast("Media uploaded. Save or publish to apply it.");
    } catch (err) {
      console.error("Media upload error:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        endpoint: err.config?.url,
        baseURL: err.config?.baseURL,
        message: err.message,
      });
      setError(extractErrorMessage(err, "Unable to upload media."));
    } finally {
      setSaving(false);
    }
  };

  const save = async (publish) => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...content, _publish: publish, _draft: !publish, _publishedAt: new Date().toISOString() };
      await adminApi.updateSettings(payload);
      setContent(payload);
      setStatus({ draft: !publish, publishedAt: payload._publishedAt });
      toast(publish ? "Website changes published." : "Draft saved.");
    } catch (err) {
      console.error("Save website content error:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        endpoint: err.config?.url,
        baseURL: err.config?.baseURL,
        message: err.message,
      });
      setError(extractErrorMessage(err, "Unable to save website content."));
    } finally {
      setSaving(false);
    }
  };
  if (location.pathname === "/admin/audit-logs") return <AuditLogs />;
  if (location.pathname === "/admin/settings") return <Settings />;
  return <div><PageHeader title="Website Control" subtitle="Edit published KRISHIQ homepage content with a reviewable draft workflow." actions={<div className="flex gap-2"><Button variant="secondary" disabled={saving} onClick={() => save(false)}><Save className="h-4 w-4" /> Save Draft</Button><Button disabled={saving} onClick={() => save(true)}><Send className="h-4 w-4" /> Publish Changes</Button></div>} /><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{sections.map(([id, title]) => <button key={id} type="button" onClick={() => navigate(`/admin/content?section=${id}`)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${id === active[0] ? "border-orange-600 bg-orange-600 text-white" : "border-slate-200 bg-white text-slate-600"}`}>{title}</button>)}</div>{error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}<Card className="max-w-5xl"><div className="mb-5 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">{active[1]}</p><h2 className="mt-1 text-xl font-bold">{active[1]} settings</h2></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.draft ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{status.draft ? "Draft Saved" : "Published"}</span></div><Editor section={active[0]} content={content} setValue={setValue} upload={upload} saving={saving} /></Card></div>;
}

function Editor({ section, content, setValue, upload, saving }) {
  if (section === "brand") return <div className="grid gap-4 sm:grid-cols-2"><TextField label="Brand name" value={content.brandName} onChange={(v) => setValue("brandName", v)} /><TextField label="Brand line" value={content.brandLine} onChange={(v) => setValue("brandLine", v)} /><TextField label="Brand subtitle" value={content.brandSubtitle} onChange={(v) => setValue("brandSubtitle", v)} /><TextField label="Marketplace nav label" value={content.navMarketplaceLabel} onChange={(v) => setValue("navMarketplaceLabel", v)} /><TextField label="How It Works nav label" value={content.navHowLabel} onChange={(v) => setValue("navHowLabel", v)} /><TextField label="Farmers nav label" value={content.navFarmerLabel} onChange={(v) => setValue("navFarmerLabel", v)} /><TextField label="Buyers nav label" value={content.navBuyerLabel} onChange={(v) => setValue("navBuyerLabel", v)} /><TextField label="About nav label" value={content.navAboutLabel} onChange={(v) => setValue("navAboutLabel", v)} /><MediaField label="Logo" value={content.logoUrl} onChange={(v) => setValue("logoUrl", v)} onUpload={(file) => upload(file, (result) => setValue("logoUrl", result.url))} onRemove={() => setValue("logoUrl", "")} disabled={saving} /></div>;
  if (section === "hero") return <div className="grid gap-4 sm:grid-cols-2"><TextField label="Badge" value={content.heroBadge} onChange={(v) => setValue("heroBadge", v)} /><TextField label="Heading" value={content.heroHeading} onChange={(v) => setValue("heroHeading", v)} /><TextArea label="Description" value={content.heroSubheading} onChange={(v) => setValue("heroSubheading", v)} /><TextField label="Primary CTA text" value={content.heroCtaText} onChange={(v) => setValue("heroCtaText", v)} /><TextField label="Primary CTA destination" value={content.heroCtaLink} onChange={(v) => setValue("heroCtaLink", v)} /><TextField label="Secondary CTA text" value={content.heroSecondaryCtaText} onChange={(v) => setValue("heroSecondaryCtaText", v)} /><TextField label="Secondary CTA destination" value={content.heroSecondaryCtaLink} onChange={(v) => setValue("heroSecondaryCtaLink", v)} /><div className="sm:col-span-2"><HeroMediaEditor items={content.heroMedia} setItems={(items) => setValue("heroMedia", items)} upload={upload} /></div></div>;
  if (section === "features") return <CollectionEditor items={content.features} setItems={(items) => setValue("features", items)} fields={[["title", "Title"], ["text", "Description"], ["icon", "Icon key"]]} />;
  if (section === "how") return <CollectionEditor items={content.howSteps} setItems={(items) => setValue("howSteps", items)} fields={[["number", "Number"], ["title", "Title"], ["text", "Description"]]} />;
  if (section === "insights") return <div><TextField label="Section heading" value={content.insightsHeading} onChange={(v) => setValue("insightsHeading", v)} /><TextArea label="Section description" value={content.insightsText} onChange={(v) => setValue("insightsText", v)} /><CollectionEditor items={content.insights} setItems={(items) => setValue("insights", items)} fields={[["title", "Title"], ["text", "Description"], ["icon", "Icon key"]]} /></div>;
  if (section === "delivery") return <div><TextField label="Section heading" value={content.deliveryHeading} onChange={(v) => setValue("deliveryHeading", v)} /><CollectionEditor items={content.deliverySteps} setItems={(items) => setValue("deliverySteps", items)} fields={[["number", "Number"], ["title", "Status title"]]} /></div>;
  if (section === "built") return <CollectionEditor items={content.developers} setItems={(items) => setValue("developers", items)} fields={[["name", "Developer name"], ["role", "Role / title"], ["description", "Short description"]]} media upload={upload} />;
  if (section === "marketplace") return <div className="grid gap-4"><TextField label="Section heading" value={content.marketplaceHeading} onChange={(v) => setValue("marketplaceHeading", v)} /><TextArea label="Section description" value={content.marketplaceText} onChange={(v) => setValue("marketplaceText", v)} /><p className="text-sm text-slate-500">Featured cards come from active Product records. Manage products in the Products admin section; this control never duplicates marketplace data.</p></div>;
  if (section === "farmer" || section === "buyer") { const prefix = section; return <div className="grid gap-4 sm:grid-cols-2"><TextField label="Heading" value={content[`${prefix}Heading`]} onChange={(v) => setValue(`${prefix}Heading`, v)} /><TextField label="CTA text" value={content[`${prefix}CtaText`]} onChange={(v) => setValue(`${prefix}CtaText`, v)} /><TextField label="CTA destination" value={content[`${prefix}CtaLink`]} onChange={(v) => setValue(`${prefix}CtaLink`, v)} /><TextArea label="Description" value={content[`${prefix}Text`]} onChange={(v) => setValue(`${prefix}Text`, v)} /><BulletEditor items={content[`${prefix}Bullets`]} setItems={(items) => setValue(`${prefix}Bullets`, items)} /></div>; }
  if (section === "about") return <div className="grid gap-4"><TextField label="Heading" value={content.aboutHeading} onChange={(v) => setValue("aboutHeading", v)} /><TextArea label="Description" value={content.aboutText} onChange={(v) => setValue("aboutText", v)} /><MediaField label="About image" value={content.aboutImage} onChange={(v) => setValue("aboutImage", v)} onUpload={(file) => upload(file, (result) => setValue("aboutImage", result.url))} onRemove={() => setValue("aboutImage", "")} disabled={saving} /></div>;
  if (section === "contact") return <div className="grid gap-4 sm:grid-cols-2"><TextField label="Contact heading" value={content.contactHeading} onChange={(v) => setValue("contactHeading", v)} /><TextField label="Email" value={content.contactEmail} onChange={(v) => setValue("contactEmail", v)} /><TextField label="Phone" value={content.contactPhone} onChange={(v) => setValue("contactPhone", v)} /><TextField label="Address" value={content.contactAddress} onChange={(v) => setValue("contactAddress", v)} /></div>;
  if (section === "footer") return <div className="grid gap-4 sm:grid-cols-2"><TextArea label="Footer description" value={content.footerText} onChange={(v) => setValue("footerText", v)} /><TextField label="Copyright text" value={content.copyright} onChange={(v) => setValue("copyright", v)} /><MediaField label="Footer logo" value={content.footerLogo} onChange={(v) => setValue("footerLogo", v)} onUpload={(file) => upload(file, (result) => setValue("footerLogo", result.url))} onRemove={() => setValue("footerLogo", "")} disabled={saving} /><TextField label="Instagram URL" value={content.instagramUrl} onChange={(v) => setValue("instagramUrl", v)} /><TextField label="LinkedIn URL" value={content.linkedinUrl} onChange={(v) => setValue("linkedinUrl", v)} /><TextField label="Facebook URL" value={content.facebookUrl} onChange={(v) => setValue("facebookUrl", v)} /></div>;
  if (section === "policies") return <div className="grid gap-4"><TextArea label="Privacy policy" value={content.privacyPolicy} onChange={(v) => setValue("privacyPolicy", v)} /><TextArea label="Terms and conditions" value={content.terms} onChange={(v) => setValue("terms", v)} /><TextArea label="Refund policy" value={content.refundPolicy} onChange={(v) => setValue("refundPolicy", v)} /></div>;
  return null;
}

function TextField({ label, value = "", onChange }) { return <Input label={label} value={value} onChange={(event) => onChange(event.target.value)} />; }
function TextArea({ label, value = "", onChange }) { return <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">{label}</span><textarea className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-orange-600/10" value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function MediaField({ label, value, onChange, onUpload, onRemove, disabled }) { return <div className="space-y-2 sm:col-span-2"><span className="block text-sm font-medium text-slate-700">{label}</span>{value && <img src={value} alt={`${label} preview`} className="h-32 w-48 rounded-xl border border-slate-200 object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}<div className="flex flex-wrap items-center gap-2"><label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-primary-green px-3 text-sm font-semibold text-white"><Upload className="h-4 w-4" /> Upload Image<input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" disabled={disabled} onChange={(event) => { onUpload(event.target.files?.[0]); event.target.value = ""; }} /></label>{value && <Button type="button" variant="ghost" onClick={onRemove}><X className="h-4 w-4" /> Remove</Button>}</div></div>; }
  function CollectionEditor({ items = [], setItems, fields, media, upload }) { const update = (index, key, value) => setItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item)); const move = (index, direction) => { const next = [...items]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setItems(next); }; const addItem = () => setItems([...items, media ? { name: "", role: "", description: "", image: "", highlight: false, active: true } : { ...Object.fromEntries(fields.map(([key]) => [key, ""])), active: true }]); return <div className="space-y-4">{items.map((item, index) => <div key={index} className="rounded-xl border border-slate-200 p-4"><div className="mb-3 flex items-center justify-between"><span className="text-sm font-bold text-slate-700">Item {index + 1}</span><div className="flex gap-1"><Button type="button" size="sm" variant="ghost" onClick={() => move(index, -1)}><ArrowUp className="h-4 w-4" /></Button><Button type="button" size="sm" variant="ghost" onClick={() => move(index, 1)}><ArrowDown className="h-4 w-4" /></Button><Button type="button" size="sm" variant="ghost" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4 text-rose-500" /></Button></div></div><div className="grid gap-3 sm:grid-cols-2">{fields.map(([key, label]) => <TextField key={key} label={label} value={item[key] || ""} onChange={(value) => update(index, key, value)} />)}<label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={item.active !== false} onChange={(event) => update(index, "active", event.target.checked)} /> Visible on homepage</label>{media && <><label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={Boolean(item.highlight)} onChange={(event) => update(index, "highlight", event.target.checked)} /> Highlight developer</label><MediaField label="Developer image" value={item.image} onChange={(value) => update(index, "image", value)} onUpload={(file) => upload(file, (result) => update(index, "image", result.url))} onRemove={() => update(index, "image", "")} /></>}</div></div>)}<Button type="button" variant="secondary" onClick={addItem}><Plus className="h-4 w-4" /> Add item</Button></div>; }
function BulletEditor({ items = [], setItems }) { return <div className="sm:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Feature bullets</span><div className="space-y-2">{items.map((item, index) => <div key={index} className="flex gap-2"><Input value={item} onChange={(event) => setItems(items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} /><Button type="button" variant="ghost" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4 text-rose-500" /></Button></div>)}</div><Button type="button" className="mt-3" variant="secondary" onClick={() => setItems([...items, "New point"])}><Plus className="h-4 w-4" /> Add bullet</Button></div>; }
function AuditLogs() { const [rows, setRows] = useState([]); const [error, setError] = useState(""); useEffect(() => { adminApi.auditLogs().then(setRows).catch((err) => setError(err.response?.data?.message || "Unable to load audit logs.")); }, []); return <div><PageHeader title="Audit Logs" subtitle="A trace of important administrative actions." />{error && <p className="mb-4 text-rose-600">{error}</p>}<Card><DataTable rowKey="_id" rows={rows} columns={[{ key: "action", label: "Action" }, { key: "resourceType", label: "Resource" }, { key: "actor", label: "Admin", render: (row) => row.actor?.email || "Admin" }, { key: "createdAt", label: "Timestamp", render: (row) => new Date(row.createdAt).toLocaleString() }]} /></Card></div>; }
function Settings() { const [rows, setRows] = useState([]); useEffect(() => { adminApi.settings().then(setRows).catch(() => {}); }, []); return <div><PageHeader title="Settings" subtitle="Application settings only. Secrets are never exposed." /><Card><DataTable rowKey="key" rows={rows.filter((row) => !/secret|password|token|credential|api.?key|database|email.?pass/i.test(row.key))} columns={[{ key: "key", label: "Setting" }, { key: "value", label: "Value", render: (row) => String(row.value) }, { key: "updatedAt", label: "Updated", render: (row) => new Date(row.updatedAt).toLocaleString() }]} /></Card></div>; }