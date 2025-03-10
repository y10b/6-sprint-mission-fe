import React from 'react';
import './footer.css'

function Footer() {
    return (
        <footer>
            <article className="foot">
                <div className="footer-decoration"></div>
                <section className="footer_license">
                    <div className="copy">
                        <p>&copy;codeit - 2024</p>
                    </div>
                    <div className="QA">
                        <a href="404/board/index.html">Privacy Policy</a>
                        <a href="404/market/index.html">FAQ</a>
                    </div>
                    <section className="SNS">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                            <img src="../img/ic_facebook.png" alt="Facebook" />
                        </a>
                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
                            <img src="../img/ic_twitter.png" alt="Twitter" />
                        </a>
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                            <img src="../img/ic_youtube.png" alt="YouTube" />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                            <img src="../img/ic_instagram.png" alt="Instagram" />
                        </a>
                    </section>
                </section>
            </article>
        </footer>
    );
}

export default Footer;
