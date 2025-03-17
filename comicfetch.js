document.addEventListener("DOMContentLoaded", function(){
  if(document.getElementById("bannerContainer")){
    loadComic();
  } else if(document.getElementById("projectContainer")){
    loadProjects();
  } else if(document.getElementById("viewerContainer")){
    loadViewer();
  }
});

function loadComic(){
  fetch('cradle.json')
    .then(res => res.json())
    .then(data => {
      // Check for valid comics data
      if(!data.comics || !data.comics.length) {
        console.error("No comics available in data.");
        document.getElementById("titleContainer").innerHTML = "<p>No comic data available.</p>";
        return;
      }
      const comic = data.comics[0]; // assuming first comic
      // Update banner image
      document.querySelector("#bannerContainer img").src = comic.bannerImage;
      // Update product header text
      document.getElementById("productHeader").innerHTML = `<h2>${comic.productHeaderText}</h2>`;
      // Update title container with comic details
      document.getElementById("titleContainer").innerHTML = `
        <h1>${comic.comicTitle}</h1>
        <h2>Tags: ${comic.tags.join(", ")}</h2>
        <h2> ${comic.comicDescription}</h2>
        <div class="credits">
          <p>Writers:<div class="tag">${comic.credits.writer}</div></p>
          <p>Main Artists:<div class="tag">${comic.credits.artist}</p></div>
          <p>Extra: <div class="tag">${comic.credits.extra}</div></p>
        </div>
      `;
      
      // Build volumes buttons
      let volumeHtml = "";
      comic.volumes.forEach((volume, index) => {
         volumeHtml += `<button class="volume-button" data-index="${index}">${volume.volumeTitle}</button>`;
      });
      document.getElementById("volumeContainer").innerHTML = volumeHtml;
      
      // Function to render chapters from a given volume with error handling
      function renderChapters(volume) {
        if(!volume || !Array.isArray(volume.chapters)) {
          document.getElementById("chapterContainer").innerHTML = "<p>No chapters available.</p>";
          return;
        }
        let chaptersHtml = "";
        volume.chapters.forEach(ch => {
          chaptersHtml += `
            <div class="chapter-card">
              <div class="card-text">
                <p>${ch.chapterTitle}</p>
                <p>Released On: ${ch.releaseDate}</p>
              </div>
            </div>
            <div class="card-button">
              <a href="viewer.html?chapterId=${ch.chapterId}">View</a>
            </div>
            <!-- Removed individual chapter PDF link -->
          `;
        });
        document.getElementById("chapterContainer").innerHTML = chaptersHtml;
        
        // Render the volume's PDF download link in a separate container
        if(volume.pdf) {
          document.getElementById("pdfContainer").innerHTML = `
            <div class="card-button">
              <a href="${volume.pdf}">Download Volume PDF</a>
            </div>
          `;
        } else {
          document.getElementById("pdfContainer").innerHTML = "";
        }
      }
      
      // Load the first volume by default.
      if(comic.volumes && comic.volumes.length){
         renderChapters(comic.volumes[0]);
      } else {
         document.getElementById("chapterContainer").innerHTML = "<p>No volumes available.</p>";
      }
      
      // Add event listeners for volume buttons.
      document.querySelectorAll(".volume-button").forEach(btn => {
         btn.addEventListener("click", function(){
            const idx = this.getAttribute("data-index");
            renderChapters(comic.volumes[idx]);
         });
      });
    })
    .catch(err => {
      console.error("Error loading comic:", err);
      document.getElementById("titleContainer").innerHTML = "<p>Error loading comic data.</p>";
    });
}

function loadProjects(){
  fetch('cradle.json')
    .then(res => res.json())
    .then(data => {
      if(!data.comics || !data.comics.length) {
         document.getElementById("projectContainer").innerHTML = "<p>No projects found.</p>";
         return;
      }
      let projectsHtml = "";
      data.comics.forEach(comic => {
        projectsHtml += `
          <div class="project-card-container">
            <div class="project-card">
              <img src="${comic.coverImage}" alt="${comic.comicTitle} Cover">
              <div class="project-info">
                <h2>${comic.comicTitle}</h2>
                <p>${comic.comicDescription}</p>
                <button class="view-button" onclick="location.href='comic.html'">View Product</button>
              </div>
            </div>
          </div>
        `;
      });
      document.getElementById("projectContainer").innerHTML = projectsHtml;
    })
    .catch(err => {
      console.error("Error loading projects:", err);
      document.getElementById("projectContainer").innerHTML = "<p>Error loading projects.</p>";
    });
}

function loadViewer(){
  const params = new URLSearchParams(window.location.search);
  const chapterId = params.get("chapterId");
  fetch('cradle.json')
    .then(res => res.json())
    .then(data => {
      if(!data.comics || !data.comics.length) {
         document.getElementById("viewerContainer").innerHTML = "<p>No comic data available.</p>";
         return;
      }
      const comic = data.comics[0];
      if(!chapterId){
        // No specific chapter selected: display a list of chapters
        let listHtml = "<h1>Select a Chapter</h1>";
        comic.volumes.forEach(volume => {
          listHtml += `<h2>${volume.volumeTitle}</h2>`;
          // Ensure childChaptersMeta exists before iterating
          if(Array.isArray(volume.childChaptersMeta)) {
            volume.childChaptersMeta.forEach(chMeta => {
               listHtml += `
              <div class="chapter-list-item">
                <p>${chMeta.chapterTitle} (Released: ${chMeta.releaseDate})</p>
                <a href="carousel.html?chapterId=${chMeta.chapterId}">View Carousel</a>
              </div>
             `;
            });
          } else {
            listHtml += `<p>No chapters metadata available.</p>`;
          }
        });
        document.getElementById("viewerContainer").innerHTML = listHtml;
      } else {
        // For backward compatibility, if chapterId is passed, redirect to carousel page.
        window.location.href = "carousel.html?chapterId=" + chapterId;
      }
    })
    .catch(err => {
      console.error("Error loading viewer:", err);
      document.getElementById("viewerContainer").innerHTML = "<p>Error loading viewer data.</p>";
    });
}
