import { Client, Events, GatewayIntentBits, Partials, REST, Routes } from 'discord.js'
import {ReturnStatusCode , ReturnStatusMessage} from '../enum/enum'
const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ] 
});
const rest = new REST().setToken(DISCORD_TOKEN?DISCORD_TOKEN:'');
client.login(DISCORD_TOKEN);

export async function sendDm(toClientId:string,message:string) {
    try{
      const result = await client.users.send(toClientId,message);
      console.log(result)
      if(result.id){
        return {
          code:ReturnStatusCode.success,
          message:ReturnStatusMessage.SUCCESS
        }
      }
      return {
        code:ReturnStatusCode.error,
        message:ReturnStatusMessage.FAIL
      }
    }catch (e){
      console.error(e)
      return {
        code:ReturnStatusCode.error,
        message:ReturnStatusMessage.FAIL
      }
    }
}