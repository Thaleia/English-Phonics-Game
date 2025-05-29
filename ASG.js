const letters = {
    A: { animal: 'alligator', image: 'ASG.pictures/alligator.png' },
    B: { animal: 'bear', image: 'ASG.pictures/bear.png' },
    C: { animal: 'cat', image: 'ASG.pictures/cat.png' },
    D: { animal: 'dog', image: 'ASG.pictures/dog.png' },
    E: { animal: 'elephant', image: 'ASG.pictures/elephant.png' },
    F: { animal: 'fox', image: 'ASG.pictures/fox.png' },
    G: { animal: 'giraffe', image: 'ASG.pictures/giraffe.png' },
    H: { animal: 'hippo', image: 'ASG.pictures/hippo.png' },
    I: { animal: 'iguana', image: 'ASG.pictures/iguana.png' },
    J: { animal: 'jellyfish', image: 'ASG.pictures/jellyfish.png' },
    K: { animal: 'kangaroo', image: 'ASG.pictures/kangaroo.png' },
    L: { animal: 'lion', image: 'ASG.pictures/lion.png' },
    M: { animal: 'monkey', image: 'ASG.pictures/monkey.png' },
    N: { animal: 'nessie', image: 'ASG.pictures/nessie.png' },
    O: { animal: 'owl', image: 'ASG.pictures/owl.png' },
    P: { animal: 'penguin', image: 'ASG.pictures/penguin.png' },
    Q: { animal: 'quokka', image: 'ASG.pictures/quokka.png' },
    R: { animal: 'rabbit', image: 'ASG.pictures/rabbit.png' },
    S: { animal: 'snake', image: 'ASG.pictures/snake.png' },
    T: { animal: 'tiger', image: 'ASG.pictures/tiger.png' },
    U: { animal: 'unicorn', image: 'ASG.pictures/unicorn.png' },
    V: { animal: 'viper', image: 'ASG.pictures/viper.png' },
    W: { animal: 'whale', image: 'ASG.pictures/whale.png' },
    X: { animal: 'xenoceratops', image: 'ASG.pictures/xenoceratops.png' },
    Y: { animal: 'yabbi', image: 'ASG.pictures/yabbi.png' },
    Z: { animal: 'zebra', image: 'ASG.pictures/zebra.png' }
  };
  
  const phonics = {
    A: 'ah', B: 'bah', C: 'kah', D: 'dah', E: 'ae', F: 'fah', G: 'gah',
    H: 'hah', I: 'e', J: 'jae', K: 'kah', L: 'la', M: 'mah', N: 'nah',
    O: 'oh', P: 'pah', Q: 'qah', R: 'rah', S: 'shu', T: 'tah', U: 'you',
    V: 'vah', W: 'wuh', X: 'x', Y: 'yah', Z: 'zea'
  };
  
  const animalImage = document.getElementById('animal-image');
  const message = document.getElementById('message');
  const optionsContainer = document.getElementById('options');
  const scoreDisplay = document.getElementById('score');
  
  let currentLetter = '';
  let score = 0;
  let isSpeaking = false;
  let answeredCorrectly = false;
  let selectedVoice = null;
  
  function getRandomLetter(excludeLetter = '') {
    const keys = Object.keys(letters).filter(letter => letter !== excludeLetter);
    return keys[Math.floor(Math.random() * keys.length)];
  }
  
  function generateOptions(correctLetter) {
    const allLetters = 'abcdefghijklmnopqrstuvwxyz';
    const options = new Set([correctLetter.toLowerCase()]);
    while (options.size < 3) {
      const random = allLetters[Math.floor(Math.random() * allLetters.length)];
      options.add(random);
    }
    return Array.from(options).sort(() => 0.5 - Math.random());
  }
  
  // Load voices and select best available
  function setVoice() {
    const voices = speechSynthesis.getVoices();
    selectedVoice = voices.find(v => v.name.includes('Google UK English Female')) ||
                    voices.find(v => v.name.includes('Google US English')) ||
                    voices.find(v => v.name.includes('Zira')) ||
                    voices[0];
  }
  
  speechSynthesis.onvoiceschanged = setVoice;
  
  function speak(text, delay = 0) {
    setTimeout(() => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = selectedVoice;
      utter.rate = 0.9;
      speechSynthesis.speak(utter);
    }, delay);
  }
  
  function speakSequenceOnce(parts, delay = 0, step = 50) {
    if (isSpeaking) return;
    isSpeaking = true;
    parts.forEach((text, index) => {
      speak(text, delay + index * step);
    });
    const totalDuration = delay + parts.length * step;
    setTimeout(() => {
      isSpeaking = false;
    }, totalDuration);
  }
  
  function showNewLetter(letter) {
    currentLetter = letter;
    answeredCorrectly = false;
    const animal = letters[letter];
    const sound = phonics[letter] || letter.toLowerCase();
    animalImage.src = animal.image;
    message.textContent = '';
    setTimeout(() => {
      if (!answeredCorrectly) {
        speak(animal.animal);
      }
    }, 500);
  
    const optionLetters = generateOptions(letter);
    optionsContainer.innerHTML = '';
    optionLetters.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.className = 'option-btn';
      btn.onclick = () => checkAnswer(opt);
      optionsContainer.appendChild(btn);
    });
  }
  
  function checkAnswer(selected) {
    if (selected.toUpperCase() === currentLetter && !isSpeaking && !answeredCorrectly) {
      const lower = currentLetter.toLowerCase();
      const animal = letters[currentLetter].animal;
      const sound = phonics[currentLetter] || lower;
      message.textContent = `${lower} ${animal}`;
      score++;
      answeredCorrectly = true;
      scoreDisplay.textContent = `Score: ${score}`;
    //   speakSequenceOnce([sound, sound, sound, 'for', animal], 0, 10);
      speak(`${sound}, ${sound}, ${sound} ${animal}`);

      confettiEffect(1300);
      setTimeout(() => {
        showNewLetter(getRandomLetter(currentLetter));
      }, 4300);
    } else if (!answeredCorrectly) {
      message.textContent = '☹️ Try again!';
    }
  }
  
  function confettiEffect(duration = 2000) {
    const end = Date.now() + duration;
    const colors = ['#bb0000', '#ffffff', '#00bb00', '#0000bb', '#ffcc00'];
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
  
  showNewLetter(getRandomLetter());
  