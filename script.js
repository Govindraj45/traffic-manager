const videoPlayer = document.getElementById('videoPlayer');
const trafficLights = document.querySelectorAll('.traffic-light');

// Video paths
const videoPaths = [
    "vids/cars.mp4",
    "vids/23712-337108764_medium.mp4"
];

let currentVideoIndex = 0;

// Function to update traffic lights
function updateTrafficLights(activeIndex) {
    trafficLights.forEach((light, index) => {
        const redLight = light.querySelector('.light.red');
        const yellowLight = light.querySelector('.light.yellow');
        const greenLight = light.querySelector('.light.green');

        // Reset all lights
        redLight.classList.remove('active');
        yellowLight.classList.remove('active');
        greenLight.classList.remove('active');

        // Set active light
        if (index === activeIndex) {
            greenLight.classList.add('active');
        } else {
            redLight.classList.add('active');
        }
    });
}

// Function to handle video playback
function playNextVideo() {
    // Turn all signals red before switching
    trafficLights.forEach(light => {
        light.querySelector('.light.green').classList.remove('active');
        light.querySelector('.light.red').classList.add('active');
    });
    
    // Update to next video
    currentVideoIndex = (currentVideoIndex + 1) % videoPaths.length;
    videoPlayer.src = videoPaths[currentVideoIndex];
    
    // Wait for video to load
    videoPlayer.onloadeddata = () => {
        videoPlayer.play().then(() => {
            // Update traffic lights after video starts playing
            updateTrafficLights(currentVideoIndex);
        }).catch(error => {
            console.error('Error playing video:', error);
            // Try next video if current one fails
            setTimeout(playNextVideo, 1000);
        });
    };
}

// Video event handlers
videoPlayer.addEventListener('ended', () => {
    console.log('Video ended, switching to next video');
    playNextVideo();
});

videoPlayer.addEventListener('error', (e) => {
    console.error('Video error:', e);
    playNextVideo();
});

// Initialize the first video
function initializeVideo() {
    videoPlayer.src = videoPaths[0];
    videoPlayer.onloadeddata = () => {
        videoPlayer.play().then(() => {
            updateTrafficLights(0);
        }).catch(error => {
            console.error('Error playing initial video:', error);
            setTimeout(playNextVideo, 1000);
        });
    };
}

// Start the application
initializeVideo();

// Handle window closing
window.addEventListener('beforeunload', () => {
    videoPlayer.pause();
    videoPlayer.src = '';
}); 