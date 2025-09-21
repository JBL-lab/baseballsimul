// ----------------------
// 팀 리스트
// ----------------------
let JBL = ["난하지도", "안소시스", "신사식약", "아세리미트", "신여한계",
           "서강로간", "부서시작", "마성엑설", "파천바이글", "지도지누"];

let NGL = ["지도제두", "시스대학야구팀", "지도대학야구팀", "동소아일랜드",
           "신사프로야구연맹", "로간유스팀", "리미트USS", "시그마지도중앙",
           "부서구청야구팀", "엑설UBT"];

// ----------------------
// 유틸 함수
// ----------------------
function randomScore() {
  return Math.floor(Math.random() * 13); // 0~12 점수
}

function simulateLeague(teams) {
  let records = {};
  teams.forEach(team => {
    records[team] = {W:0, L:0, D:0, RS:0, RA:0};
  });

  for (let i=0; i<teams.length; i++) {
    for (let j=i+1; j<teams.length; j++) {
      let t1 = teams[i], t2 = teams[j];
      let s1 = randomScore(), s2 = randomScore();

      records[t1].RS += s1; records[t1].RA += s2;
      records[t2].RS += s2; records[t2].RA += s1;

      if (s1 > s2) { records[t1].W++; records[t2].L++; }
      else if (s2 > s1) { records[t2].W++; records[t1].L++; }
      else { records[t1].D++; records[t2].D++; }
    }
  }

  let table = Object.entries(records).map(([team, rec]) => {
    let winPct = rec.W + rec.L > 0 ? (rec.W / (rec.W+rec.L)).toFixed(3) : 0.000;
    return {Team: team, G: rec.W+rec.L+rec.D, ...rec, WinPct: parseFloat(winPct), RD: rec.RS - rec.RA};
  });

  table.sort((a,b) => b.WinPct - a.WinPct || b.W - a.W || b.RD - a.RD);
  return table;
}

function playoff(teamA, teamB) {
  let s1 = randomScore(), s2 = randomScore();
  while (s1 === s2) { s1 = randomScore(); s2 = randomScore(); } // 무승부 방지
  return {winner: s1 > s2 ? teamA : teamB, loser: s1 > s2 ? teamB : teamA, score: `${teamA} ${s1} : ${s2} ${teamB}`};
}

// ----------------------
// 시즌 전체 시뮬레이션
// ----------------------
function simulateSeason() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  // JBL & NGL 리그
  let jblTable = simulateLeague(JBL);
  let nglTable = simulateLeague(NGL);

  // 결과 표시
  resultsDiv.innerHTML += `<h2>🏆 JBL 리그 순위</h2>${makeTable(jblTable)}`;
  resultsDiv.innerHTML += `<h2>🏆 NGL 리그 순위</h2>${makeTable(nglTable)}`;

  // 승강전
  let playoffResults = "<h2>⚔️ 승강 플레이오프</h2>";

  // JBL 10위 vs NGL 1위
  let r1 = playoff(jblTable[jblTable.length-1].Team, nglTable[0].Team);
  playoffResults += `<div class="result">JBL 10위 vs NGL 1위 → ${r1.score}, 승자: ${r1.winner}</div>`;

  // JBL 8위 vs 9위
  let r2 = playoff(jblTable[7].Team, jblTable[8].Team);
  playoffResults += `<div class="result">JBL 8위 vs 9위 → ${r2.score}, 승자: ${r2.winner}</div>`;

  // NGL 2위 vs 3위
  let r3 = playoff(nglTable[1].Team, nglTable[2].Team);
  playoffResults += `<div class="result">NGL 2위 vs 3위 → ${r3.score}, 승자: ${r3.winner}</div>`;

  // 최종 결정전
  let r4 = playoff(r2.loser, r3.winner);
  playoffResults += `<div class="result">JBL 패자 vs NGL 승자 → ${r4.score}, 승자: ${r4.winner}</div>`;

  resultsDiv.innerHTML += playoffResults;

  // 팀 갱신
  if (r1.winner === nglTable[0].Team) {
    JBL[JBL.indexOf(r1.loser)] = r1.winner;
    NGL[NGL.indexOf(r1.winner)] = r1.loser;
  }
  if (r4.winner === r3.winner) {
    JBL[JBL.indexOf(r2.loser)] = r4.winner;
    NGL[NGL.indexOf(r4.winner)] = r2.loser;
  }

  // 최종 팀 출력
  resultsDiv.innerHTML += `<h2>📋 다음 시즌 리그 구성</h2>`;
  resultsDiv.innerHTML += `<div class="result"><b>JBL:</b> ${JBL.join(", ")}</div>`;
  resultsDiv.innerHTML += `<div class="result"><b>NGL:</b> ${NGL.join(", ")}</div>`;
}

// ----------------------
// 표 그리기 함수
// ----------------------
function makeTable(table) {
  let html = "<table><tr><th>순위</th><th>팀</th><th>경기</th><th>승</th><th>패</th><th>무</th><th>승률</th><th>득점</th><th>실점</th><th>득실차</th></tr>";
  table.forEach((row,i) => {
    html += `<tr><td>${i+1}</td><td>${row.Team}</td><td>${row.G}</td><td>${row.W}</td><td>${row.L}</td><td>${row.D}</td><td>${row.WinPct}</td><td>${row.RS}</td><td>${row.RA}</td><td>${row.RD}</td></tr>`;
  });
  html += "</table>";
  return html;
}
