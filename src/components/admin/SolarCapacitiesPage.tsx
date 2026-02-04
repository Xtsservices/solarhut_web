import React, { useEffect, useState } from 'react';

type Capacity = {
  id: string;
  name: string;
  description?: string;
  wattage: number;
  price: number;
};

const MOCK_CAPACITIES: Capacity[] = [
  { id: 'cap-1', name: 'Residential 1kW', wattage: 1000, price: 45000, description: 'Compact residential package' },
  { id: 'cap-2', name: 'Residential 3kW', wattage: 3000, price: 120000, description: 'Popular home solution' },
  { id: 'cap-3', name: 'Commercial 10kW', wattage: 10000, price: 360000, description: 'Small commercial setup' },
];

export default function SolarCapacitiesPage() {
  const [items, setItems] = useState<Capacity[]>(() => {
    try {
      const raw = localStorage.getItem('solar_capacities');
      return raw ? JSON.parse(raw) : MOCK_CAPACITIES;
    } catch {
      return MOCK_CAPACITIES;
    }
  });
  const [editing, setEditing] = useState<Capacity | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('solar_capacities', JSON.stringify(items));
  }, [items]);

  const saveItem = (data: Capacity) => {
    setItems(prev => {
      const exists = prev.find(p => p.id === data.id);
      if (exists) return prev.map(p => p.id === data.id ? data : p);
      return [data, ...prev];
    });
    setShowForm(false);
    setEditing(null);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const generateInvoice = (capacity: Capacity) => {
    const invoice = {
      id: `INV-${Date.now()}`,
      item: capacity.name,
      details: capacity,
      total: capacity.price,
      date: new Date().toISOString(),
    };
    localStorage.setItem('last_invoice', JSON.stringify(invoice));
    // quick UX feedback: open print-like preview in new window
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<pre style="font-family:system-ui;padding:20px">${JSON.stringify(invoice, null, 2)}</pre>`);
      w.document.title = invoice.id;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Solar Capacities</h2>
            <p className="text-sm text-slate-500">Manage predefined capacity packages used in estimations and invoices.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md shadow-sm text-sm"
            >
              Add Capacity
            </button>
          </div>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-sm text-slate-500">No capacities defined. Add one to show in estimations dropdown.</div>
          ) : (
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-orange-600 font-medium">{item.name}</div>
                      <div className="text-sm text-slate-500">({item.wattage} W)</div>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{item.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-slate-800">₹{item.price.toLocaleString()}</div>
                    <button
                      onClick={() => { setEditing(item); setShowForm(true); }}
                      className="text-sm px-2 py-1 border rounded text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm px-2 py-1 border rounded text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => generateInvoice(item)}
                      className="text-sm px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                    >
                      Invoice
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Simple form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-medium text-slate-800">{editing ? 'Edit Capacity' : 'Add Capacity'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-slate-500 hover:text-slate-700">Close</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const data: Capacity = {
                id: editing?.id || `cap-${Date.now()}`,
                name: String(formData.get('name') || '').trim(),
                description: String(formData.get('description') || '').trim(),
                wattage: Number(formData.get('wattage') || 0),
                price: Number(formData.get('price') || 0),
              };
              saveItem(data);
            }} className="p-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-700">Name</label>
                <input name="name" defaultValue={editing?.name} required className="mt-1 w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-slate-700">Wattage (W)</label>
                <input name="wattage" type="number" defaultValue={editing?.wattage} required className="mt-1 w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-slate-700">Price (INR)</label>
                <input name="price" type="number" defaultValue={editing?.price} required className="mt-1 w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-slate-700">Description</label>
                <textarea name="description" defaultValue={editing?.description} className="mt-1 w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-3 py-1 text-sm border rounded">Cancel</button>
                <button type="submit" className="px-3 py-1 text-sm bg-orange-500 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
