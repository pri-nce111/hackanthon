import { useState } from 'react';

export default function AdminDemo() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for demo
  const mockStats = {
    totalUsers: 1247,
    activeUsers: 342,
    totalConversations: 2891,
    activeConversations: 45,
    activeAlerts: 3
  };

  const mockIntents = [
    { name: 'fever_symptoms', count: 234 },
    { name: 'covid_symptoms', count: 189 },
    { name: 'vaccination_schedule', count: 156 },
    { name: 'dengue_symptoms', count: 98 },
    { name: 'preventive_care', count: 87 }
  ];

  const mockAlerts = [
    {
      id: '1',
      title: 'COVID-19 Vaccination Drive',
      message: 'Free vaccination available at all government centers',
      severity: 'medium',
      type: 'vaccination',
      isActive: true,
      sentCount: 1200,
      validUntil: '2024-02-15'
    },
    {
      id: '2',
      title: 'Dengue Prevention Alert',
      message: 'Remove stagnant water to prevent dengue',
      severity: 'high',
      type: 'prevention',
      isActive: true,
      sentCount: 850,
      validUntil: '2024-02-28'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Demo Banner */}
      <div style={{ 
        background: '#fef3c7', 
        border: '1px solid #f59e0b', 
        borderRadius: 8, 
        padding: '12px 16px',
        marginBottom: 20,
        fontSize: 14,
        color: '#92400e'
      }}>
        🚧 Demo Mode - This is a preview of the admin dashboard with mock data. Full functionality requires backend setup.
      </div>

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
          { id: 'alerts', label: 'Health Alerts' }
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
              { title: 'Total Users', value: mockStats.totalUsers, color: '#3b82f6' },
              { title: 'Active Users (7d)', value: mockStats.activeUsers, color: '#10b981' },
              { title: 'Total Conversations', value: mockStats.totalConversations, color: '#8b5cf6' },
              { title: 'Active Conversations', value: mockStats.activeConversations, color: '#f59e0b' },
              { title: 'Active Alerts', value: mockStats.activeAlerts, color: '#ef4444' }
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

          {/* Intent Stats */}
          <div style={{
            background: 'white',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: 20
          }}>
            <h3 style={{ marginBottom: 16, color: '#1f2937' }}>Top Health Queries</h3>
            {mockIntents.map((intent, index) => (
              <div key={intent.name} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: index < mockIntents.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}>
                <span style={{ fontSize: 14, textTransform: 'capitalize' }}>
                  {intent.name.replace('_', ' ')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: `${(intent.count / 234) * 100}px`,
                    height: 8,
                    background: '#3b82f6',
                    borderRadius: 4
                  }} />
                  <span style={{ 
                    background: '#3b82f6', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: 12, 
                    fontSize: 12,
                    minWidth: 40,
                    textAlign: 'center'
                  }}>
                    {intent.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Language Distribution */}
          <div style={{
            background: 'white',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 16, color: '#1f2937' }}>Language Distribution</h3>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>🇮🇳 Hindi</span>
                  <span>65%</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: 4, height: 8 }}>
                  <div style={{ background: '#10b981', width: '65%', height: '100%', borderRadius: 4 }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>🇺🇸 English</span>
                  <span>35%</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: 4, height: 8 }}>
                  <div style={{ background: '#3b82f6', width: '35%', height: '100%', borderRadius: 4 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Alerts Tab */}
      {activeTab === 'alerts' && (
        <div>
          <div style={{
            background: 'white',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 16, color: '#1f2937' }}>Active Health Alerts</h3>
            
            {mockAlerts.map((alert) => (
              <div key={alert.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                background: alert.isActive ? 'white' : '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
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
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: alert.isActive ? '#10b981' : '#6b7280',
                    color: 'white',
                    fontSize: 12
                  }}>
                    {alert.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ 
              textAlign: 'center', 
              padding: 20, 
              color: '#6b7280',
              fontSize: 14
            }}>
              💡 In the full version, you can create and send new health alerts to targeted user groups.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}