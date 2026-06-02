import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as usersApi from '../api/users';
import * as tasksApi from '../api/tasks';

const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: usersApi.getUsers });
  const { data: tasks } = useQuery({ queryKey: ['allTasks'], queryFn: tasksApi.getTasks });

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'intern' });

  const createUserMutation = useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setForm({ name: '', email: '', password: '', role: 'intern' });
      alert('User created!');
    }
  });

  if (isLoading) return <div className="spinner"></div>;

  const stats = {
    interns: users?.data.filter(u => u.role === 'intern').length || 0,
    mentors: users?.data.filter(u => u.role === 'mentor').length || 0,
    totalTasks: tasks?.data.length || 0,
    completedTasks: tasks?.data.filter(t => t.status === 'done').length || 0
  };

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-light)' }}>Total Interns</h4>
          <h2 style={{ fontSize: '2rem' }}>{stats.interns}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-light)' }}>Total Mentors</h4>
          <h2 style={{ fontSize: '2rem' }}>{stats.mentors}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-light)' }}>Total Tasks</h4>
          <h2 style={{ fontSize: '2rem' }}>{stats.totalTasks}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-light)' }}>Completed</h4>
          <h2 style={{ fontSize: '2rem', color: 'var(--success)' }}>{stats.completedTasks}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <div className="card">
          <h3>Add New User</h3>
          <form onSubmit={e => { e.preventDefault(); createUserMutation.mutate(form); }}>
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <label>Role</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} required>
              <option value="intern">Intern</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn-primary" disabled={createUserMutation.isPending}>Add User</button>
          </form>
        </div>

        <div className="card">
          <h3>User Management</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.data.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge badge-${u.role}`} style={{ 
                    background: u.role === 'admin' ? '#fee2e2' : u.role === 'mentor' ? '#e0f2fe' : '#dcfce7',
                    color: u.role === 'admin' ? '#991b1b' : u.role === 'mentor' ? '#075985' : '#166534'
                  }}>{u.role}</span></td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
