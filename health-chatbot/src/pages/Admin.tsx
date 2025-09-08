import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalConversations: number;
  activeConversations: number;
  activeAlerts: number;
}

interface IntentStat {
  _id: string;
  count: number;
}

interface LanguageStat {
  _id: string;
  count: number;
}

interface Conversation {
  _id: string;
  phoneNumber: string;
  status: string;
  tags: string[];
  updatedAt: string;
  userId: {
    name?: string;
    phoneNumber: string;
  };
}

interface HealthAlert {
  _id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  isActive: boolean;
  sentCount: number;
  validUntil: string;
  createdAt: string;
}

export default function Admin() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [intentStats, setIntentStats] = useState<IntentStat[]>([]);
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([]);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    severity: 'medium' as const,
    type: 'general',
    validUntil: '',
    location: {
      state: '',
      district: '',
      nationwide: false
    }
  });

  useEffect(() => {
    fetchDashboardData();
    fetchAlerts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats`);
      const { data } = response.data;
      
      setStats(data.stats);
      setIntentStats(data.intentStats);
      setLanguageStats(data.languageStats);
      setRecentConversations(data.recentConversations);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/alerts`);
      setAlerts(response.data.data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const createAlert = async () => {
    try {
      await axios.post(`${API_BASE_URL}/admin/alerts`, newAlert);
      alert('Alert created and sent successfully!');
      setNewAlert({
        title: '',
        message: '',
        severity: 'medium',
        type: 'general',
        validUntil: '',
        location: {
          state: '',
          district: '',
          nationwide: false
        }
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Error creating alert');
    }
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/alerts/${alertId}`, { isActive: !isActive });
      fetchAlerts();
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading admin dashboard...</div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getSeverityEmoji = (severity: string) => {
    switch (severity) {
      case 'low': return '🟡';
      case 'medium': return '🟠';
      case 'high': return '🔴';
      case 'critical': return '🚨';
      default: return '⚪';
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 30, color: '#1f2937' }}>Health Chatbot Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        marginBottom: 30, 
        borderBottom: '1px solid #e5e7eb' 
      }}>
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'alerts', label: 'Health Alerts' },
          { id: 'conversations', label: 'Conversations' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === tab.id ? '#2563eb' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#6b7280',
              borderRadius: '8px 8px 0 0',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 20, 
            marginBottom: 30 
          }}>
            {[
              { title: 'Total Users', value: stats?.totalUsers || 0, color: '#3b82f6' },
              { title: 'Active Users (7d)', value: stats?.activeUsers || 0, color: '#10b981' },
              { title: 'Total Conversations', value: stats?.totalConversations || 0, color: '#8b5cf6' },
              { title: 'Active Conversations', value: stats?.activeConversations || 0, color: '#f59e0b' },
              { title: 'Active Alerts', value: stats?.activeAlerts || 0, color: '#ef4444' }
            ].map(stat => (
              <div key={stat.title} style={{
                background: 'white',
                padding: 20,
                borderRadius: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: `3px solid ${stat.color}20`
              }}>
                <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: stat.color }}>
                  {stat.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
            {/* Intent Stats */}
            <div style={{
              background: 'white',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: 16, color: '#1f2937' }}>Top Intents</h3>
              {intentStats.slice(0, 5).map((intent, index) => (
                <div key={intent._id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < 4 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <span style={{ fontSize: 14 }}>{intent._id}</span>
                  <span style={{ 
                    background: '#3b82f6', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: 12, 
                    fontSize: 12 
                  }}>
                    {intent.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Language Stats */}
            <div style={{
              background: 'white',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: 16, color: '#1f2937' }}>Language Distribution</h3>
              {languageStats.map((lang, index) => (
                <div key={lang._id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < languageStats.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <span style={{ fontSize: 14 }}>
                    {lang._id === 'hi' ? '🇮🇳 Hindi' : '🇺🇸 English'}
                  </span>
                  <span style={{ 
                    background: '#10b981', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: 12, 
                    fontSize: 12 
                  }}>
                    {lang.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Conversations */}
          <div style={{
            background: 'white',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 16, color: '#1f2937' }}>Recent Conversations</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280' }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280' }}>Tags</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280' }}>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {recentConversations.map((conv) => (
                    <tr key={conv._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '12px 8px' }}>{conv.phoneNumber}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          background: conv.status === 'active' ? '#dcfce7' : '#f3f4f6',
                          color: conv.status === 'active' ? '#166534' : '#374151'
                        }}>
                          {conv.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {conv.tags.slice(0, 2).map(tag => (
                          <span key={tag} style={{
                            padding: '2px 6px',
                            margin: '0 2px',
                            borderRadius: 8,
                            fontSize: 10,
                            background: '#e5e7eb',
                            color: '#374151'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: 12, color: '#6b7280' }}>
                        {new Date(conv.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Health Alerts Tab */}
      {activeTab === 'alerts' && (
        <div>
          {/* Create New Alert */}
          <div style={{
            background: 'white',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: 20
          }}>
            <h3 style={{ marginBottom: 16, color: '#1f2937' }}>Create New Health Alert</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
                  Title
                </label>
                <input
                  type="text"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
                  Severity
                </label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, severity: e.target.value as any }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
                Message
              </label>
              <textarea
                value={newAlert.message}
                onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
                  Type
                </label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db'
                  }}
                >
                  <option value="outbreak">Outbreak</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="prevention">Prevention</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
                  State
                </label>
                <input
                  type="text"
                  value={newAlert.location.state}
                  onChange={(e) => setNewAlert(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, state: e.target.value } 
                  }))}
                  placeholder="Leave empty for nationwide"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
                  Valid Until
                </label>
                <input
                  type="datetime-local"
                  value={newAlert.validUntil}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, validUntil: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db'
                  }}
                />
              </div>
            </div>

            <button
              onClick={createAlert}
              disabled={!newAlert.title || !newAlert.message || !newAlert.validUntil}
              style={{
                padding: '10px 20px',
                borderRadius: 6,
                background: '#2563eb',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: (!newAlert.title || !newAlert.message || !newAlert.validUntil) ? 0.5 : 1
              }}
            >
              Create & Send Alert
            </button>
          </div>

          {/* Existing Alerts */}
          <div style={{
            background: 'white',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 16, color: '#1f2937' }}>Existing Alerts</h3>
            
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: 20 }}>
                No alerts created yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {alerts.map((alert) => (
                  <div key={alert._id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: 16,
                    background: alert.isActive ? 'white' : '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 18 }}>{getSeverityEmoji(alert.severity)}</span>
                          <h4 style={{ margin: 0, color: '#1f2937' }}>{alert.title}</h4>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                            background: getSeverityColor(alert.severity) + '20',
                            color: getSeverityColor(alert.severity)
                          }}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                        <p style={{ margin: '8px 0', color: '#6b7280', fontSize: 14 }}>
                          {alert.message}
                        </p>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#9ca3af' }}>
                          <span>Type: {alert.type}</span>
                          <span>Sent to: {alert.sentCount} users</span>
                          <span>Valid until: {new Date(alert.validUntil).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAlert(alert._id, alert.isActive)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: '1px solid #d1d5db',
                          background: alert.isActive ? '#ef4444' : '#10b981',
                          color: 'white',
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        {alert.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conversations Tab */}
      {activeTab === 'conversations' && (
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: 16, color: '#1f2937' }}>All Conversations</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280' }}>Phone Number</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280' }}>Tags</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280' }}>Last Active</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentConversations.map((conv) => (
                  <tr key={conv._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>{conv.phoneNumber}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 12,
                        fontSize: 12,
                        background: conv.status === 'active' ? '#dcfce7' : '#f3f4f6',
                        color: conv.status === 'active' ? '#166534' : '#374151'
                      }}>
                        {conv.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      {conv.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{
                          padding: '2px 6px',
                          margin: '0 2px',
                          borderRadius: 8,
                          fontSize: 10,
                          background: '#e5e7eb',
                          color: '#374151'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: 12, color: '#6b7280' }}>
                      {new Date(conv.updatedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <button style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: '1px solid #d1d5db',
                        background: 'white',
                        fontSize: 12,
                        cursor: 'pointer'
                      }}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}