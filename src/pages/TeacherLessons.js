import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TeacherLessons.css';
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

export default function TeacherLessons() {
  useRequireTeacher();

  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState('');
  const [generatedQuizSummary, setGeneratedQuizSummary] = React.useState('');

  // Local placeholder list – replace with data from backend (e.g., GET /api/teacher/lessons)
  const [uploadedLessons] = React.useState([
    {
      id: '1',
      title: 'Algebra – Linear Equations',
      subject: 'Math',
      students: 24,
      quizStatus: 'Ready',
    },
    {
      id: '2',
      title: 'Plant Biology – Photosynthesis',
      subject: 'Science',
      students: 18,
      quizStatus: 'Generating',
    },
  ]);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    if (!title.trim() || !subject.trim()) {
      setError('Please provide a title and subject for this lesson note.');
      return;
    }
    if (!file && !description.trim()) {
      setError('Upload a file or paste lesson text so the AI can generate quizzes.');
      return;
    }

    setUploading(true);
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }

      // Expected backend endpoint:
      // POST `${API_URL}/teacher/lessons/upload`
      // - Accepts multipart/form-data with title, subject, description, file
      // - Stores the lesson note and triggers AI quiz generation
      // - Returns: { lesson_id, quiz_generated: bool, quiz_id?: string, message?: string }
      const res = await fetch(`${API_URL}/teacher/lessons/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        let detail = 'Upload failed.';
        try {
          const data = await res.json();
          if (data.detail || data.message) {
            detail = data.detail || data.message;
          }
        } catch (_) {
          // ignore
        }
        throw new Error(detail);
      }

      const data = await res.json();
      setStatus('Lesson note uploaded successfully. AI quiz generation has started.');

      // Optionally, fetch a quiz generation summary
      // Example expected endpoint:
      // GET `${API_URL}/teacher/lessons/${data.lesson_id}/quiz-summary`
      if (data.lesson_id) {
        try {
          const summaryRes = await fetch(
            `${API_URL}/teacher/lessons/${data.lesson_id}/quiz-summary`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          if (summaryRes.ok) {
            const summary = await summaryRes.json();
            setGeneratedQuizSummary(
              summary.preview ||
                'Quiz questions will appear here once generation is complete.'
            );
          }
        } catch {
          setGeneratedQuizSummary(
            'Quiz questions will appear here once generation is complete.'
          );
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred while uploading the lesson note.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="teacher-lessons-root">
      <aside className="teacher-lessons-sidebar">
        <div className="teacher-lessons-logo">👩‍🏫</div>
        <nav className="teacher-lessons-nav">
          <Link to="/teacher" className="teacher-lessons-icon">
            🏠
          </Link>
          <Link to="/teacher/lessons" className="teacher-lessons-icon active">
            📄
          </Link>
          <Link to="/teacher/courses" className="teacher-lessons-icon">
            📚
          </Link>
          <Link to="/teacher/analytics" className="teacher-lessons-icon">
            📊
          </Link>
        </nav>
      </aside>

      <main className="teacher-lessons-main">
        <header className="teacher-lessons-header">
          <div>
            <h1>Lesson Note Upload</h1>
            <p>
              Upload your lesson notes and let SmartLearn automatically generate quizzes
              for your students.
            </p>
          </div>
        </header>

        <section className="teacher-lessons-layout">
          <article className="teacher-lessons-card">
            <h2>Upload a Lesson Note</h2>
            <p>
              Accepts PDF, DOCX or plain text. The AI will scan your content and create
              multiple-choice and short-answer questions.
            </p>

            <form className="teacher-form" onSubmit={handleSubmit}>
              <div className="teacher-inline">
                <div className="teacher-field">
                  <label htmlFor="title">Lesson title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Algebra – Linear Equations"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="teacher-field">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
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
              </div>

              <div className="teacher-field">
                <label htmlFor="description">Optional summary / instructions</label>
                <textarea
                  id="description"
                  placeholder="Give the AI more context about what to focus on in this lesson..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="teacher-field">
                <label>Lesson file</label>
                <div className="teacher-file-input">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <div className="teacher-hint">
                    Upload a PDF, Word document, or text file. Max size depends on backend
                    configuration.
                  </div>
                </div>
              </div>

              <div className="teacher-hint">
                If you prefer, you can leave the file empty and paste the lesson content
                directly into the AI on the quiz page later.
              </div>

              {error && <div className="teacher-status error">{error}</div>}
              {status && <div className="teacher-status ok">{status}</div>}

              <div className="teacher-actions">
                <button
                  type="button"
                  className="teacher-btn secondary"
                  onClick={() => {
                    setTitle('');
                    setSubject('');
                    setDescription('');
                    setFile(null);
                    setError('');
                    setStatus('');
                    setGeneratedQuizSummary('');
                  }}
                  disabled={uploading}
                >
                  Clear
                </button>
                <button type="submit" className="teacher-btn primary" disabled={uploading}>
                  {uploading ? 'Uploading…' : 'Upload & Generate Quiz'}
                </button>
              </div>
            </form>
          </article>

          <article className="teacher-lessons-card">
            <h2>Generated Quiz Preview</h2>
            <p>
              Once the AI finishes processing your lesson, a summary of the generated quiz
              will appear here.
            </p>
            <div className="teacher-hint">
              Example backend endpoint for retrieving generated questions:
              <br />
              <code>GET {API_URL}/teacher/lessons/&lt;lesson_id&gt;/quiz</code>
            </div>
            <div className="teacher-status" style={{ marginTop: 12 }}>
              {generatedQuizSummary
                ? generatedQuizSummary
                : 'Upload a lesson note to see AI-generated quiz details.'}
            </div>

            <div style={{ marginTop: 16 }}>
              <h2>Your Lesson Notes</h2>
              <p>Recently uploaded lesson notes accessible to enrolled students.</p>
              <div className="teacher-list-table">
                <div className="teacher-list-header">
                  <span>Title</span>
                  <span>Subject</span>
                  <span>Students</span>
                  <span>Quiz</span>
                </div>
                {uploadedLessons.map((l) => (
                  <div key={l.id} className="teacher-list-row">
                    <span>{l.title}</span>
                    <span>
                      <span className="teacher-pill subject">{l.subject}</span>
                    </span>
                    <span>{l.students}</span>
                    <span>
                      <span
                        className={`teacher-pill ${
                          l.quizStatus === 'Ready' ? 'quiz' : 'pending'
                        }`}
                      >
                        {l.quizStatus === 'Ready' ? 'Quiz ready' : 'Generating…'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}


