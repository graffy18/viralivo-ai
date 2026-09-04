import {createClient} from '../../../lib/supabase/server';
import {createAdminClient} from '../../../lib/supabase/admin';
export async function POST(req){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return Response.json({error:'Nicht eingeloggt'},{status:401});
 const {text,projectId}=await req.json();if(!text)return Response.json({error:'Kein Text'},{status:400});
 if(!process.env.OPENAI_API_KEY)return new Response(Buffer.from('DEMO AUDIO'),{headers:{'Content-Type':'audio/mpeg','Content-Disposition':'attachment; filename="viralivo-demo.mp3"'}});
 const r=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_TTS_MODEL||'gpt-4o-mini-tts',voice:process.env.OPENAI_TTS_VOICE||'alloy',input:text,response_format:'mp3'})});
 if(!r.ok)return Response.json({error:`TTS error: ${(await r.text()).slice(0,240)}`},{status:502});
 const bytes=Buffer.from(await r.arrayBuffer());let storagePath=null;
 if(projectId){const admin=createAdminClient();storagePath=`${user.id}/audio/${crypto.randomUUID()}.mp3`;const {error}=await admin.storage.from('viralivo-assets').upload(storagePath,bytes,{contentType:'audio/mpeg',upsert:false,cacheControl:'31536000'});if(error)return Response.json({error:error.message},{status:500});await supabase.from('project_assets').insert({project_id:projectId,user_id:user.id,kind:'audio',storage_path:storagePath,mime_type:'audio/mpeg',metadata:{provider:'openai'}});}
 return new Response(bytes,{headers:{'Content-Type':'audio/mpeg','Content-Disposition':'attachment; filename="viralivo-voiceover.mp3"','X-Viralivo-Storage-Path':storagePath||''}});
}
