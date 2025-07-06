import { getSupabaseWithToken } from "../lib/supabaseClient.lib.js";
import { CustomError } from "../utils/CustomError.util.js";

export async function getUserOwnInfos(token) {
  const supabaseToken = await getSupabaseWithToken(token);

  const { data, error } = await supabaseToken
    .from("Users")
    .select("*")
    .single();

  if (error) {
    throw new CustomError("Erreur model récupération info user", 500);
  }

  return { data };
}

export async function setUsersInformation(userInfos, token,iduser) {
  const supabaseToken = await getSupabaseWithToken(token);

  const { error } = await supabaseToken
    .from("Users")
    .update({
      username: userInfos.username,
      lastname: userInfos.lastname,
      firstname: userInfos.firstname,
      birthday_date: userInfos.birthdayDate,
      number_phone: userInfos.phoneNumber,
      location: userInfos.location,
    })
    .eq("id", iduser) // ou le champ qui contient l'id du user
    .single();

  if (error) {
    console.error("Erreur model modification user infos :", error.message);
    throw new Error("Erreur modification user infos");
  }

  return { message: "Modification réussit !" };
}
