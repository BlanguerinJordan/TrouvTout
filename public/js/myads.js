document.addEventListener("DOMContentLoaded", fetchMyAds);

async function fetchMyAds() {
  try {
    const res = await fetch("/api/ads/myads", {
      method: "GET",
      credentials: "include",
    });
    const adsList = document.querySelector("#ads_list");
    adsList.textContent = ""; // Vide la div

    if (!res.ok) {
      adsList.textContent = "Erreur lors du chargement de vos annonces.";
      return;
    }

    const { ads } = await res.json();
    if (!ads || !ads.length) {
      adsList.textContent = "Aucune annonce trouvée.";
      return;
    }

    ads.forEach((ad) => {
      const wrapper = document.createElement("div");
      wrapper.className = "myad";

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

      adsList.appendChild(wrapper);
    });
  } catch (e) {
    document.querySelector("#ads_list").textContent = "Erreur inattendue.";
    console.error(e);
  }
}
