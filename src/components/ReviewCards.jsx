import { useRef, useState } from 'react';

const prompts = [
  'What moments in life have brought you the most happiness?',
  'What is one small thing that helped you feel at ease?',
  'Which memory would you like to carry into tomorrow?',
  'Who makes you feel most like yourself?',
  'What would you tell yourself on a difficult day?',
];

export default function ReviewCards() {
  const [page, setPage] = useState(0);
  const startX = useRef(null);
  const changePage = (delta) => setPage((value) => (value + delta + prompts.length) % prompts.length);
  return <section className="review-cards" aria-labelledby="review-heading">
    <div className="review-heading-row"><h2 id="review-heading">Review Cards</h2><span className="review-new"><i />2 new</span></div>
    <div className="review-deck" onPointerDown={(event) => { startX.current = event.clientX; event.currentTarget.setPointerCapture?.(event.pointerId); }} onPointerCancel={() => { startX.current = null; }} onPointerUp={(event) => {
      if (startX.current !== null && Math.abs(event.clientX - startX.current) > 35) changePage(event.clientX < startX.current ? 1 : -1);
      startX.current = null;
    }}>
      <img className="review-stack-art" src="/assets/profile/review-stack.svg" width="250" height="299" alt="" />
      <span className="review-card-label">Friend Note</span>
      <p className="review-question" aria-live="polite">{prompts[page]}</p>
      <img className="review-author" src="/assets/profile/review-author.svg" width="112" height="34" alt="kierrashome 🌸" />
    </div>
    <div className="review-pagination" role="group" aria-label="Review cards">
      {prompts.map((prompt, index) => <button key={prompt} aria-label={`Review card ${index + 1}`} aria-pressed={page === index} onClick={() => setPage(index)}><span /></button>)}
    </div>
  </section>;
}
