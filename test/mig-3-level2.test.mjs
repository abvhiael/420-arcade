import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const catalog=JSON.parse(readFileSync(new URL('../config/arcade-game-identities.json',import.meta.url)));
const sdkPath=process.env.MIG3_SDK_PATH;
if(!sdkPath)throw new Error('MIG3_SDK_PATH must resolve version-pinned Genesis SDK');
const sdk=await import(pathToFileURL(sdkPath).href);
test('MIG-3 version-pinned integration recognizes unregistered Arcade authority',()=>{
 assert.equal(sdk.GAMING_SDK_COMPAT_VERSION,'0.1.0');
 assert.equal(sdk.GAMING_GAME_IDS.madBuds,null);
 assert.equal(catalog.authority,'LOCAL_CANDIDATE_ONLY');
 assert.equal(catalog.registrationStatus,'NOT_REGISTERED');
 assert.ok(catalog.games.length>0);
 for(const game of catalog.games){assert.equal(game.registration,'UNREGISTERED');assert.equal(game.walletRequiredForCore,false);}
});
test('MIG-3 unregistered candidates may not mint authority or impersonate registration',()=>{
 assert.throws(()=>sdk.validateEntitlement420({gameId:'arcade',profileId:'p',entitlementId:'e',entitlementType:'t',contentId:'c',active:true},'canonical'),TypeError);
 assert.throws(()=>sdk.validateRewardClaim420({gameId:'arcade',profileId:'p',claimId:'c',evidenceHash:'0x'+'a'.repeat(64),network:'testnet'},'canonical'),TypeError);
});
test('MIG-3 wallet optional and offline reward denial for local candidates',async()=>{
 for(const game of catalog.games){const conn=sdk.createGameConnection420({gameId:game.gameId,adapter:sdk.createOfflineGamingAdapter420({gameId:game.gameId})});assert.equal(await conn.connect(),'guest');assert.equal(await conn.getEntitlement({profileId:'p',entitlementId:'e'}),null);const claim={gameId:game.gameId,profileId:'p',claimId:'r',evidenceHash:'0x'+'a'.repeat(64),network:'testnet'};assert.equal((await conn.submitRewardClaim(claim)).status,'unavailable');}
});
test('MIG-3 provider simulator deduplicates identical submissions without local ledger authority',async()=>{
 const game=catalog.games[0];const seen=new Set();const adapter={gameId:game.gameId,async connect(){return {status:'connected'}},async entitlement(){return null},async claim(v){sdk.validateRewardClaim420(v,game.gameId);if(seen.has(v.claimId))return {status:'duplicate'};seen.add(v.claimId);return {status:'accepted'}}};
 const conn=sdk.createGameConnection420({gameId:game.gameId,adapter});const claim={gameId:game.gameId,profileId:'p',claimId:'r',evidenceHash:'0x'+'b'.repeat(64),network:'testnet'};assert.equal((await conn.submitRewardClaim(claim)).status,'accepted');assert.equal((await conn.submitRewardClaim(claim)).status,'duplicate');assert.equal(seen.size,1);
});
