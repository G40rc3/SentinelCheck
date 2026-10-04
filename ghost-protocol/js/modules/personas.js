document.addEventListener('DOMContentLoaded', () => { renderNav('Persona Generator'); renderSaved(); });

const DATA = {
  british: {
    male: ['James','Oliver','Harry','Jack','George','Charlie','Thomas','Noah','William','Liam','Daniel','Ben','Samuel','Joseph','Edward','Henry','Luke','Ethan','Ryan','Adam'],
    female: ['Olivia','Amelia','Isla','Ava','Emily','Poppy','Isabella','Ella','Mia','Freya','Lily','Sophie','Grace','Evie','Alice','Florence','Daisy','Harriet','Rosie','Imogen'],
    neutral: ['Charlie','Alex','Frankie','Morgan','Sam','Jamie','Robin','Skyler','Avery','Sasha'],
    last: ['Smith','Jones','Williams','Taylor','Brown','Davies','Evans','Wilson','Thomas','Roberts','Johnson','Robinson','Walker','Wright','Thompson','White','Hughes','Edwards','Green','Hall']
  },
  american: {
    male: ['Liam','Noah','Oliver','Elijah','James','William','Benjamin','Lucas','Henry','Alexander','Mason','Ethan','Daniel','Jacob','Logan','Jackson','Sebastian','Michael','Owen','Samuel'],
    female: ['Emma','Olivia','Ava','Sophia','Isabella','Charlotte','Amelia','Mia','Harper','Evelyn','Abigail','Emily','Ella','Elizabeth','Camila','Luna','Sofia','Avery','Mila','Aria'],
    neutral: ['Riley','Jordan','Morgan','Taylor','Casey','Quinn','Reese','Blake','Peyton','River'],
    last: ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Martinez','Wilson','Anderson','Taylor','Thomas','Hernandez','Moore','Martin','Jackson','Thompson','White','Lopez']
  },
  european: {
    male: ['Luca','Matteo','Leon','Julian','Elias','Jonas','Finn','Erik','Lars','Marco','Sven','Axel','Kai','Tobias','Felix','Lukas','Hans','Nico','Diego','Emil'],
    female: ['Sofia','Emma','Mia','Anna','Laura','Julia','Marie','Sara','Elena','Clara','Lea','Nora','Ingrid','Astrid','Freya','Maja','Elin','Sigrid','Chloe','Lena'],
    neutral: ['Alex','Robin','Sasha','Kim','Casey','Morgan','Remy','River','Avery','Sam'],
    last: ['Müller','Schmidt','Garcia','Martin','Bernard','Rossi','Ferrari','Bianchi','Andersen','Jensen','Larsen','Hansen','Nilsson','Eriksson','Svensson','Johansson','Fischer','Weber','Meyer','Wagner']
  },
  random: {
    male: ['James','Luca','Noah','Erik','Marco','Oliver','Finn','Ethan','Leon','Diego'],
    female: ['Amelia','Sofia','Mia','Laura','Ava','Emma','Freya','Clara','Aria','Isla'],
    neutral: ['Alex','Morgan','Robin','Sam','River','Sasha','Quinn','Avery','Casey','Jamie'],
    last: ['Smith','Garcia','Müller','Rossi','Andersen','Williams','Jensen','Martin','Svensson','Brown']
  }
};

const STREETS = ['Maple','Oak','Elm','Cedar','Pine','Birch','Ash','Willow','Chestnut','Acacia','Victoria','Albert','Church','High','Mill','Station','Park','Hill','Lake','Bridge'];
const CITIES_UK = ['Manchester','Bristol','Leeds','Sheffield','Liverpool','Edinburgh','Cardiff','Birmingham','Nottingham','Leicester','Brighton','Oxford','Cambridge','Norwich','Exeter'];
const CITIES_US = ['Portland','Austin','Denver','Nashville','Seattle','Minneapolis','Phoenix','Raleigh','Charlotte','Columbus','Indianapolis','Milwaukee','Richmond','Tucson','Tampa'];
const CITIES_EU = ['Amsterdam','Hamburg','Lyon','Seville','Turin','Gothenburg','Antwerp','Ghent','Malmo','Cologne','Rotterdam','Marseille','Valencia','Leipzig','Utrecht'];

const DOMAINS = ['gmail.com','yahoo.com','proton.me','outlook.com','hotmail.co.uk','icloud.com'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a,b) { return Math.floor(Math.random() * (b-a+1)) + a; }
function pad(n) { return String(n).padStart(2,'0'); }

let currentPersona = null;

function generate() {
  const gender = document.getElementById('genGender').value;
  const nat = document.getElementById('genNat').value;
  const ageRange = document.getElementById('genAge').value;
  const pool = DATA[nat] || DATA.british;
  const g = gender === 'any' ? ['male','female','neutral'][randInt(0,2)] : gender;
  const namePool = pool[g] || pool.male;
  const firstName = rand(namePool);
  const lastName = rand(pool.last);

  const currentYear = 2025;
  let age;
  if (ageRange === '20s') age = randInt(20,29);
  else if (ageRange === '30s') age = randInt(30,39);
  else if (ageRange === '40s') age = randInt(40,49);
  else age = randInt(22,55);
  const birthYear = currentYear - age;
  const birthMonth = randInt(1,12);
  const birthDay = randInt(1,28);
  const dob = `${pad(birthDay)}/${pad(birthMonth)}/${birthYear}`;

  const cities = nat === 'american' ? CITIES_US : nat === 'european' ? CITIES_EU : CITIES_UK;
  const city = rand(cities);
  const houseNum = randInt(1,150);
  const street = rand(STREETS) + (rand([' Street',' Road',' Lane',' Avenue',' Close',' Drive']));
  const address = `${houseNum} ${street}, ${city}`;

  const usernameBase = (firstName.toLowerCase() + lastName.toLowerCase() + randInt(10,99)).replace(/[^a-z0-9]/g,'');
  const email = usernameBase + '@' + rand(DOMAINS);

  const phones_uk = `07${randInt(100,999)} ${randInt(100,999)} ${randInt(100,999)}`;
  const phones_us = `+1 (${randInt(200,999)}) ${randInt(100,999)}-${randInt(1000,9999)}`;
  const phone = nat === 'american' ? phones_us : phones_uk;

  const occupations = ['Teacher','Freelance designer','Logistics coordinator','Admin assistant','Retail manager','Lab technician','Marketing coordinator','Delivery driver','Warehouse operative','Customer service rep','Accountant','HR officer','Nurse','Electrician','Plumber','IT support','Bookkeeper','Care worker','Chef','Librarian'];
  const occupation = rand(occupations);

  currentPersona = { firstName, lastName, dob, address, city, email, phone, occupation, gender: g, nationality: nat };
  renderPersonaCard(currentPersona);
  document.getElementById('personaOut').style.display = 'block';
}

function renderPersonaCard(p) {
  const fields = [
    {label:'FIRST NAME', val:p.firstName},
    {label:'LAST NAME', val:p.lastName},
    {label:'DATE OF BIRTH', val:p.dob},
    {label:'ADDRESS', val:p.address},
    {label:'EMAIL (SUGGESTED ALIAS)', val:p.email},
    {label:'PHONE', val:p.phone},
    {label:'OCCUPATION', val:p.occupation},
    {label:'GENDER', val:p.gender},
    {label:'STYLE', val:p.nationality},
  ];
  document.getElementById('personaCard').innerHTML = fields.map(f => `
    <div style="background:var(--bg3);border:1px solid var(--border);padding:12px;border-radius:2px">
      <div style="font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.1em;margin-bottom:4px">${f.label}</div>
      <div style="font-size:13px;color:var(--text)">${f.val}</div>
    </div>`).join('');
}

function savePersona() {
  if (!currentPersona) return;
  const personas = S.get('personas', []);
  personas.unshift({ ...currentPersona, id: Date.now(), saved: new Date().toLocaleDateString('en-GB'), used: '' });
  S.set('personas', personas);
  renderSaved();
  S.updateScoreUI();
  renderNav('Persona Generator');
  const btn = event.target;
  btn.textContent = 'SAVED ✓';
  setTimeout(() => btn.textContent = 'SAVE PERSONA', 2000);
}

function deletePersona(id) {
  if (!confirm('Delete this persona?')) return;
  S.set('personas', S.get('personas', []).filter(p => p.id !== id));
  renderSaved();
  S.updateScoreUI();
  renderNav('Persona Generator');
}

function copyPersona() {
  if (!currentPersona) return;
  const p = currentPersona;
  const text = `Name: ${p.firstName} ${p.lastName}\nDOB: ${p.dob}\nAddress: ${p.address}\nEmail: ${p.email}\nPhone: ${p.phone}\nOccupation: ${p.occupation}`;
  navigator.clipboard.writeText(text);
  const btn = event.target;
  btn.textContent = 'COPIED ✓';
  setTimeout(() => btn.textContent = 'COPY ALL', 2000);
}

function setUsed(id, val) {
  const personas = S.get('personas', []);
  const p = personas.find(p => p.id === id);
  if (p) p.used = val;
  S.set('personas', personas);
}

function renderSaved() {
  const personas = S.get('personas', []);
  document.getElementById('personaCount').textContent = personas.length;
  if (personas.length === 0) {
    document.getElementById('savedList').innerHTML = '<div style="padding:20px;text-align:center;color:var(--text3);font-size:13px">No personas saved yet.</div>';
    return;
  }
  document.getElementById('savedList').innerHTML = personas.map(p => `
    <div style="background:var(--bg3);border:1px solid var(--border);padding:14px;border-radius:2px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div>
          <div style="font-size:15px;font-weight:500">${p.firstName} ${p.lastName}</div>
          <div style="font-family:var(--mono);font-size:10px;color:var(--text3)">Saved ${p.saved}</div>
        </div>
        <button class="btn-icon" onclick="deletePersona(${p.id})">✕ DELETE</button>
      </div>
      <div  class="responsive-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:12px">
        <div><span style="color:var(--text3)">DOB: </span>${p.dob}</div>
        <div><span style="color:var(--text3)">Phone: </span><span style="font-family:var(--mono);font-size:11px">${p.phone}</span></div>
        <div><span style="color:var(--text3)">Job: </span>${p.occupation}</div>
        <div style="grid-column:1/-1"><span style="color:var(--text3)">Address: </span>${p.address}</div>
        <div style="grid-column:1/-1"><span style="color:var(--text3)">Email: </span><span style="font-family:var(--mono);font-size:11px;color:var(--accent)">${p.email}</span></div>
        <div style="grid-column:1/-1">
          <label style="font-family:var(--mono);font-size:9px;color:var(--text3);display:block;margin-bottom:4px">USED FOR</label>
          <input class="form-input" value="${p.used||''}" placeholder="e.g. Reddit, newsletter signup..." style="font-size:12px;padding:6px 10px" oninput="setUsed(${p.id},this.value)">
        </div>
      </div>
    </div>`).join('');
}
