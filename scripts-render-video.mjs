import fs from 'node:fs';
import path from 'node:path';
import {createClient} from '@supabase/supabase-js';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';

const jobId=process.argv[2];
if(!jobId) throw new Error('Usage: npm run render:worker -- <jobId>');
const key=process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,key,{auth:{autoRefreshToken:false,persistSession:false}});
const {data:job,error}=await supabase.from('render_jobs').select('*').eq('id',jobId).single();
if(error||!job) throw new Error('Render job not found');
await supabase.from('render_jobs').update({status:'rendering',error:null}).eq('id',jobId);
try{
 const scenes=job.metadata?.scenes||[];
 const assets=await supabase.from('project_assets').select('*').eq('project_id',job.project_id);
 const enriched=await Promise.all(scenes.map(async s=>{
  const a=(assets.data||[]).find(x=>x.kind==='image'&&String(x.scene_id)===String(s.id));
  let imageUrl=s.imageUrl||null;
  if(a?.storage_path){const signed=await supabase.storage.from('viralivo-assets').createSignedUrl(a.storage_path,3600);imageUrl=signed.data?.signedUrl||null;}
  return {...s,imageUrl};
 }));
 const entry=path.resolve('src/remotion/index.js');
 const serveUrl=await bundle({entryPoint:entry,webpackOverride:c=>c});
 const composition=await selectComposition({serveUrl,id:'ViralivoShort',inputProps:{scenes:enriched}});
 fs.mkdirSync('out',{recursive:true});const out=path.resolve('out',`viralivo-${jobId}.mp4`);
 await renderMedia({composition,serveUrl,codec:'h264',outputLocation:out,inputProps:{scenes:enriched}});
 const storagePath=`${job.user_id}/videos/${jobId}.mp4`;
 const stream=fs.createReadStream(out);
 const upload=await supabase.storage.from('viralivo-assets').upload(storagePath,stream,{contentType:'video/mp4',upsert:true,cacheControl:'31536000'});
 if(upload.error) throw upload.error;
 await supabase.from('project_assets').insert({project_id:job.project_id,user_id:job.user_id,kind:'video',storage_path:storagePath,mime_type:'video/mp4',metadata:{renderJobId:jobId}});
 await supabase.from('render_jobs').update({status:'completed',output_path:storagePath,finished_at:new Date().toISOString()}).eq('id',jobId);
 await supabase.from('projects').update({status:'completed'}).eq('id',job.project_id);
 console.log(JSON.stringify({jobId,status:'completed',storagePath}));
}catch(e){await supabase.from('render_jobs').update({status:'failed',error:String(e?.message||e),finished_at:new Date().toISOString()}).eq('id',jobId);throw e;}
