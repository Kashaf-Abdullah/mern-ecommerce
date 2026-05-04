import React, { useState } from 'react';
import { FiUser, FiMapPin, FiLock, FiPlus, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { userAPI, authAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const TabBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '10px 20px', fontWeight: 600, fontSize: 14, background: 'none',
    color: active ? 'var(--primary)' : '#666',
    borderBottom: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
    transition: 'all 0.2s', whiteSpace: 'nowrap'
  }}>{children}</button>
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const { data } = await userAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await authAPI.updatePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success('Password updated!');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally { setSaving(false); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userAPI.addAddress(addrForm);
      updateUser({ addresses: data.addresses });
      setShowAddressForm(false);
      setAddrForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });
      toast.success('Address added!');
    } catch (err) {
      toast.error('Failed to add address');
    } finally { setSaving(false); }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const { data } = await userAPI.deleteAddress(addressId);
      updateUser({ addresses: data.addresses });
      toast.success('Address deleted');
    } catch { toast.error('Failed to delete address'); }
  };

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60, maxWidth: 800 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>My Account</h1>

      {/* Profile Header */}
      <div className="card" style={{ padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative' }}>
          <img src={user?.avatar?.url} alt={user?.name}
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user?.name}</h2>
          <div style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>{user?.email}</div>
          <div style={{ marginTop: 8 }}>
            <span style={{ background: 'rgba(233,69,96,0.1)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
              {user?.role}
            </span>
            {user?.isEmailVerified && (
              <span style={{ background: 'rgba(40,167,69,0.1)', color: 'var(--success)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginLeft: 8 }}>
                <FiCheck size={11} /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', overflowX: 'auto' }}>
          <TabBtn active={tab === 'profile'} onClick={() => setTab('profile')}>Profile</TabBtn>
          <TabBtn active={tab === 'addresses'} onClick={() => setTab('addresses')}>Addresses</TabBtn>
          <TabBtn active={tab === 'security'} onClick={() => setTab('security')}>Security</TabBtn>
        </div>

        <div style={{ padding: 28 }}>
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Full Name</label>
                  <input type="text" value={profileForm.name}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="form-control" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Phone Number</label>
                  <input type="tel" value={profileForm.phone}
                    onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="form-control" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={user?.email} className="form-control" disabled style={{ background: '#f9f9f9', color: '#888' }} />
              </div>
              <button onClick={handleProfileSave} disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Addresses Tab */}
          {tab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Saved Addresses</h3>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className="btn btn-outline btn-sm">
                  <FiPlus size={14} /> Add Address
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} style={{ background: '#f9f9f9', padding: 20, borderRadius: 12, marginBottom: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { key: 'fullName', label: 'Full Name', span: 1 },
                      { key: 'phone', label: 'Phone', span: 1 },
                      { key: 'addressLine1', label: 'Address Line 1', span: 2 },
                      { key: 'city', label: 'City', span: 1 },
                      { key: 'state', label: 'State', span: 1 },
                      { key: 'pincode', label: 'Pincode', span: 1 },
                    ].map(f => (
                      <div key={f.key} style={{ gridColumn: `span ${f.span}` }}>
                        <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>{f.label}</label>
                        <input type="text" value={addrForm[f.key]}
                          onChange={e => setAddrForm(a => ({ ...a, [f.key]: e.target.value }))}
                          className="form-control" required />
                      </div>
                    ))}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={addrForm.isDefault}
                      onChange={e => setAddrForm(a => ({ ...a, isDefault: e.target.checked }))} />
                    Set as default address
                  </label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                      {saving ? 'Saving...' : 'Save Address'}
                    </button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="btn btn-outline btn-sm">Cancel</button>
                  </div>
                </form>
              )}

              {(!user?.addresses || user.addresses.length === 0) ? (
                <p style={{ color: 'var(--gray)', fontSize: 14 }}>No addresses saved yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {user.addresses.map(addr => (
                    <div key={addr._id} style={{ padding: '16px 20px', border: `2px solid ${addr.isDefault ? 'var(--primary)' : '#e0e0e0'}`, borderRadius: 10, position: 'relative' }}>
                      {addr.isDefault && (
                        <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(233,69,96,0.1)', color: 'var(--primary)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                          DEFAULT
                        </span>
                      )}
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{addr.fullName}</div>
                      <div style={{ fontSize: 13, color: '#666', marginTop: 4, lineHeight: 1.7 }}>
                        {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}<br />
                        {addr.phone}
                      </div>
                      <button onClick={() => handleDeleteAddress(addr._id)}
                        style={{ marginTop: 10, color: 'var(--danger)', fontSize: 13, background: 'none', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div style={{ maxWidth: 400 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                {[
                  { key: 'currentPassword', label: 'Current Password' },
                  { key: 'newPassword', label: 'New Password' },
                  { key: 'confirmPassword', label: 'Confirm New Password' },
                ].map(f => (
                  <div className="form-group" key={f.key}>
                    <label>{f.label}</label>
                    <input type="password" value={pwdForm[f.key]}
                      onChange={e => setPwdForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="form-control" required />
                  </div>
                ))}
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
