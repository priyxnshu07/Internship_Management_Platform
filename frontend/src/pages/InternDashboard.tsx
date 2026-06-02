import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as dashboardApi from '../api/dashboard';
import * as standupApi from '../api/standups';
import * as tasksApi from '../api/tasks';

const InternDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['internDashboard'],
    queryFn: dashboardApi.getInternDashboard
  });

  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');

  const submitStandupMutation = useMutation({
    mutationFn: standupApi.submitStandup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internDashboard'] });
      setYesterday('');
      setToday('');
      setBlockers('');
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => tasksApi.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internDashboard'] });
    }
  });

  if (isLoading) return <div className="spinner"></div>;
  if (isError) return <div className="error-msg">Error loading dashboard</div>;

  const dashboard = data?.data;

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <h3>My Tasks</h3>
          {dashboard?.tasks.length === 0 && <p>No tasks assigned yet.</p>}
          {dashboard?.tasks.map(task => (
            <div key={task.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>{task.title}</h4>
                <select 
                  value={task.status} 
                  onChange={(e) => updateTaskMutation.mutate({ id: task.id, status: e.target.value })}
                  style={{ width: 'auto', marginBottom: 0, marginTop: 0 }}
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <p style={{ color: 'var(--text-light)', margin: '10px 0' }}>{task.description}</p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className={`badge badge-${task.status}`}>{task.status}</span>
                <span style={{ fontSize: '12px' }}>Due: {new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card">
            <h3>Submit Standup</h3>
            <form onSubmit={(e) => { e.preventDefault(); submitStandupMutation.mutate({ yesterday, today, blockers }); }}>
              <label>Yesterday</label>
              <textarea value={yesterday} onChange={(e) => setYesterday(e.target.value)} required />
              <label>Today</label>
              <textarea value={today} onChange={(e) => setToday(e.target.value)} required />
              <label>Blockers</label>
              <textarea value={blockers} onChange={(e) => setBlockers(e.target.value)} required />
              <button type="submit" className="btn-primary" disabled={submitStandupMutation.isPending}>
                {submitStandupMutation.isPending ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>

          {dashboard?.latestEvaluation && (
            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <h3>Latest Evaluation</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{dashboard.latestEvaluation.score}</span>
                <span style={{ color: 'var(--text-light)' }}>/ 10</span>
              </div>
              <p>{dashboard.latestEvaluation.feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
