'use client';

import { useState, useEffect } from 'react';
import { Settings, Plus, Edit, Trash2, Save, X, Sun, Battery, Lightbulb, Flame, Home, Droplets, BatteryFull, Utensils, House, Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  type: string;
  cost: number;
  description: string;
  productionBonus?: number | null;
  capacityBonus?: number | null;
  consumptionReduction?: number | null;
  replacesGasAppliance: boolean;
  icon: string;
  isActive: boolean;
}

interface Subsidy {
  id: string;
  name: string;
  description: string;
  amount: number;
  appliesTo: string[];
  isActive: boolean;
}

const PRODUCT_TYPES = ['SOLAR', 'BATTERY', 'EFFICIENCY', 'HEATING'];
const ICON_OPTIONS = ['Sun', 'Battery', 'BatteryFull', 'Lightbulb', 'Flame', 'Home', 'Droplets', 'Utensils', 'House', 'Zap'];

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'subsidies'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSubsidy, setEditingSubsidy] = useState<Subsidy | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isCreatingSubsidy, setIsCreatingSubsidy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, subsidiesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/subsidies')
      ]);
      const productsData = await productsRes.json();
      const subsidiesData = await subsidiesRes.json();
      setProducts(productsData);
      setSubsidies(subsidiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (product: Product) => {
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/products/${product.id}` : '/api/products';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      if (response.ok) {
        await fetchData();
        setEditingProduct(null);
        setIsCreatingProduct(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const saveSubsidy = async (subsidy: Subsidy) => {
    try {
      const method = editingSubsidy ? 'PUT' : 'POST';
      const url = editingSubsidy ? `/api/subsidies/${subsidy.id}` : '/api/subsidies';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subsidy)
      });

      if (response.ok) {
        await fetchData();
        setEditingSubsidy(null);
        setIsCreatingSubsidy(false);
      }
    } catch (error) {
      console.error('Error saving subsidy:', error);
    }
  };

  const deleteSubsidy = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subsidy?')) return;

    try {
      const response = await fetch(`/api/subsidies/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting subsidy:', error);
    }
  };

  const ProductForm = ({ product, onSave, onCancel }: { product?: Product; onSave: (p: Product) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState<Product>(
      product || {
        id: '',
        name: '',
        type: 'SOLAR',
        cost: 0,
        description: '',
        productionBonus: null,
        capacityBonus: null,
        consumptionReduction: null,
        replacesGasAppliance: false,
        icon: 'Sun',
        isActive: true
      }
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-4">{product ? 'Edit Product' : 'New Product'}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              disabled={!!product}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded"
            >
              {PRODUCT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cost ($)</label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Production Bonus (kW)</label>
            <input
              type="number"
              step="0.1"
              value={formData.productionBonus || ''}
              onChange={(e) => setFormData({ ...formData, productionBonus: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity Bonus (kWh)</label>
            <input
              type="number"
              step="0.1"
              value={formData.capacityBonus || ''}
              onChange={(e) => setFormData({ ...formData, capacityBonus: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Consumption Reduction (0-1)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.consumptionReduction || ''}
              onChange={(e) => setFormData({ ...formData, consumptionReduction: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full p-2 border rounded"
            >
              {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.replacesGasAppliance}
                onChange={(e) => setFormData({ ...formData, replacesGasAppliance: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Replaces Gas Appliance</span>
            </label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSave(formData)}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save size={16} /> Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
          >
            <X size={16} /> Cancel
          </button>
        </div>
      </div>
    );
  };

  const SubsidyForm = ({ subsidy, onSave, onCancel }: { subsidy?: Subsidy; onSave: (s: Subsidy) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState<Subsidy>(
      subsidy || {
        id: '',
        name: '',
        description: '',
        amount: 0,
        appliesTo: [],
        isActive: true
      }
    );

    const toggleType = (type: string) => {
      const appliesTo = formData.appliesTo.includes(type)
        ? formData.appliesTo.filter(t => t !== type)
        : [...formData.appliesTo, type];
      setFormData({ ...formData, appliesTo });
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-4">{subsidy ? 'Edit Subsidy' : 'New Subsidy'}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              disabled={!!subsidy}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount ($)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Applies To</label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TYPES.map(type => (
                <label key={type} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.appliesTo.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSave(formData)}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save size={16} /> Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
          >
            <X size={16} /> Cancel
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-600 p-3 rounded-lg text-white">
              <Settings size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Control Panel</h1>
          </div>
          <p className="text-gray-600">Manage marketplace products and subsidies</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'products'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('subsidies')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'subsidies'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Subsidies ({subsidies.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setIsCreatingProduct(true)}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
              >
                <Plus size={20} /> Add New Product
              </button>
            </div>

            {isCreatingProduct && (
              <ProductForm
                onSave={saveProduct}
                onCancel={() => setIsCreatingProduct(false)}
              />
            )}

            {editingProduct && (
              <ProductForm
                product={editingProduct}
                onSave={saveProduct}
                onCancel={() => setEditingProduct(null)}
              />
            )}

            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{product.icon}</span>
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">{product.type}</span>
                        {!product.isActive && (
                          <span className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded">Inactive</span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{product.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">Cost:</span> ${product.cost}
                        </div>
                        {product.productionBonus && (
                          <div>
                            <span className="font-semibold">Production:</span> +{product.productionBonus}kW
                          </div>
                        )}
                        {product.capacityBonus && (
                          <div>
                            <span className="font-semibold">Capacity:</span> +{product.capacityBonus}kWh
                          </div>
                        )}
                        {product.consumptionReduction && (
                          <div>
                            <span className="font-semibold">Reduction:</span> {(product.consumptionReduction * 100).toFixed(0)}%
                          </div>
                        )}
                        {product.replacesGasAppliance && (
                          <div className="text-orange-600 font-semibold">Replaces Gas</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subsidies Tab */}
        {activeTab === 'subsidies' && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setIsCreatingSubsidy(true)}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
              >
                <Plus size={20} /> Add New Subsidy
              </button>
            </div>

            {isCreatingSubsidy && (
              <SubsidyForm
                onSave={saveSubsidy}
                onCancel={() => setIsCreatingSubsidy(false)}
              />
            )}

            {editingSubsidy && (
              <SubsidyForm
                subsidy={editingSubsidy}
                onSave={saveSubsidy}
                onCancel={() => setEditingSubsidy(null)}
              />
            )}

            <div className="grid gap-4">
              {subsidies.map((subsidy) => (
                <div key={subsidy.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{subsidy.name}</h3>
                        {!subsidy.isActive && (
                          <span className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded">Inactive</span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{subsidy.description}</p>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="font-semibold">Amount:</span> ${subsidy.amount}
                        </div>
                        <div>
                          <span className="font-semibold">Applies to:</span>{' '}
                          {subsidy.appliesTo.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSubsidy(subsidy)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => deleteSubsidy(subsidy.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
