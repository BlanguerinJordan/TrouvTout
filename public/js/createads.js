import { startInactivityLogout, handlerLogout } from "./auth.js";
import checkSession from "./session.js";
let session = null;
let currentuser = null;
let email = "";

document.addEventListener("DOMContentLoaded", async () => {
  const sessionData = await checkSession();

  if (sessionData.session === true) {
    startInactivityLogout(10);
  }
  session = sessionData.session;
  email = sessionData.email || "";
  currentuser = sessionData.currentuser || null;

  document
    .querySelector("#disconnect")
    ?.addEventListener("click", handlerLogout);

  const categorieSelect = document.querySelector("#categorie");

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des catégories");

      const categories = await response.json();
      displayCategories(categories);
    } catch (error) {
      console.error("Erreur :", error.message);
    }
  }

  function displayCategories(categories) {
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;

      categorieSelect.appendChild(option);
    });
  }
  fetchCategories();

  document
    .querySelector("#createad_form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();

      const title = document.querySelector("#title").value.trim();
      const description = document.querySelector("#description").value.trim();
      const price = parseFloat(document.querySelector("#price").value);
      const location = document.querySelector("#location").value.trim();
      const category_id = categorieSelect.value;
      const image = document.querySelector("#images").files[0];

      if (!image) {
        alert("Veuillez sélectionner une image.");
        return;
      }

      if (!title || !description || !price || !location || !category_id) {
        console.log("Merci de remplir tous les champs.");
        return;
      }

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("category_id", category_id);
      formData.append("image", image);

      try {
        const response = await fetch("/api/ads/createads", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Erreur inconnue");
        }

        const { message, ad, imageUrl } = await response.json();
        console.log(message);
        console.log("Annonce créée :", ad);
        console.log("Image URL :", imageUrl);
        window.location.href = "/TrouvTout/myads";
      } catch (error) {
        console.error("Erreur lors de la création :", error.message);
        console.log("Erreur : ", error.message);
      }
    });
});
