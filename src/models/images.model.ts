import {supabaseClient} from '../lib/index.js';

export async function uploadImage({ file, ad_id, token }:{file:Express.Multer.File,ad_id:string,token:string}) {
  const supabase = supabaseClient.getSupabaseWithToken(token);
  const { data: sessionUser, error: userError } = await supabase.auth.getUser();
  console.log('User ID via supabase.auth.getUser():', sessionUser?.user?.id, 'Error:', userError);

  const fileExt = file.originalname.split('.').pop();
  const fileName = `${ad_id}-${Date.now()}.${fileExt}`;
  const filePath = `ads/${ad_id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('ads-images')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (uploadError) {
    console.error('Erreur upload images :', uploadError.message);
    throw new Error('Erreur upload images');
  }

  const { data } = supabase.storage.from('ads-images').getPublicUrl(filePath);

  return data.publicUrl;
}

export async function insertImageRecord({ ad_id, url, token }:{ad_id:string,url:string,token:string}) {
    
  const supabase = await supabaseClient.getSupabaseWithToken(token);
  const { error } = await supabase
    .from('Images')
    .insert([{ ad_id, url, uploaded_at: new Date().toISOString() }]);

  if (error) {
    console.error('Erreur insertion image :', error.message);
    throw new Error('Erreur insertion image');
  }
}
