document.addEventListener("DOMContentLoaded", fetchAllAds);

async function fetchAllAds() {
  try {
    const res = await fetch("/api/ads/all", {
      method: "GET"
    });
    const adsList = document.querySelector("#ads_list");
    adsList.textContent = "";

    if (!res.ok) {
      adsList.textContent = "Erreur lors du chargement des annonces.";
      return;
    }

    const { ads } = await res.json();
    if (!ads || !ads.length) {
      adsList.textContent = "Aucune annonce pour le moment.";
      return;
    }

    ads.forEach(ad => {
      const wrapper = document.createElement("div");
      wrapper.className = "ad";

      const h3 = document.createElement("h3");
      h3.textContent = ad.title;
      wrapper.appendChild(h3);

      if (ad.image_url) {
        const img = document.createElement("img");
        img.src = ad.image_url;
        img.alt = "Image de l'annonce";
        img.width = 180;
        img.loading = "lazy";
        wrapper.appendChild(img);
      }

      const desc = document.createElement("p");
      desc.textContent = ad.description;
      wrapper.appendChild(desc);

      const price = document.createElement("p");
      price.textContent = `Prix : ${ad.price} €`;
      wrapper.appendChild(price);

      const location = document.createElement("p");
      location.textContent = `Lieu : ${ad.location}`;
      wrapper.appendChild(location);
      const username = document.createElement("p");
      username.textContent = `Pseudo : ${ad.users.username}`;
      wrapper.appendChild(username);

      const firstname = document.createElement("p");
      firstname.textContent = `Prénom : ${ad.users.firstname}`;
      wrapper.appendChild(firstname);

      adsList.appendChild(wrapper);
    });
  } catch (e) {
    document.querySelector("#ads_list").textContent = "Erreur inattendue.";
    console.error(e);
  }
}
