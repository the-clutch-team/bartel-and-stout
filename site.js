const menuButton = document.querySelector('.menu');
const navigation = document.getElementById('nav');
function toggleNavigation(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
}
menuButton.addEventListener('click', () => toggleNavigation(!navigation.classList.contains('open')));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    toggleNavigation(false);
    menuButton.focus();
  }
});
