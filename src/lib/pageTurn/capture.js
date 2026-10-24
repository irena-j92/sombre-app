import html2canvas from 'html2canvas';

/** Only the paper is captured. Live navigation stays accessible above the canvas. */
export async function captureEntryPaper(element) {
  let timeout;
  try {
    const capture = html2canvas(element, {
    width: 393, height: 852, scale: Math.min(window.devicePixelRatio || 1, 2),
    backgroundColor: null, useCORS: true, logging: false, imageTimeout: 1500,
    // Cloning an unused WebGL canvas can claim its context as 2D permanently.
    ignoreElements: (node) => node.tagName === 'CANVAS' || node.hasAttribute('data-page-turn-overlay'),
    onclone(document, clone) {
      // Remove the mobile frame's transform and offscreen staging coordinates.
      document.body.appendChild(clone);
      Object.assign(clone.style, {
        position: 'fixed', top: '0', left: '0', width: '393px', height: '852px',
        transform: 'none', margin: '0', opacity: '1', visibility: 'visible',
      });
      const style = document.createElement('style');
      style.textContent = '* { animation: none !important; transition: none !important; }';
      document.head.appendChild(style);
    },
    });
    const result = await Promise.race([capture, new Promise((_, reject) => { timeout = window.setTimeout(() => reject(new Error('DOM capture timed out')), 1800); })]);
    const pixel = result.getContext('2d')?.getImageData(0, 0, 1, 1).data;
    if (!pixel || pixel[3] === 0) throw new Error('DOM capture returned an empty page');
    return result;
  } catch (error) {
    console.warn('Entry capture used the native canvas backup.', error);
    return paintEntryPaper(element);
  } finally { window.clearTimeout(timeout); }
}

const backgrounds = {
  saved: [[0,'#3fa3d9'],[.283654,'#d1a4d9'],[.509615,'#efd2e0'],[.769231,'#d9a0ae'],[1,'#f086a4']],
  angry: [[0,'#cb0027'],[.298122,'#fa7800'],[.561033,'#ff8d88'],[.841549,'#fee2ec'],[.95892,'#f8c6f7'],[1,'#f8c6f7']],
  happy: [[0,'#577e30'],[.35,'#439595'],[.75,'#c0df9b'],[1,'#e9e6bc']],
  sad: [[0,'#436f95'],[.35,'#3eb1b1'],[.8,'#a5eefb'],[1,'#c3d8fa']],
  embarrassed: [[0,'#cb4200'],[.3,'#fa7100'],[.65,'#ff779a'],[1,'#f4da73']],
  calm: [[0,'#68789d'],[.38,'#b39dd0'],[.65,'#de8aa1'],[1,'#c3d8fa']],
  frustrated: [[0,'#956c1b'],[.35,'#be903c'],[.65,'#e6c42d'],[1,'#f4da73']],
};

/** Native-canvas backup avoids DOM/CSS parsing restrictions in embedded previews. */
export function paintEntryPaper(element) {
  const canvas = document.createElement('canvas');
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = 393 * scale; canvas.height = 852 * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.scale(scale, scale);
  const mood = Object.keys(backgrounds).find((key) => element.classList.contains(`entry-surface-${key}`)) || 'angry';
  const colors = backgrounds[element.classList.contains('saved-entry-screen') ? 'saved' : mood];
  const gradient = ctx.createLinearGradient(0,0,0,852);
  colors.forEach(([stop,color]) => gradient.addColorStop(stop,color));
  ctx.fillStyle = gradient; ctx.fillRect(0,0,393,852);
  ctx.fillStyle = '#0000000a'; ctx.fillRect(0,0,393,852);
  const today = element.classList.contains('todays-entry-screen');
  ctx.fillStyle = '#ffffff26';
  ctx.beginPath(); ctx.roundRect(24,130,82,30,15); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.textBaseline = 'alphabetic'; ctx.fillText('PRIVATE',53,150);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = .8;
  ctx.beginPath(); ctx.roundRect(37,143,8,8,1); ctx.stroke();
  ctx.beginPath(); ctx.arc(41,143,3,Math.PI,0); ctx.stroke();
  for (const x of [316,353]) { ctx.beginPath(); ctx.arc(x,145,16,0,Math.PI*2); ctx.stroke(); }
  ctx.beginPath(); ctx.roundRect(310,141,12,8,1); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(314,139,4,2,1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(316,143);ctx.lineTo(316,147);ctx.moveTo(314,145);ctx.lineTo(318,145);ctx.stroke();
  ctx.beginPath();ctx.moveTo(348,145);ctx.lineTo(357,140);ctx.moveTo(348,145);ctx.lineTo(357,150);ctx.stroke();
  for(const [x,y] of [[348,145],[357,140],[357,150]]) {ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.stroke();}
  ctx.font = today ? '40px "Instrument Serif", Georgia, serif' : '32px Georgia, serif'; ctx.fillText(element.querySelector('h1').textContent,24,261);
  const titleWidth = ctx.measureText(element.querySelector('h1').textContent).width;
  const playX = Math.min(355,24+titleWidth+24);
  const playY = 252;
  ctx.beginPath();ctx.arc(playX,playY,11,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(playX-2,playY-5);ctx.lineTo(playX+4,playY);ctx.lineTo(playX-2,playY+5);ctx.closePath();ctx.fill();
  ctx.font = today ? '16px Arial' : '14px Arial';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '-0.25px';
  const text = element.querySelector('.entry-quote').textContent;
  let line=''; let y=297;
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > 345 && line) { ctx.fillText(line,24,y);y+=today ? 22 : 20;line=word; } else line=next;
    if (y > 520) break;
  }
  if (y <= 520) ctx.fillText(line,24,y);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  const heights=today ? [16,4,2,2,4,2,2,2,2] : [4,4,2,4,4,2,4,4,2];
  heights.forEach((height,g)=>{
    ctx.fillStyle=today ? [0,3,4].includes(g) ? '#fff' : '#ec5f2b33' : [0,3,4].includes(g) ? '#fff' : '#6a1f5933';
    for(let r=0;r<height;r++)for(let c=0;c<3;c++){
      ctx.beginPath();
      ctx.arc(22.5+g*41+c*10,757.5-r*10,2.5,0,Math.PI*2);
      ctx.fill();
    }
  });
  ctx.fillStyle='#ffffff15';ctx.fillRect(0,784,393,68);
  return canvas;
}

export function paintBookCover() {
  const canvas=document.createElement('canvas');canvas.width=393;canvas.height=852;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#f3eee5';ctx.fillRect(0,0,393,852);
  const shadow=ctx.createLinearGradient(0,0,30,0);shadow.addColorStop(0,'#ddd4c5');shadow.addColorStop(1,'#f3eee5');ctx.fillStyle=shadow;ctx.fillRect(0,0,30,852);
  ctx.fillStyle='#70675d';ctx.font='42px "Instrument Serif", Georgia, serif';ctx.textAlign='center';ctx.fillText('sombre',196.5,440);
  return canvas;
}
