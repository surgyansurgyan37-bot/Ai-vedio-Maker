import OpenAI from "openai";

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST required"});
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:"OPENAI_API_KEY is not configured on Vercel."});
  try{
    const {text}=req.body||{};
    if(!text) return res.status(400).json({error:"Text जरूरी है।"});
    const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const speech=await client.audio.speech.create({
      model:"gpt-4o-mini-tts", voice:"alloy", input:text, response_format:"mp3"
    });
    const buf=Buffer.from(await speech.arrayBuffer());
    res.setHeader("Content-Type","audio/mpeg");
    res.setHeader("Content-Disposition",'inline; filename="ai-voice.mp3"');
    return res.send(buf);
  }catch(e){return res.status(500).json({error:e.message});}
}
