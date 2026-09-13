import { ArrowDown, ArrowUp, Trash2, Upload } from "lucide-react";
import { Button } from "../common/ui.jsx";

export default function HeroMediaEditor({ items = [], setItems, upload }) {
  const update = (index, key, value) => setItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const move = (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next.map((item, itemIndex) => ({ ...item, order: itemIndex })));
  };
  const add = (file) => upload(file, (result) => setItems([...items, { id: crypto.randomUUID(), type: result.type, cloudinaryUrl: result.url, publicId: result.publicId, duration: result.duration, active: true, order: items.length }]));

  return <div className="space-y-4">
    <div className="flex flex-wrap gap-2">
      <UploadButton label="Upload Image" accept="image/jpeg,image/png,image/webp" onChange={add} />
      <UploadButton label="Upload Video" accept="video/mp4,video/webm,video/quicktime" onChange={add} video />
    </div>
    {items.map((item, index) => <div key={item.id || item.cloudinaryUrl || index} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center">
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">{item.type === "video" ? <video src={item.cloudinaryUrl} className="h-full w-full object-cover" muted /> : <img src={item.cloudinaryUrl} alt="Hero media preview" className="h-full w-full object-cover" />}</div>
      <div className="min-w-0 flex-1"><p className="font-semibold">{item.type === "video" ? "Video" : "Image"} {index + 1}</p><p className="truncate text-xs text-slate-500">{item.cloudinaryUrl}</p><label className="mt-2 flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={item.active !== false} onChange={(event) => update(index, "active", event.target.checked)} /> Active on homepage</label></div>
      <div className="flex gap-1"><Button type="button" size="sm" variant="ghost" onClick={() => move(index, -1)}><ArrowUp className="h-4 w-4" /></Button><Button type="button" size="sm" variant="ghost" onClick={() => move(index, 1)}><ArrowDown className="h-4 w-4" /></Button><Button type="button" size="sm" variant="ghost" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index).map((media, itemIndex) => ({ ...media, order: itemIndex })))}><Trash2 className="h-4 w-4 text-rose-500" /></Button></div>
    </div>)}
    {!items.length && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Upload hero images or videos to build the public carousel.</p>}
  </div>;
}

function UploadButton({ label, accept, onChange, video = false }) {
  return <label className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-semibold text-white ${video ? "bg-ai-blue" : "bg-primary-green"}`}><Upload className="h-4 w-4" /> {label}<input type="file" className="hidden" accept={accept} onChange={(event) => { onChange(event.target.files?.[0]); event.target.value = ""; }} /></label>;
}
