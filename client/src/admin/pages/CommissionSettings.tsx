// src/pages/CommissionSettings.tsx
import React, { useEffect, useState } from 'react';
import type { CommissionSettings } from '../../types';
import { commissionApi } from '../../Config/appi';

const CommissionSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<CommissionSettings>({
    platformCommissionPercent: 5,
    deliveryCharge: 20,
    perKmCharge: 5,
    freeDeliveryAbove: 500,
    discountEnabled: false,
    maxDiscountPercent: 10,
    minOrderForDiscount: 300,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    commissionApi.getSettings()
      .then(res => {
        console.log("Commission Settings Response", res.data);
        setSettings(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await commissionApi.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const InputGroup: React.FC<{
    label: string; value: number | boolean; field: keyof CommissionSettings;
    type?: 'number' | 'toggle'; hint?: string; prefix?: string; suffix?: string;
  }> = ({ label, value, field, type = 'number', hint, prefix, suffix }) => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, color: '#1a2e1a', fontSize: '15px' }}>{label}</div>
          {hint && <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{hint}</div>}
        </div>
        {type === 'toggle' ? (
          <div
            onClick={() => setSettings(prev => ({ ...prev, [field]: !prev[field] }))}
            style={{
              width: '48px', height: '26px', borderRadius: '13px',
              background: value ? '#2d7a2d' : '#ddd',
              position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
              position: 'absolute', top: '3px',
              left: value ? '25px' : '3px',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {prefix && <span style={{ color: '#555', fontSize: '14px' }}>{prefix}</span>}
            <input
              type="number"
              value={value as number}
              onChange={e => setSettings(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }))}
              style={{
                width: '100px', padding: '8px 12px', border: '1.5px solid #ddd',
                borderRadius: '8px', fontSize: '14px', textAlign: 'center',
                fontWeight: 600, color: '#1a2e1a',
              }}
            />
            {suffix && <span style={{ color: '#555', fontSize: '14px' }}>{suffix}</span>}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading settings...</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a2e1a' }}>Commission & Fee Settings</h2>
        <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>Configure platform fees, delivery charges, and discount rules</p>
      </div>

      {/* Preview Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2e1a, #2d4a2d)',
        borderRadius: '12px', padding: '24px', color: '#fff', marginBottom: '24px',
      }}>
        <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '12px' }}>📊 Example Order Breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Order Value', value: '₹1,000', color: '#fff' },
            { label: `Platform Fee (${settings.platformCommissionPercent}%)`, value: `₹${(1000 * settings.platformCommissionPercent / 100).toFixed(0)}`, color: '#ffa080' },
            { label: 'Delivery Fee ( Paid by Customer)', value: `₹${settings.deliveryCharge}`, color: '#80c0ff' },
            // { label: 'Farmer Receives', value: `₹${(1000 - (1000 * settings.platformCommissionPercent / 100) - settings.deliveryCharge).toFixed(0)}`, color: '#80ff80' },
            {
              label: 'Farmer Receives',
              value: `₹${(
                1000 -
                (1000 * settings.platformCommissionPercent / 100)
              ).toFixed(0)}`,
              color: '#80ff80'
            }
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Commission */}
        <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          💰 Platform Commission
        </h3>
        <InputGroup
          label="Commission Percentage"
          value={settings.platformCommissionPercent}
          field="platformCommissionPercent"
          hint="Deducted from every order before farmer payout"
          suffix="%"
        />

        {/* Delivery */}
        <h3 style={{ margin: '20px 0 12px', fontSize: '15px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🚚 Delivery Charges
        </h3>
        <InputGroup label="Base Delivery Charge" value={settings.deliveryCharge} field="deliveryCharge" hint="Fixed charge per order" prefix="₹" />
        <InputGroup label="Per KM Charge" value={settings.perKmCharge} field="perKmCharge" hint="Additional charge per kilometer" prefix="₹" />
        <InputGroup label="Free Delivery Above" value={settings.freeDeliveryAbove} field="freeDeliveryAbove" hint="Order amount above which delivery is free" prefix="₹" />

        {/* Discount */}
        <h3 style={{ margin: '20px 0 12px', fontSize: '15px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🎁 Discount Control
        </h3>
        <InputGroup label="Enable Discounts" value={settings.discountEnabled} field="discountEnabled" type="toggle" hint="Allow discount codes on platform" />
        {settings.discountEnabled && (
          <>
            <InputGroup label="Max Discount %" value={settings.maxDiscountPercent} field="maxDiscountPercent" hint="Maximum discount allowed on any order" suffix="%" />
            <InputGroup label="Min Order for Discount" value={settings.minOrderForDiscount} field="minOrderForDiscount" hint="Minimum order amount to avail discount" prefix="₹" />
          </>
        )}

        {/* Save Button */}
        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '14px 36px', borderRadius: '10px', border: 'none',
              background: saving ? '#aaa' : '#2d4a2d', color: '#fff',
              fontSize: '15px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
          {saved && (
            <span style={{ color: '#2d7a2d', fontWeight: 600, fontSize: '14px' }}>
              ✅ Settings saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CommissionSettingsPage;