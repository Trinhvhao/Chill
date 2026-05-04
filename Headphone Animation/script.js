var backgrounds = document.querySelectorAll('.background');

const slider = document.querySelector('.slider-images');
const images = Array.from(slider.children);

let imageIndex = 0;

function updateSlider() {
    images.forEach(image => {
        image.classList.remove('active', 'previous', 'next', 'inactive');
    });

    images[imageIndex].classList.add('active');

    if (imageIndex - 1 >= 0) {
        images[imageIndex - 1].classList.add('previous');
    } else {
        images[images.length - 1].classList.add('previous');
    }

    if (imageIndex + 1 < images.length) {
        images[imageIndex + 1].classList.add('next');
    } else {
        images[0].classList.add('next');
    }

    images.forEach((image, index) => {
        if (index !== imageIndex && index !== (imageIndex - 1 + images.length) % images.length && index !== (imageIndex + 1) % images.length) {
            image.classList.add('inactive');
        }
    });

    backgrounds.forEach((background) => {
        background.style.opacity = 0;
    });
    if (images[imageIndex].classList.contains('active')) {
        backgrounds[imageIndex].style.opacity = 1;
    }
    imageIndex = (imageIndex + 1) % images.length;
}
updateSlider();

setInterval(updateSlider, 3000);

images[1].classList.add('next');
images[2].classList.add('inactive');
images[3].classList.add('inactive');
images[4].classList.add('previous');
images[0].classList.add('active');