enableDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    enableDarkMode(e.matches);
});

const enableDarkMode = (enable = true) => {
    document.body.classList.add(enable ? "dark" : "light");
    document.body.classList.remove(enable ? "light" : "dark");
}
