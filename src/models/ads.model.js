import * as supabaseClient from "../lib/supabaseClient.lib.js";

export async function getCategoriesModel() {
  const { data, error } = await supabaseClient.supabase
    .from("Categories")
    .select("id, name");

  if (error) {
    console.error("Erreur dans le model :", error.message);
    throw new Error("Erreur lors de la récupération des catégories");
  }

  return data;
}

export async function createAdModel({
  title,
  description,
  price,
  location,
  category_id,
  user_id,
  token,
}) {
  const supabaseToken = await supabaseClient.getSupabaseWithToken(token);

  const { data, error } = await supabaseToken
    .from("Ads")
    .insert([{ title, description, price, location, category_id, user_id }])
    .select()
    .single();

  if (error) {
    console.error("Erreur model création annonce :", error.message);
    throw new Error("Erreur création annonce");
  }

  return data;
}

export async function getUserAdsWithImage(user_id, token) {
    const supabaseToken = await supabaseClient.getSupabaseWithToken(token);
  const { data, error } = await supabaseToken
    .from("Ads")
    .select(
      `
      id,
      title,
      description,
      price,
      location,
      Images:Images!Images_ad_id_fkey(url)
    `
    )
    .eq("user_id", user_id)

    console.log(data[0].Images.url)

  if (error) throw new Error("Erreur lors de la récupération des annonces");

  // Pour chaque annonce, on ne garde que la première image (ou rien si pas d'image)
  return data.map((ad) => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    price: ad.price,
    location: ad.location,
    image_url: ad.Images && ad.Images.length > 0 ? ad.Images[0].url : null,
  }));
}

export async function getAllAdsWithImage() {
  const { data, error } = await supabaseClient.supabase
    .from("Ads")
    .select(`
      id,
      title,
      description,
      price,
      location,
      Images:Images!Images_ad_id_fkey (
        url
      )
    `)
    .order("id", { ascending: false });

  if (error) throw new Error("Erreur lors de la récupération des annonces");

  return data.map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    price: ad.price,
    location: ad.location,
    image_url: Array.isArray(ad.Images) && ad.Images.length > 0 ? ad.Images[0].url : null
  }));
}
