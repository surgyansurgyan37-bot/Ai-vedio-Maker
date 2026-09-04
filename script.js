import OpenAI from "openai";

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST required"});
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:"OPENAI_API_KEY is not configured on Vercel."});
  try{
    const {topic,language="Hindi",duration="5 मिनट"}=req.body||{};
    if(!topic) return res.status(400).json({error:"Topic जरूरी है।"});
    const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const r=await client.responses.create({
      model:"gpt-5.6-luna",
      input:`Create a YouTube video script in ${language} about "${topic}" for approximately ${duration}. Include a hook, introduction, scene-by-scene narration, useful information, and ending. Plain text only.`
    });
    return res.json({script:r.output_text});
  }catch(e){return res.status(500).json({error:e.message});}
}
