// script.js

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
  const topicsContainer = document.getElementById('topicsContainer');
  const selectedSectionTitle = document.getElementById('selectedSectionTitle');

  // Render sections
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

  // Default render topics for the first section
  const initialSection = Object.keys(courseData)[0];
  if (initialSection) {
    renderTopics(courseData[initialSection], initialSection);
    selectedSectionTitle.textContent = initialSection;
  }
}

function renderTopics(topics, sectionName) {
  const topicsContainer = document.getElementById('topicsContainer');
  topicsContainer.innerHTML = ''; // Clear previous topics

  topics.forEach(topic => {
    const topicDiv = document.createElement('div');
    topicDiv.classList.add('topic', 'bg-background', 'rounded-md', 'shadow-sm', 'p-4', 'flex', 'items-center', 'justify-between');

    const topicInfo = document.createElement('div');
    const topicTitle = document.createElement('h3');
    topicTitle.textContent = topic.title;
    topicTitle.classList.add('text-lg', 'font-medium');

    const playButton = document.createElement('button');
    playButton.classList.add('button-icon');
    playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>';
    playButton.addEventListener('click', () => {
      const videoPlayer = document.getElementById('videoPlayer');
      videoPlayer.src = `/videos/${sectionName}/${topic.title}.mp4`;
      videoPlayer.play();
    });

    topicInfo.appendChild(topicTitle);
    topicDiv.appendChild(topicInfo);
    topicDiv.appendChild(playButton);

    topicsContainer.appendChild(topicDiv);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSectionsAndTopics();
});
