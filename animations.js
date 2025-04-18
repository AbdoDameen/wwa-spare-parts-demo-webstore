document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.item-card');
    elements.forEach((element, index) => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.5s ease-out ${index * 0.2}s, transform 0.5s ease-out ${index * 0.2}s`;

        setTimeout(() => {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }, 200 + index * 200);
    });
});
