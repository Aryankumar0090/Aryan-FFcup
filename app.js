import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* 1) Replace these two values with your Supabase project values. */
const SUPABASE_URL = "PASTE_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_SUPABASE_ANON_KEY_HERE";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $=id=>document.getElementById(id);
const pages=["home","register","matches","leaderboard","rules","admin"];
window.go=(id)=>{pages.forEach(x=>$(x).classList.toggle("hidden",x!==id));document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===id));if(id==="home")loadHome();if(id==="matches")loadMatches();if(id==="leaderboard")loadBoard();if(id==="admin")loadAdmin();};
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>go(b.dataset.page));

async function loadHome(){const {count}=await sb.from("teams").select("*",{count:"exact",head:true});$("teamCount").textContent=count??0;const {data}=await sb.from("settings").select("*").eq("key","notice").maybeSingle();$("notice").textContent=data?.value||"Registration is open."}
$("regForm").onsubmit=async e=>{e.preventDefault();const team={team_name:$("team").value.trim(),captain:$("captain").value.trim(),phone:$("phone").value.trim(),player1_uid:$("p1").value.trim(),player2_uid:$("p2").value.trim(),player3_uid:$("p3").value.trim(),player4_uid:$("p4").value.trim()};const {error}=await sb.from("teams").insert(team);$("regMsg").textContent=error?("❌ "+error.message):"✅ Registration successful! Save your team name.";if(!error)e.target.reset();loadHome()};

async function loadMatches(){const {data,error}=await sb.from("matches").select("*").order("match_no");if(error){$("matchList").textContent=error.message;return}$("matchList").innerHTML=(data||[]).map(m=>`<div style="padding:12px 0;border-bottom:1px solid #273244"><b>Match ${m.match_no}</b> <span class="badge">${m.time||"TBA"}</span><p class="muted">Room ID: ${m.room_id||"Not published"}<br>Password: ${m.room_password||"Not published"}</p></div>`).join("")||"No matches published."}
async function loadBoard(){const {data,error}=await sb.from("leaderboard").select("*").order("points",{ascending:false});if(error){$("board").innerHTML=`<tr><td colspan="3">${error.message}</td></tr>`;return}$("board").innerHTML=(data||[]).map((x,i)=>`<tr><td>${i+1}</td><td>${x.team_name}</td><td>${x.points}</td></tr>`).join("")||`<tr><td colspan="3" class="muted">No scores published.</td></tr>`}

$("loginBtn").onclick=async()=>{const pass=$("adminPass").value;const {data,error}=await sb.rpc("admin_login",{p:pass});if(error||!data){$("adminMsg").textContent="❌ Wrong password";return}localStorage.setItem("afc_admin_token",data);$("adminMsg").textContent="✅ Logged in";$("adminArea").classList.remove("hidden");loadAdmin();}
async function adminFetch(path,body){return fetch(`${SUPABASE_URL}/functions/v1/admin`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${localStorage.getItem("afc_admin_token")}`},body:JSON.stringify({action:path,...body})}).then(r=>r.json())}
async function loadAdmin(){if(!localStorage.getItem("afc_admin_token"))return;const {data}=await sb.from("teams").select("*").order("created_at",{ascending:false});$("teams").innerHTML=(data||[]).map(t=>`<div style="padding:10px 0;border-bottom:1px solid #273244"><b>${t.team_name}</b><br><span class="muted">ID: ${t.id} • Captain: ${t.captain}</span></div>`).join("")||"No teams."}
$("saveNotice").onclick=async()=>{const r=await adminFetch("notice",{value:$("noticeInput").value});alert(r.ok?"Saved":"Error: "+(r.error||"failed"));loadHome()}
$("saveRooms").onclick=async()=>{const r=await adminFetch("rooms",{rooms:[{match_no:1,room_id:$("r1").value,room_password:$("p1r").value},{match_no:2,room_id:$("r2").value,room_password:$("p2r").value}]});alert(r.ok?"Saved":"Error: "+(r.error||"failed"));loadMatches()}
$("saveScore").onclick=async()=>{const r=await adminFetch("score",{team_id:$("scoreTeam").value,placement_points:Number($("placePts").value||0),kill_points:Number($("killPts").value||0)});alert(r.ok?"Score added":"Error: "+(r.error||"failed"));loadBoard()}
loadHome();