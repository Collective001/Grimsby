// The map moves once on arrival, or when explicitly replayed. Reading needs no JS.
const sheet = document.querySelector('.map-sheet');
if (sheet) {
  const play = () => { sheet.classList.remove('play'); void sheet.offsetWidth; sheet.classList.add('play'); };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(items => {
      if (items.some(item => item.isIntersecting)) { play(); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(sheet);
  } else play();
  sheet.querySelector('.replay').addEventListener('click', play);
}
