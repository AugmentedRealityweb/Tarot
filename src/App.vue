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
      <div v-if="mode === 'zodiac'">
        <div class="zodiac-row">
          <div v-for="(card, index) in selectedCards.slice(0, 6)" :key="'top-' + index" class="card" @click="revealMeaning(card)">
            <img :src="card.image" :alt="card.name" class="card-image" />
            <p v-if="!card.revealed" class="hint">Apasă pe carte pentru semnificație</p>
            <p v-if="card.revealed" class="card-description"><strong>{{ card.name }}:</strong> {{ card.meaning }}</p>
          </div>
        </div>
        <div class="zodiac-row">
          <div v-for="(card, index) in selectedCards.slice(6, 12)" :key="'bottom-' + index" class="card" @click="revealMeaning(card)">
            <img :src="card.image" :alt="card.name" class="card-image" />
            <p v-if="!card.revealed" class="hint">Apasă pe carte pentru semnificație</p>
            <p v-if="card.revealed" class="card-description"><strong>{{ card.name }}:</strong> {{ card.meaning }}</p>
          </div>
        </div>
      </div>
      <div v-else-if="mode === 'celtic-cross'">
        <div class="celtic-row">
          <div v-for="(card, index) in selectedCards.slice(0, 5)" :key="'top-' + index" class="card" @click="revealMeaning(card)">
            <img :src="card.image" :alt="card.name" class="card-image" />
            <p v-if="!card.revealed" class="hint">Apasă pe carte pentru semnificație</p>
            <p v-if="card.revealed" class="card-description"><strong>{{ card.name }}:</strong> {{ card.meaning }}</p>
          </div>
        </div>
        <div class="celtic-row">
          <div v-for="(card, index) in selectedCards.slice(5, 10)" :key="'bottom-' + index" class="card" @click="revealMeaning(card)">
            <img :src="card.image" :alt="card.name" class="card-image" />
            <p v-if="!card.revealed" class="hint">Apasă pe carte pentru semnificație</p>
            <p v-if="card.revealed" class="card-description"><strong>{{ card.name }}:</strong> {{ card.meaning }}</p>
          </div>
        </div>
      </div>
      <div v-else class="default-layout">
        <div v-for="(card, index) in selectedCards" :key="index" class="card" @click="revealMeaning(card)">
          <img :src="card.image" :alt="card.name" class="card-image" />
          <p v-if="!card.revealed" class="hint">Apasă pe carte pentru semnificație</p>
          <p v-if="card.revealed" class="card-description"><strong>{{ card.name }}:</strong> {{ card.meaning }}</p>
        </div>
      </div>
    </div>
    <div class="donate">
      <h3>Donează pentru susținerea aplicației:</h3>
      <form @submit.prevent="donate">
        <button class="btn donate-btn">Donează</button>
      </form>
    </div>
  </div>
</template>

<script>
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
    setMode(mode) {
      this.mode = mode;
      this.generateReading();
    },
    generateReading() {
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
    revealMeaning(card) {
      card.revealed = true;
    },
    donate() {
      alert("Funcționalitatea de donații va fi activată curând.");
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: url('https://i.giphy.com/Aptv4n47PW6wu4arEd.webp') no-repeat center center fixed;
  background-size: cover;
  font-family: 'Poppins', sans-serif;
  color: white;
  text-align: center;
}

#app {
  padding: 20px;
  max-width: 600px;
  margin: 20px auto;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #ffcc00;
}

h2 {
  margin-top: 20px;
  color: #ffd700;
}

.reading-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.reading {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  justify-content: center;
}

.zodiac-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.celtic-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.card-image {
  width: 100%;
  max-width: 100px;
  height: auto;
  border-radius: 10px;
  border: 2px solid #ffd700;
}

.hint {
  margin-top: 5px;
  font-size: 0.9rem;
  font-style: italic;
  color: #ccc;
}

.card-description {
  margin-top: 10px;
  font-size: 1.1rem;
  font-weight: 500;
}

.btn {
  background: linear-gradient(45deg, #ffcc00, #ff9900);
  color: black;
  border: none;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  margin: 10px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.btn:hover {
  background: linear-gradient(45deg, #ff9900, #cc6600);
  transform: translateY(-3px);
}

.donate {
  margin-top: 30px;
}

.donate-btn {
  background: linear-gradient(45deg, #66ff99, #33cc66);
  color: black;
  font-weight: bold;
}

.donate-btn:hover {
  background: linear-gradient(45deg, #33cc66, #009933);
}

@media (max-width: 768px) {
  .card-image {
    width: 80px;
  }
  .btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>
