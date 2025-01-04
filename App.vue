<template>
  <div id="app">
    <h1>Citiri de Tarot</h1>
    <div class="reading-options">
      <button @click="setMode('1-card')" class="btn">Citire cu 1 Carte</button>
      <button @click="setMode('3-cards')" class="btn">Citire cu 3 Cărți</button>
      <button @click="setMode('celtic-cross')" class="btn">Crucea Celtică</button>
      <button @click="setMode('shadow')" class="btn">Citire Umbre</button>
      <button @click="setMode('zodiac')" class="btn">Citire Zodiac</button>
      <button @click="setMode('7-cards')" class="btn">Scara Vieții</button>
      <button @click="setMode('horseshoe')" class="btn">Potcoavă</button>
      <button @click="setMode('love')" class="btn">Citire Iubire</button>
    </div>

    <div v-if="selectedCards.length" class="reading">
      <h2>Citirea ta:</h2>
      <div v-for="row in splitCards(selectedCards, 5)" :key="row[0].name" class="card-row">
        <div 
          v-for="(card, index) in row" 
          :key="card.name" 
          class="card" 
          @click="revealMeaning(card)" 
          :style="{ '--delay': index }"
        >
          <img :src="card.image" :alt="card.name" class="card-image" />
          <p v-if="!card.revealed" class="hint">Apasă pe carte pentru semnificație</p>
          <p v-if="card.revealed" class="card-description">
            <strong>{{ card.name }}:</strong> {{ card.meaning }}
          </p>
        </div>
      </div>

      <div class="final-description">
        <h3>Descriere finală:</h3>
        <p>{{ generateFinalDescription() }}</p>
      </div>
    </div>

    <div class="donate">
      <h4>Donează pentru susținerea aplicației:</h4>
      <!-- Folosim un form, dar metoda donate() trimite către Stripe -->
      <form @submit.prevent="donate">
        <button class="btn donate-btn">Donează 5RON</button>
      </form>
    </div>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";

export default {
  data() {
    return {
      cards: [
        { name: "Magicianul", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Magicianul-1-171x300.jpg.webp", meaning: "Reprezintă puterea de a manifesta idei și intenții.", revealed: false },
        { name: "Nebunul", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Nebunul-2-171x300.jpg.webp", meaning: "Simbolizează noi începuturi și călătorii neașteptate.", revealed: false },
        { name: "Marea Preoteasă", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Marea-Preoteasa-1-171x300.jpg.webp", meaning: "Este un simbol al intuiției și cunoașterii ascunse.", revealed: false },
        { name: "Împărteasa", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Imparateasa-1-171x300.jpg.webp", meaning: "Simbolizează fertilitatea, abundența și creativitatea.", revealed: false },
        { name: "Împăratul", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Imparatul-171x300.jpg.webp", meaning: "Reprezintă autoritatea, structura și controlul.", revealed: false },
        { name: "Marele Preot", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Marele-Preot-1-171x300.jpg.webp", meaning: "Este un simbol al tradiției, educației și învțăciunii spirituale.", revealed: false },
        { name: "Îndrăgostiții", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Indragostitii-1-171x300.jpg.webp", meaning: "Simbolizează relațiile, deciziile și parteneriatele.", revealed: false },
        { name: "Faetonul", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Faetonul-171x300.jpg.webp", meaning: "Reprezintă controlul și determinarea de a merge mai departe.", revealed: false },
        { name: "Forța", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Forta-1.jpg.webp", meaning: "Este simbolul curajului, rezistenței și compasiunii.", revealed: false },
        { name: "Eremitul", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Eremitul-171x300.jpg.webp", meaning: "Reprezintă introspecția și căutarea cunoașterii interioare.", revealed: false },
        { name: "Roata Norocului", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Roata-Norocului-1-171x300.jpg.webp", meaning: "Semnifică schimbări și cicluri inevitabile ale vieții.", revealed: false },
        { name: "Dreptatea", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Dreptatea-1.jpg.webp", meaning: "Este simbolul echității, adevărului și corectitudinii.", revealed: false },
        { name: "Spânzuratul", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/TAROT-Spanzuratul-1-171x300.jpg.webp", meaning: "Reprezintă sacrificiul și schimbarea perspectivei.", revealed: false },
        { name: "Moartea", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Moartea-1-171x300.jpg.webp", meaning: "Simbolizează transformarea, finalurile și noile începuturi.", revealed: false },
        { name: "Echilibrul", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Echilibrul-171x300.jpg.webp", meaning: "Este simbolul armoniei, răbdării și temperanței.", revealed: false },
        { name: "Diavolul", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Diavolul-171x300.jpg.webp", meaning: "Reprezintă atașamentele, dependențele și iluzia.", revealed: false },
        { name: "Turnul", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Turnul-1-171x300.jpg.webp", meaning: "Simbolizează schimbări bruște, haos și eliberare.", revealed: false },
        { name: "Steaua", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/TAROT-Steaua-1-171x300.jpg.webp", meaning: "Este simbolul speranței, inspirației și vindecării.", revealed: false },
        { name: "Luna", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Luna-1-171x300.jpg.webp", meaning: "Reprezintă iluziile, frica și subconștientul.", revealed: false },
        { name: "Soarele", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Soarele-1-171x300.jpg.webp", meaning: "Este simbolul succesului, energiei și optimismului.", revealed: false },
        { name: "Judecata", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Judecata-1-171x300.jpg.webp", meaning: "Semnifică transformarea personală și renașterea.", revealed: false },
        { name: "Lumea", image: "https://sloturipetocuri.ro/wp-content/uploads/2022/09/SPT-Lumea-1-171x300.jpg.webp", meaning: "Este simbolul realizării, succesului și împlinirii.", revealed: false }
      ],
      selectedCards: [],
      mode: ''
    };
  },
  methods: {
    // Metodă pentru a alege tipul de citire și a genera extragerea
    setMode(mode) {
      this.mode = mode;
      this.generateReading();
    },
    // Generarea unui număr de cărți în funcție de tipul de citire
   generateReading() {
  // Resetează starea "revealed" pentru toate cărțile
  this.cards.forEach((card) => {
    card.revealed = false;
  });

  let numCards = 1;
  if (this.mode === '3-cards') numCards = 3;
  else if (this.mode === 'celtic-cross') numCards = 10;
  else if (this.mode === 'shadow') numCards = 5;
  else if (this.mode === 'zodiac') numCards = 12;
  else if (this.mode === '7-cards') numCards = 7;
  else if (this.mode === 'horseshoe') numCards = 7;
  else if (this.mode === 'love') numCards = 6;

  const shuffled = this.cards.sort(() => 0.5 - Math.random());
  this.selectedCards = shuffled.slice(0, numCards);
},
    // Marchează cartea ca fiind dezvăluită
    revealMeaning(card) {
      card.revealed = true;
    },
    // Split array-ul de cărți în rânduri de max. 5 cărți
    splitCards(cards, cardsPerRow) {
      const rows = [];
      for (let i = 0; i < cards.length; i += cardsPerRow) {
        rows.push(cards.slice(i, i + cardsPerRow));
      }
      return rows;
    },
    // Generarea descrierii finale pe baza cuvintelor-cheie din semnificațiile cărților
    generateFinalDescription() {
      if (!this.selectedCards.length) return '';

      const themes = {
        schimbare: 0,
        iubire: 0,
        conflict: 0,
        transformare: 0,
        introspecție: 0,
        succes: 0,
        speranță: 0,
        vindecare: 0
      };

      this.selectedCards.forEach(card => {
        if (card.meaning.includes("schimbare")) themes.schimbare++;
        if (card.meaning.includes("iubire")) themes.iubire++;
        if (card.meaning.includes("conflict")) themes.conflict++;
        if (card.meaning.includes("transformare")) themes.transformare++;
        if (card.meaning.includes("introspecție")) themes.introspecție++;
        if (card.meaning.includes("succes")) themes.succes++;
        if (card.meaning.includes("speranță")) themes.speranță++;
        if (card.meaning.includes("vindecare")) themes.vindecare++;
      });

      const descriptions = {
        schimbare: [
          "Această extragere indică un puternic element de schimbare în viața ta.",
          "Schimbările ce urmează pot aduce perspective noi și oportunități neașteptate.",
          "Pregătește-te pentru o perioadă de tranziție și creștere.",
          "Transformările din viața ta vor aduce claritate și direcție.",
          "Un nou început este aproape; îmbrățișează-l cu încredere.",
          "Schimbările externe reflectă evoluția ta interioară.",
          "Această etapă va redefini prioritățile și valorile tale.",
          "Fii deschis la adaptare, pentru că surprizele vor fi pozitive.",
          "Ceea ce pare instabil acum va deveni fundația viitorului tău.",
          "Acum este momentul să lași în urmă ceea ce nu mai servește scopului tău."
        ],
        iubire: [
          "Extragerea subliniază aspecte legate de iubire și relații.",
          "Acest moment este favorabil pentru conexiuni emoționale profunde.",
          "Iubirea și armonia joacă un rol central în viața ta acum.",
          "O relație importantă ar putea evolua semnificativ.",
          "Este un moment propice pentru a întări legăturile existente.",
          "Dragostea îți oferă lecții valoroase despre tine însuți.",
          "Relațiile noi ar putea aduce bucurie neașteptată.",
          "Inima ta este gata să accepte iubirea autentică.",
          "Empatia și compasiunea îți vor ghida acțiunile în relații.",
          "Cei dragi îți oferă sprijinul de care ai nevoie acum."
        ],
        conflict: [
          "Un posibil conflict sau tensiune este evident în cărțile extrase.",
          "Ai putea întâmpina obstacole ce necesită răbdare și înțelepciune.",
          "Conflictele actuale pot duce la înțelegeri mai profunde.",
          "Este un moment potrivit să rezolvi tensiunile din viața ta.",
          "Fii atent la comunicare pentru a evita neînțelegerile.",
          "Un compromis ar putea fi cheia rezolvării unei dispute.",
          "Tensiunea prezentă poate fi un catalizator pentru schimbare pozitivă.",
          "Conflictele te ajută să îți clarifici valorile și limitele.",
          "Gestionarea calmă a provocărilor va aduce rezultate favorabile.",
          "Este momentul să confrunți problemele cu curaj și deschidere."
        ],
        transformare: [
          "Transformarea personală este un aspect central al acestei citiri.",
          "Această perioadă simbolizează renașterea și noile începuturi.",
          "Te afli într-un proces profund de schimbare interioară.",
          "Acest moment te invită să renunți la trecut și să îmbrățișezi noul.",
          "Evoluția ta va atrage noi oportunități și perspective.",
          "Transformările externe reflectă creșterea ta spirituală.",
          "Este timpul să eliberezi bagajele emoționale vechi.",
          "Schimbările actuale îți vor deschide calea către auto-descoperire.",
          "Fii deschis la reinventare și acceptă necunoscutul.",
          "Transformările majore aduc claritate asupra scopului tău."
        ],
        introspecție: [
          "Citirea sugerează introspecție și căutarea răspunsurilor interioare.",
          "Este un moment potrivit pentru auto-reflecție și claritate.",
          "Explorarea gândurilor interioare îți poate aduce pace și direcție.",
          "Conectează-te cu tine însuți pentru a descoperi adevărul interior.",
          "Meditația și liniștea te vor ghida spre răspunsuri importante.",
          "Acordă-ți timp să înțelegi ce este cu adevărat important pentru tine.",
          "În tăcere vei găsi răspunsuri la întrebările tale cele mai profunde.",
          "Reflecția asupra trecutului te va pregăti pentru viitor.",
          "Auto-cunoașterea este cheia creșterii personale în acest moment.",
          "Aprofundarea legăturii cu sinele tău va aduce echilibru."
        ],
        succes: [
          "Succesul și realizările sunt bine evidențiate în această extragere.",
          "Eforturile tale vor fi răsplătite cu rezultate semnificative.",
          "Te așteaptă o perioadă de recunoaștere și împlinire.",
          "Munca ta va aduce roade pe măsura eforturilor depuse.",
          "Realizările tale vor inspira pe cei din jurul tău.",
          "Succesul tău este rezultatul perseverenței și dedicării.",
          "Este momentul să sărbătorești victoriile tale recente.",
          "Recunoașterea publică îți va consolida încrederea în tine.",
          "Rezultatele pozitive confirmă că ești pe calea cea bună.",
          "Este o perioadă favorabilă pentru a atinge noi obiective."
        ],
        speranță: [
          "Această extragere aduce un mesaj de optimism și încredere în viitor.",
          "Chiar și în momentele dificile, există lumină la capătul tunelului.",
          "Speranța îți va ghida pașii spre noi oportunități.",
          "Este momentul să privești înainte cu curaj și credință.",
          "Încrederea în viitor îți aduce puterea de a persevera.",
          "Lumina speranței strălucește chiar și în cele mai întunecate momente.",
          "Acest moment te invită să îți menții optimismul și motivația.",
          "Credința că lucrurile se vor îmbunătăți este cheia succesului tău.",
          "Chiar și obstacolele actuale vor deschide calea către oportunități noi.",
          "Rămâi centrat pe posibilitățile pozitive din viața ta."
        ],
        vindecare: [
          "Citirea sugerează o perioadă de regenerare și echilibrare interioară.",
          "Este timpul să te eliberezi de durerea trecutului.",
          "Vindecarea te va ajuta să mergi mai departe cu forțe noi.",
          "Această etapă îți oferă șansa de a găsi pacea interioară.",
          "Procesele de vindecare îți deschid calea către creștere personală.",
          "Acceptarea și iertarea sunt esențiale pentru regenerare.",
          "Acum este momentul să prioritizezi bunăstarea ta emoțională.",
          "Fii blând cu tine însuți în acest proces de transformare.",
          "Vindecarea aduce claritate și armonie în viața ta.",
          "Această perioadă îți oferă oportunitatea de a te reconecta cu tine însuți."
        ]
      };

      let finalDescription = "";
      for (const [theme, count] of Object.entries(themes)) {
        if (count > 0) {
          const randomDescription =
            descriptions[theme][Math.floor(Math.random() * descriptions[theme].length)];
          finalDescription += `${randomDescription} `;
        }
      }

      return (
        finalDescription.trim() ||
        "Această extragere nu are o interpretare directă, dar simbolurile ei pot avea semnificații unice pentru tine. Încearcă să extragi din nou."
      );
    },
    // Metoda de donație cu Stripe
    async donate() {
      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const session = await response.json();
        const stripe = await loadStripe("pk_live_51LhHVFJOzg3eyu5LJRnplRv2AKh0MGJEew4HhNbn3Eu2LfJkbZUv2j4lFNxulY5ugbb6wrh07QCaX0djdFnQ8f7A00tyuYKXEL");
        await stripe.redirectToCheckout({ sessionId: session.id });
      } catch (error) {
        console.error("Error la redirecționarea către Stripe:", error);
      }
    }
  }
};
</script>

<style>
/* Fundal și stilizare generală */
html, body {
  margin: 0;
  padding: 0;
  height: 100%; /* Fixează înălțimea la 100% din fereastra browserului */
  background: url('https://i.giphy.com/jiShRuttUxmgaOifOK.webp') no-repeat center center fixed;
  background-size: cover;
}

#app {
  height: 100%; /* Asigură că aplicația ocupă întreaga înălțime a paginii */
  overflow-y: auto; /* Activează doar scroll-ul pe verticală pentru conținut */
  overflow-x: hidden; /* Previne scroll-ul pe orizontală */
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5px;
  color: #e3ab12;
  text-align: center;
}

h2 {
  margin-top: 0.5px;
  color: #e3ab12;
}

  h3 {
  margin-top: 20px;
  color: #e3ab12;
  text-align: center;
}

  h4 {
  margin-top: 10px;
  color: #e3ab12;
  text-align: center;
}
/* Butoanele pentru opțiuni de citire */
.reading-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

/* Rândurile de cărți */
.card-row {
  display: flex;
  justify-content: space-between;
  gap: 2px;
  margin-bottom: 5px;
}

/* Containerul pentru fiecare carte */
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
  text-align: center;
  width: fit-content;
  opacity: 0; /* Opacitate inițială pentru efectul de "fade in" */
  transform: translateY(20px);
  animation: cardEnter 0.5s forwards ease; /* Animația */
  animation-delay: calc(var(--delay) * 0.1s); /* Delay pentru fiecare carte, bazat pe index */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Animația propriu-zisă */
@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Imaginea cărții */
.card-image {
  width: 50px;
  height: auto;
  border-radius: 5px;
  border: 1px solid #ffd700;
}

/* Indicație pentru utilizator când cartea nu e dezvăluită */
.hint {
  margin-top: 3px;
  font-size: 0.7rem;
  font-style: italic;
  color: #ccc;
}

/* Descriere carte dezvăluită */
.card-description {
  margin-top: 5px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  color: #e87b41;
}

.final-description {
  margin-top: 0.5px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: #e87b41;
  border-radius: 20px;
  font-size: 1rem;
}

/* Stilizare butoane */
.btn {
  background: linear-gradient(45deg, #ffcc00, #ff9900);
  color: black;
  border: none;
  padding: 8px 15px;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 20px;
  cursor: pointer;
  margin: 8px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.btn:hover {
  background: linear-gradient(45deg, #ff9900, #cc6600);
  transform: translateY(-2px);
}

/* Secțiunea de donații */
.donate {
  margin-top: 5px;
  text-align: center;
}

/* Stilizare buton donație */
.donate-btn {
  background: linear-gradient(45deg, #66ff99, #33cc66);
  color: black;
  font-weight: bold;
  text-align: center;
}

.donate-btn:hover {
  background: linear-gradient(45deg, #33cc66, #009933);
  text-align: center;
}

/* Media queries pentru ecrane mici */
@media (max-width: 768px) {
  .card-row {
    gap: 1px;
  }
  .card-image {
    width: 40px;
  }
  .btn {
    padding: 6px 12px;
    font-size: 0.7rem;
  }
}
</style>
