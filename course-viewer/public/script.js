async function fetchCourseData() {
  try {
    const response = await fetch('/api/course-data');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const courseData = await response.json();
    return courseData;
  } catch (error) {
    console.error('Error fetching course data:', error);
    return {};
  }
}

async function renderSectionsAndTopics() {
  const courseData = await fetchCourseData();
  const sectionsContainer = document.getElementById('sectionsContainer');
  const selectedSectionTitle = document.getElementById('selectedSectionTitle');

  Object.keys(courseData).forEach(section => {
    const button = document.createElement('button');
    button.textContent = section;
    button.classList.add('block', 'w-full', 'text-left', 'rounded-md', 'px-4', 'py-2', 'hover:bg-muted', 'transition-colors');
    button.classList.add('text-muted-foreground');
    button.addEventListener('click', () => {
      renderTopics(courseData[section], section);
      selectedSectionTitle.textContent = section;
    });
    sectionsContainer.appendChild(button);
  });

  const initialSection = Object.keys(courseData)[0];
  if (initialSection) {
    renderTopics(courseData[initialSection], initialSection);
    selectedSectionTitle.textContent = initialSection;
  }
}

function renderTopics(topics, sectionName) {
  const topicsContainer = document.getElementById('topicsContainer');
  topicsContainer.innerHTML = '';

  topics.forEach(topic => {
    const topicDiv = document.createElement('div');
    topicDiv.classList.add('topic', 'bg-background', 'rounded-md', 'shadow-sm', 'p-4', 'flex', 'flex-col', 'space-y-2');

    const topicInfo = document.createElement('div');
    topicInfo.classList.add('flex', 'items-center', 'justify-between');
    const topicTitle = document.createElement('h3');
    topicTitle.textContent = topic.title;
    topicTitle.classList.add('text-lg', 'font-medium', 'cursor-pointer');

    const playButton = document.createElement('button');
    playButton.classList.add('button-icon');
    playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>';

    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container', 'hidden', 'w-full');
    const videoSource = `/videos/${sectionName}/${topic.title}.mp4`;
    videoContainer.innerHTML = `
      <video class="w-full rounded-md shadow-sm" controls>
        <source src="${videoSource}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
    console.log('Video source:', videoSource);

    topicTitle.addEventListener('click', () => toggleVideoPlayer(videoContainer, topicsContainer));
    playButton.addEventListener('click', () => toggleVideoPlayer(videoContainer, topicsContainer));

    topicInfo.appendChild(topicTitle);
    topicInfo.appendChild(playButton);
    topicDiv.appendChild(topicInfo);
    topicDiv.appendChild(videoContainer);

    topicsContainer.appendChild(topicDiv);
  });
}

function toggleVideoPlayer(videoContainer, topicsContainer) {
  const currentlyOpen = topicsContainer.querySelector('.video-container:not(.hidden)');
  if (currentlyOpen && currentlyOpen !== videoContainer) {
    currentlyOpen.classList.add('hidden');
    const videoElement = currentlyOpen.querySelector('video');
    videoElement.pause();
  }
  videoContainer.classList.toggle('hidden');

  if (!videoContainer.classList.contains('hidden')) {
    const videoElement = videoContainer.querySelector('video');
    videoElement.play();
  } else {
    const videoElement = videoContainer.querySelector('video');
    videoElement.pause();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderSectionsAndTopics();
});
