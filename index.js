

async function fetchNews(category = "general") {
    try {
      const response = await fetch(`http://localhost:3000/top-articles?category=${category}`);
      const data = await response.json();
      console.log(data);
      populateNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }
  //listens for changes in the dropdown and passes the value of the selected dropdown to fetchnews to get the appropriate data
  document.getElementById("news-category").addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    // Fetch news based on the selected category
    fetchNews(selectedCategory);
  });

  function populateNews(data) {
    const bestOfDay = data[0];
    document.querySelector(".best-of-the-day-title").textContent =
    bestOfDay.title;
    document.querySelector(".best-of-the-day-image").src = bestOfDay.image;
    document.querySelector(".best-of-the-day-content").innerHTML =
    bestOfDay.summary;

    const recommendedList = document.querySelector(".recommended-list");
    recommendedList.innerHTML = "";
    data.slice(1, 5).forEach((newsItem) => {
      const url = new URL(newsItem.link);
      // Extract the hostname (e.g., www.ndtv.com) and remove the 'www.' prefix if present
      let domain = url.hostname.replace(/^www\./, '');
      const domainPeriodIndex = domain.lastIndexOf('.')
      //removes anything extra that might have come in the domain name
      domain = domainPeriodIndex !== -1 ? domain.substring(0, domainPeriodIndex).trim() : domain;
      const title = newsItem.title;
      const lastColonIndex = title.lastIndexOf(':');
      //removes everything after the last ':' and last '-' in the title of the article to provide for better formatting
      let cleanedTitle = lastColonIndex !== -1 ? title.substring(0, lastColonIndex).trim() : title;
      const lastHyphenIndex = title.lastIndexOf('-');
      cleanedTitle = lastHyphenIndex !== -1 ? cleanedTitle.substring(0, lastHyphenIndex).trim() : cleanedTitle;
      
      const listItem = `
          <li>
            <a href="${newsItem.link}" class="flex items-center space-x-4 md:space-x-2">
              <img src="${newsItem.image}" alt="Article Image" class="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p style="font-size: 14px;font-weight: bold;" class="text-lg md:text-base xs:text-xs font-bold">${cleanedTitle}</p>
                <p class="text-xs">Source : ${domain}</p>
              </div>
            </a>
          </li>`;
          
        recommendedList.innerHTML += listItem;

    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document
      .getElementById("news-category")
      .addEventListener("change", (event) => {
        fetchNews(event.target.value);
      });

    fetchNews();
  });