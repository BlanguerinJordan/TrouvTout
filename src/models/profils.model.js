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

export async function setUsersInformation(userInfos, token, iduser) {
  const supabaseToken = await getSupabaseWithToken(token);

  const updateObj = {};
  if ("username" in userInfos) updateObj.username = userInfos.username;
  if ("lastname" in userInfos) updateObj.lastname = userInfos.lastname;
  if ("firstname" in userInfos) updateObj.firstname = userInfos.firstname;
  if ("birthdayDate" in userInfos)
    updateObj.birthday_date = userInfos.birthdayDate;
  if ("phoneNumber" in userInfos)
    updateObj.number_phone = userInfos.phoneNumber;
  if ("location" in userInfos) updateObj.location = userInfos.location;

  // Si aucun champ à updater, on renvoie une erreur
  if (Object.keys(updateObj).length === 0) {
    throw new Error("Aucune donnée à mettre à jour");
  }

  const { error } = await supabaseToken
    .from("Users")
    .update(updateObj)
    .eq("id", iduser)
    .single();

  if (error) {
    console.error("Erreur model modification user infos :", error.message);
    throw new Error("Erreur modification user infos");
  }

  return { message: "Modification réussit !" };
}
