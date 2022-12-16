window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    document.body.classList.add(e.matches ? "dark" : "light");
    document.body.classList.remove(e.matches ? "light" : "dark");
});
