import {createClient} from '../../../../lib/supabase/server';

export async function GET(req){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return Response.json({error:"Nicht eingeloggt"},{status:401});
  const id=new URL(req.url).searchParams.get("jobId");
  if(!id) return Response.json({error:"jobId fehlt"},{status:400});
  const {data:job,error}=await supabase.from("render_jobs").select("*").eq("id",id).eq("user_id",user.id).single();
  if(error||!job) return Response.json({error:"Render-Job nicht gefunden"},{status:404});
  if(job.status!=="completed"||!job.output_path) return Response.json({error:"Video ist noch nicht fertig",status:job.status},{status:409});
  const {data,error:signError}=await supabase.storage.from("viralivo-assets").createSignedUrl(job.output_path,3600,{download:true});
  if(signError||!data?.signedUrl) return Response.json({error:"Download-Link konnte nicht erstellt werden"},{status:500});
  return Response.json({url:data.signedUrl,expiresIn:3600});
}
