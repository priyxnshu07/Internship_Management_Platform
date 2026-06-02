-- Users & Auth
CREATE TYPE user_role AS ENUM ('admin', 'mentor', 'intern', 'reviewer');
CREATE TYPE intern_status AS ENUM ('active', 'completed', 'terminated');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');

CREATE TABLE users (
    id UUID PRIMARY KEY, 
    email TEXT UNIQUE, 
    role user_role, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY, 
    user_id UUID REFERENCES users(id), 
    token TEXT, 
    expires_at TIMESTAMP
);

-- Intern Lifecycle
CREATE TABLE intern_profiles (
    id UUID PRIMARY KEY, 
    user_id UUID REFERENCES users(id), 
    mentor_id UUID REFERENCES users(id), 
    start_date DATE, 
    end_date DATE, 
    status intern_status
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY, 
    title TEXT, 
    description TEXT, 
    assigned_to UUID REFERENCES users(id), 
    assigned_by UUID REFERENCES users(id), 
    status task_status, 
    due_date DATE
);

CREATE TABLE standups (
    id UUID PRIMARY KEY, 
    intern_id UUID REFERENCES users(id), 
    yesterday TEXT, 
    today TEXT, 
    blockers TEXT, 
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evaluations (
    id UUID PRIMARY KEY, 
    intern_id UUID REFERENCES users(id), 
    reviewer_id UUID REFERENCES users(id), 
    score INT CHECK (score >= 1 AND score <= 5), 
    feedback TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
