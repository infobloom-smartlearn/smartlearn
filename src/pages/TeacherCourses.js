import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TeacherCourses.css';
import { API_URL, getAuthToken, getUserType } from '../utils/api';

function useRequireTeacher() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const type = getUserType();
    if (type !== 'teacher') {
      navigate('/signin');
    }
  }, [navigate]);
}

export default function TeacherCourses() {
  useRequireTeacher();

  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState('');

  // Placeholder list of courses – replace with GET `${API_URL}/courses` or a teacher-specific endpoint
  const [courses] = React.useState([
    {
      id: 'course-1',
      title: 'Algebra Foundations',
      subject: 'Math',
      lessons: 8,
      readers: 28,
      excerpt:
        'This course introduces variables, linear equations, and problem solving strategies for middle-school math learners.',
    },
    {
      id: 'course-2',
      title: 'Plant Biology Essentials',
      subject: 'Science',
      lessons: 10,
      readers: 21,
      excerpt:
        'Students explore photosynthesis, plant cells, and ecosystems through short readings and diagrams.',
    },
  ]);

  const [selectedCourse] = React.useState(courses[0]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    if (!title.trim() || !subject.trim()) {
      setError('Please provide a title and subject for the course.');
      return;
    }

    try {
      const token = getAuthToken();

      // Example backend integration:
      // POST `${API_URL}/courses`
      // Payload shape should match backend CourseCreate schema (see backend/app/schemas.py)
      // For now we send minimal fields; backend can extend as needed.
      const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          description,
          subject,
          slug: title.toLowerCase().replace(/\s+/g, '-'),
          course_metadata: { subject },
          is_published: true,
        }),
      });

      if (!res.ok) {
        let detail = 'Could not create course.';
        try {
          const data = await res.json();
          if (data.detail || data.message) {
            detail = data.detail || data.message;
          }
        } catch {
          // ignore
        }
        throw new Error(detail);
      }

      setStatus('Course created successfully. Students can now access it from their dashboard.');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while creating the course.');
    }
  };

  return (
    <div className="teacher-courses-root">
      <aside className="teacher-courses-sidebar">
        <div className="teacher-courses-logo">📚</div>
        <nav className="teacher-courses-nav">
          <Link to="/teacher" className="teacher-courses-icon">
            🏠
          </Link>
          <Link to="/teacher/lessons" className="teacher-courses-icon">
            📄
          </Link>
          <Link to="/teacher/courses" className="teacher-courses-icon active">
            📚
          </Link>
          <Link to="/teacher/analytics" className="teacher-courses-icon">
            📊
          </Link>
        </nav>
      </aside>

      <main className="teacher-courses-main">
        <header className="teacher-courses-header">
          <h1>Course Upload & Reading</h1>
          <p>
            Create full courses or reading packs and make them available for students to
            read directly on SmartLearn.
          </p>
        </header>

        <section className="teacher-courses-layout">
          <article className="teacher-courses-card">
            <h2>Create a Course</h2>
            <p>
              Give your course a name, subject, and short overview. You can attach
              multiple lessons to it later from the lesson notes page.
            </p>

            <form className="teacher-course-form" onSubmit={handleCreateCourse}>
              <div className="teacher-course-field">
                <label htmlFor="course-title">Course title</label>
                <input
                  id="course-title"
                  type="text"
                  placeholder="e.g. Algebra Foundations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="teacher-course-field">
                <label htmlFor="course-subject">Subject</label>
                <select
                  id="course-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">Select subject</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="teacher-course-field">
                <label htmlFor="course-description">Short description</label>
                <textarea
                  id="course-description"
                  placeholder="Briefly describe what this course will cover..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error && <div className="teacher-course-status error">{error}</div>}
              {status && <div className="teacher-course-status ok">{status}</div>}

              <div className="teacher-course-actions">
                <button
                  type="button"
                  className="teacher-course-btn secondary"
                  onClick={() => {
                    setTitle('');
                    setSubject('');
                    setDescription('');
                    setError('');
                    setStatus('');
                  }}
                >
                  Clear
                </button>
                <button type="submit" className="teacher-course-btn primary">
                  Publish Course
                </button>
              </div>
            </form>

            <div className="teacher-course-status" style={{ marginTop: 10 }}>
              Backend integration hint: this form expects a POST endpoint like{' '}
              <code>{API_URL}/courses</code> that accepts a JSON body matching the course
              schema and enforces role-based access (teacher/admin only).
            </div>
          </article>

          <article className="teacher-courses-card">
            <h2>Student Reading View</h2>
            <p>
              Preview how students will read your uploaded courses and materials directly
              on the platform.
            </p>

            <div className="teacher-course-grid">
              {courses.map((c) => (
                <div key={c.id} className="teacher-course-card">
                  <div className="teacher-course-title">{c.title}</div>
                  <div className="teacher-course-meta">
                    <span className="teacher-course-pill">{c.subject}</span>{' '}
                    • {c.lessons} lessons • {c.readers} readers
                  </div>
                  <div className="teacher-course-meta">
                    Students can open this course from their dashboard and read each
                    lesson in sequence.
                  </div>
                </div>
              ))}
            </div>

            <div className="teacher-course-reader">
              <strong>{selectedCourse.title}</strong>
              <br />
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                Example reading pane – this would be populated from{' '}
                <code>
                  {API_URL}/courses/&lt;course_id&gt;/lessons
                </code>{' '}
                and the lesson content field.
              </span>
              <p style={{ marginTop: 8 }}>{selectedCourse.excerpt}</p>
              <p>
                On smaller screens, text reflows automatically for mobile reading, so
                students can complete readings from any device.
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}


