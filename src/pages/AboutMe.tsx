import './AboutMe.css';

const AboutMe = () => {
  // Test Git config
  return (
    <section className="about-container">
      <h1 className="about-title">About Me</h1>
      <p>
        I'm a software developer with a background in computer engineering and a master's in
        informatics, currently working at a bank. I build web applications with a focus on clean
        architecture, maintainability, and developer experience.
      </p>
      <p>
        My primary stack includes <strong>TypeScript</strong>, <strong>React</strong>,{' '}
        <strong>Node.js</strong>, and <strong>PostgreSQL</strong>. I'm also comfortable with CI/CD
        workflows, Docker, and cloud infrastructure.
      </p>
      <p>Outside of work, I enjoy running, strength training, and Brazilian jiu-jitsu.</p>
      <p>
        I'm open to challenging projects that demand thoughtful engineering and cross-functional
        collaboration.
      </p>
    </section>
  );
};

export default AboutMe;
