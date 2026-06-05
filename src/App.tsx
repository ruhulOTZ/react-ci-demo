import heroImg from './assets/hero.png'
import './App.css'

const concepts = [
  'CI/CD basics and benefits',
  'GitHub Actions workflows, jobs, and steps',
  'Self-hosted runner setup and usage',
  'YAML workflow structure',
  'Pipeline debugging from workflow logs',
]

const requirements = [
  'GitHub repository link',
  'Workflow YAML file',
  'Successful pipeline screenshot',
  'Failed pipeline debugging screenshot',
  'Short explanation of the workflow process',
]

const processSteps = [
  {
    title: 'Push to development',
    text: 'A commit on the development branch starts the workflow automatically.',
  },
  {
    title: 'Self-hosted runner picks up job',
    text: 'The company machine runs checkout, install, test, and build steps.',
  },
  {
    title: 'Review logs and result',
    text: 'Students inspect success or failure logs and document what happened.',
  },
]

function App() {
  return (
    <main className="page-shell">
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Module 5 Assignment</p>
          <h1 id="page-title">GitHub Actions Fundamentals</h1>
          <p className="hero-text">
            Build a simple CI pipeline for a React application that runs on a
            self-hosted runner whenever developers push code to the development
            branch.
          </p>
          <div className="hero-actions" aria-label="Assignment links">
            <a className="primary-link" href="#outcome">
              View outcome
            </a>
            <a className="secondary-link" href="#submission">
              Submission checklist
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="CI pipeline preview">
          <img src={heroImg} alt="" />
          <div className="pipeline-card">
            <span className="status-dot" aria-hidden="true"></span>
            <p>development branch</p>
            <strong>self-hosted runner</strong>
            <small>npm install -- npm test -- npm run build</small>
          </div>
        </div>
      </section>

      <section className="assignment-band" aria-labelledby="problem-title">
        <div className="section-heading">
          <p className="eyebrow">Problem Statement</p>
          <h2 id="problem-title">Automate testing and build before deployment</h2>
        </div>
        <p>
          Developers currently run tests and builds manually, which slows down
          releases and can introduce human error. This assignment introduces a
          repeatable GitHub Actions workflow that validates the React project on
          every development branch push.
        </p>
      </section>

      <section className="grid-section" aria-label="Assignment details">
        <article className="info-card" id="outcome">
          <h2>Expected Outcome</h2>
          <p>
            The React application should build successfully through GitHub
            Actions, with the workflow executed by a configured self-hosted
            runner.
          </p>
          <ul>
            <li>Automatic run after pushing to development</li>
            <li>Pipeline executed on a self-hosted runner</li>
            <li>Build result visible in workflow logs</li>
          </ul>
        </article>

        <article className="info-card">
          <h2>Concepts Covered</h2>
          <ul>
            {concepts.map((concept) => (
              <li key={concept}>{concept}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="timeline-section" aria-labelledby="process-title">
        <div className="section-heading">
          <p className="eyebrow">Workflow Execution</p>
          <h2 id="process-title">How the CI pipeline runs</h2>
        </div>
        <div className="timeline">
          {processSteps.map((step, index) => (
            <article className="timeline-item" key={step.title}>
              <span>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="submission-section" id="submission">
        <div>
          <p className="eyebrow">Submission Requirements</p>
          <h2>What students need to submit</h2>
        </div>
        <ul className="submission-list">
          {requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
