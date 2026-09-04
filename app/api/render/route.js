import {createClient} from '../../../lib/supabase/server';
export async function POST(req){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return Response.json({error:'Nicht eingeloggt'},{status:401});
 const body=await req.json();const {projectId,scenes=[]}=body;if(!projectId||!scenes.length)return Response.json({error:'projectId und Szenen erforderlich'},{status:400});
 const {data:project,error:pe}=await supabase.from('projects').select('id').eq('id',projectId).eq('user_id',user.id).single();if(pe||!project)return Response.json({error:'Projekt nicht gefunden'},{status:404});
 const {data:job,error}=await supabase.from('render_jobs').insert({project_id:projectId,user_id:user.id,status:'queued',metadata:{scenes}}).select().single();if(error)return Response.json({error:error.message},{status:500});
 await supabase.from('projects').update({status:'render_queued'}).eq('id',projectId);
 return Response.json({jobId:job.id,status:'queued',message:'Render-Job erstellt. Starte den Worker mit npm run render:worker -- <jobId>.'});
}
