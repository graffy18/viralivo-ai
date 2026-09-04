import {createClient} from '../../../lib/supabase/server';
import {createAdminClient} from '../../../lib/supabase/admin';

function svgData(text,index){const bg=['#171717','#24153b','#102a2a','#2a2110'][index%4];const safe=String(text||'').replace(/[<>&\"]/g,'');return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><rect width="100%" height="100%" fill="${bg}"/><circle cx="820" cy="330" r="260" fill="rgba(255,255,255,.07)"/><circle cx="180" cy="1500" r="360" fill="rgba(255,255,255,.05)"/><text x="80" y="1680" fill="white" font-family="Arial" font-size="42" font-weight="700">VIRALIVO AI</text><text x="80" y="1760" fill="white" opacity=".55" font-family="Arial" font-size="25">${safe.slice(0,52)}</text></svg>`)}`}

async function uploadImage(admin,userId,sceneId,bytes){
 const path=`${userId}/images/${crypto.randomUUID()}-${sceneId}.png`;
 const {error}=await admin.storage.from('viralivo-assets').upload(path,bytes,{contentType:'image/png',upsert:false,cacheControl:'31536000'});
 if(error) throw error;
 return path;
}

export async function POST(req){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return Response.json({error:'Nicht eingeloggt'},{status:401});
 const {scenes=[],projectId}=await req.json();if(!Array.isArray(scenes)||!scenes.length)return Response.json({error:'Keine Szenen'},{status:400});
 const admin=createAdminClient();const hasKey=!!process.env.OPENAI_API_KEY;const out=[];
 for(let i=0;i<scenes.length;i++){
  const s=scenes[i];let storagePath=null;let imageUrl=s.imageUrl;
  if(hasKey){
   const r=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2',prompt:`Vertical social-video visual, cinematic, realistic, no text, no logos. ${s.visualPrompt||s.caption}`,size:'1024x1536'})});
   if(!r.ok)return Response.json({error:`Image API error: ${(await r.text()).slice(0,240)}`},{status:502});
   const item=(await r.json())?.data?.[0];
   if(item?.b64_json){storagePath=await uploadImage(admin,user.id,String(s.id||i),Buffer.from(item.b64_json,'base64'));}
   else if(item?.url){imageUrl=item.url;}
  }
  if(!storagePath&&!imageUrl) imageUrl=svgData(s.visualPrompt||s.caption,i);
  if(projectId){await supabase.from('project_assets').insert({project_id:projectId,user_id:user.id,kind:'image',scene_id:String(s.id||i),storage_path:storagePath,mime_type:'image/png',metadata:{provider:storagePath?'openai-storage':'demo'}});}
  out.push({...s,imageUrl:storagePath?null:imageUrl,storagePath,provider:storagePath?'openai-storage':'fallback'});
 }
 return Response.json({demo:!hasKey,scenes:out});
}
