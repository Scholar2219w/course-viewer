const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const courseDir = "D:/PreProg/WebD/Course Viewer/course";

app.use(express.static(path.join(__dirname, 'public')));
app.use('/videos', express.static(courseDir));

function processDirectory(dirPath) {
  const sections = {};
  const dirItems = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of dirItems) {
    if (item.isDirectory()) {
      const sectionPath = path.join(dirPath, item.name);
      const videoFiles = fs.readdirSync(sectionPath).filter(file => file.endsWith('.mp4'));
      const topics = [];

      for (const videoFile of videoFiles) {
        topics.push({
          title: path.parse(videoFile).name,
        });
      }
      sections[item.name] = topics;
    }
  }
  return sections;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.htm'));
});

app.get('/api/course-data', async (req, res) => {
  try {
    const courseData = await processDirectory(courseDir);
    res.json(courseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
