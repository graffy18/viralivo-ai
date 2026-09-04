import { Composition } from "remotion";
import { ViralivoShort } from "./ViralivoShort";
const scenes=[{id:"1",caption:"Die meisten kennen diesen Fakt nicht.",duration:3.5},{id:"2",caption:"Und genau deshalb ist er so verrückt.",duration:3.5},{id:"3",caption:"Speichere das für später.",duration:3}];
export const RemotionRoot=()=> <Composition id="ViralivoShort" component={ViralivoShort} durationInFrames={Math.round(scenes.reduce((a,s)=>a+s.duration,0)*30)} fps={30} width={1080} height={1920} defaultProps={{scenes}}/>;
