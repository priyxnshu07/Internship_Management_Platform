import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as dashboardApi from '../api/dashboard';
import * as tasksApi from '../api/tasks';
import * as standupApi from '../api/standups';
import * as evalApi from '../api/evaluations';

const MentorDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['mentorDashboard'], queryFn: dashboardApi.getMentorDashboard });
  const [selectedIntern, setSelectedIntern] = useState<number | null>(null);

  // Forms state
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigned_to: '', due_date: '' });
  const [evalForm, setEvalForm] = useState({ intern_id: '', score: 5, feedback: '' });

  const { data: standups } = useQuery({
    queryKey: ['standups', selectedIntern],
    queryFn: () => standupApi.getStandups(selectedIntern!),
    enabled: !!selectedIntern
  });

  const createTaskMutation = useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorDashboard'] });
      setTaskForm({ title: '', description: '', assigned_to: '', due_date: '' });
      alert('Task created!');
    }
  });

  const createEvalMutation = useMutation({
    mutationFn: evalApi.createEvaluation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorDashboard'] });
      setEvalForm({ intern_id: '', score: 5, feedback: '' });
      alert('Evaluation submitted!');
    }
  });

  if (isLoading) return <div className="spinner"></div>;

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h3>Assign New Task</h3>
          <form onSubmit={(e) => { e.preventDefault(); createTaskMutation.mutate({ ...taskForm, assigned_to: parseInt(taskForm.assigned_to) }); }}>
            <label>Title</label>
            <input value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} required />
            <label>Description</label>
            <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} required />
            <label>Intern</label>
            <select value={taskForm.assigned_to} onChange={e => setTaskForm({...taskForm, assigned_to: e.target.value})} required>
              <option value="">Select Intern</option>
              {data?.data.map(d => <option key={d.intern.id} value={d.intern.id}>{d.intern.name}</option>)}
            </select>
            <label>Due Date</label>
            <input type="date" value={taskForm.due_date} onChange={e => setTaskForm({...taskForm, due_date: e.target.value})} required />
            <button type="submit" className="btn-primary" disabled={createTaskMutation.isPending}>Create Task</button>
          </form>
        </div>

        <div className="card">
          <h3>Submit Evaluation</h3>
          <form onSubmit={(e) => { e.preventDefault(); createEvalMutation.mutate({ ...evalForm, intern_id: parseInt(evalForm.intern_id) }); }}>
            <label>Intern</label>
            <select value={evalForm.intern_id} onChange={e => setEvalForm({...evalForm, intern_id: e.target.value})} required>
              <option value="">Select Intern</option>
              {data?.data.map(d => <option key={d.intern.id} value={d.intern.id}>{d.intern.name}</option>)}
            </select>
            <label>Score (1-10)</label>
            <input type="number" min="1" max="10" value={evalForm.score} onChange={e => setEvalForm({...evalForm, score: parseInt(e.target.value)})} required />
            <label>Feedback</label>
            <textarea value={evalForm.feedback} onChange={e => setEvalForm({...evalForm, feedback: e.target.value})} required />
            <button type="submit" className="btn-primary" disabled={createEvalMutation.isPending}>Submit Evaluation</button>
          </form>
        </div>
      </div>

      <div className="card">
        <h3>Intern Overview</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tasks (Done/Total)</th>
              <th>Last Standup</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map(d => (
              <React.Fragment key={d.intern.id}>
                <tr>
                  <td>{d.intern.name}</td>
                  <td>{d.intern.email}</td>
                  <td>{d.completedCount} / {d.taskCount}</td>
                  <td>{d.lastStandup ? new Date(d.lastStandup).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <button onClick={() => setSelectedIntern(selectedIntern === d.intern.id ? null : d.intern.id)} style={{ background: '#f1f5f9', color: '#2563eb' }}>
                      {selectedIntern === d.intern.id ? 'Hide Standups' : 'View Standups'}
                    </button>
                  </td>
                </tr>
                {selectedIntern === d.intern.id && (
                  <tr>
                    <td colSpan={5} style={{ background: '#f8fafc', padding: '20px' }}>
                      <h4>Standups for {d.intern.name}</h4>
                      {standups?.data.length === 0 && <p>No standups submitted yet.</p>}
                      {standups?.data.map(s => (
                        <div key={s.id} className="card" style={{ marginBottom: '10px' }}>
                          <small>{new Date(s.submitted_at).toLocaleString()}</small>
                          <p><strong>Yesterday:</strong> {s.yesterday}</p>
                          <p><strong>Today:</strong> {s.today}</p>
                          <p><strong>Blockers:</strong> {s.blockers}</p>
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorDashboard;
