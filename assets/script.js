document.addEventListener('DOMContentLoaded', () => {
  const demo = document.getElementById('demo-link');
  if (demo) {
    demo.addEventListener('click', (e) => {
      e.preventDefault();
      alert('ここにデモページのリンクを設定してください。');
    });
  }
});
