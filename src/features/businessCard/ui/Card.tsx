import React, {useState} from "react";
import avatar from "../../../shared/icons/avatar_home-page.png"
import "./index.scss";

export const Card = () => {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    const email = 'iasakov1978@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      const el = document.createElement('textarea');
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy'); // Fallback using deprecated method
      document.body.removeChild(el);

      setEmailCopied(true);
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    }
  };

  return (
    <div className={'wrapper'}>
      {/* Parallax Background */}
      <div className={'parallax-bg'}/>
      <div className={'overlay'}/>
      {/* Main Content Card */}
      <div className={'card'}>
        {/* Profile Picture */}
        <div className={'profile-picture-container'}>
          <img
            src={avatar}
            alt="Фото профиля"
            className="profile-picture"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/120x120/a78bfa/ffffff?text=Ваше+Фото";
            }}
          />
          <div className={'profile-picture-border'}/>
        </div>
        {/* Name and Title */}
        <h1 className={'name'}>
          7ty2ryz3
        </h1>
        <p className="title">
          Junior Frontend Developer
        </p>
        {/* About Section */}
        <div className={'about-text-container'}>
          <p className="about-text">
            Страстно увлечен созданием интуитивно понятных и красивых веб-интерфейсов.
            Использую <strong className={'highlight'}>React</strong>, <strong
            className={'highlight'}>TypeScript</strong> и <strong className={'highlight'}>SCSS</strong> для превращения идей в надежный и адаптивный код.
            Всегда готов к новым вызовам и стремлюсь к профессиональному росту.
          </p>
        </div>
        {/* Skills Section */}
        <div className={'skills-container'}>
          <h2 className={'skills-heading'}>
            Ключевые навыки:
          </h2>
          <div className={'skills-list'}>
            <span className={'skill-tag'}>
              React
            </span>
            <span className={'skill-tag'}>
              TypeScript
            </span>
            <span className={'skill-tag'}>
              Redux Toolkit
            </span>
            <span className={'skill-tag'}>
              NodeJS
            </span>
            <span className={'skill-tag'}>
              ExpressJS
            </span>
            <span className={'skill-tag'}>
              SCSS
            </span>
            <span className={'skill-tag'}>
              Tailwind CSS
            </span>
            <span className={'skill-tag'}>
              HTML5
            </span>
            <span className={'skill-tag'}>
              CSS3
            </span>
            <span className={'skill-tag'}>
              JavaScript (ES6+)
            </span>
            <span className={'skill-tag'}>
              Git
            </span>
            <span className={'skill-tag'}>
              Docker
            </span>
          </div>
        </div>
        {/* Social Links */}
        <div className={'social-links'}>
          <a
            href="https://github.com/seb1g"
            target="_blank"
            rel="noopener noreferrer"
            className={'social-link'}>
            GitHub
          </a>
          <a
            href="https://t.me/Seb1Glory"
            target="_blank"
            rel="noopener noreferrer"
            className={'social-link'}>
            Telegram
          </a>
          <a
            href="/mail"
            target="_blank"
            rel="noopener noreferrer"
            className={'social-link'}
          >
            Anemone Mail
          </a>
          {/*<a*/}
          {/*  href="https://your-portfolio.com"*/}
          {/*  target="_blank"*/}
          {/*  rel="noopener noreferrer"*/}
          {/*  className={'social-link'}>*/}
          {/*  Портфолио*/}
          {/*</a>*/}
        </div>
        {/* Contact Email */}
        <div className={'contact-section'}>
          <p className={'contact-label'}>
            Contact With Me:
          </p>
          <button onClick={handleCopyEmail} className={'email-button'}>
            iasakov1978@gmail.com
          </button>
          {emailCopied && (
            <div className="copy-message">
              Email скопирован!
            </div>
          )}
        </div>
      </div>
      {/* Keyframes for animations (still required in a <style> tag) */}
      <style>{`
                /* Font import for Inter, typically done in index.html or global CSS */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                /* Keyframes */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideInDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes fadeInUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                /* Animation classes */
                /*.animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .animate-slide-in-down {
                    animation: slideInDown 0.6s ease-out forwards;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.7s ease-out forwards;
                }*/
            `}</style>
    </div>
  );
}
