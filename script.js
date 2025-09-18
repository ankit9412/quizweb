// Login System Variables
let isLoggedIn = false;
let currentUser = '';
let confirmationCode = '';
let selectedDifficulty = '';
let userRating = 0;

// Quiz Variables
let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 300; // 5 minutes for quiz
let quizStartTime;

// Questions storage
let questions = {
    easy: [],
    medium: [],
    hard: []
};

// Load questions from text files
async function loadQuestions() {
    try {
        const difficulties = ['easy', 'medium', 'hard'];
        let loadedFromFiles = true;

        for (const difficulty of difficulties) {
            try {
                console.log(`Loading ${difficulty} questions...`);
                const response = await fetch(`${difficulty}-questions.txt`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${difficulty}-questions.txt: ${response.status}`);
                }
                
                const text = await response.text();
                const lines = text.trim().split('\n').filter(line => line.trim() !== '');

                questions[difficulty] = lines.map(line => {
                    const parts = line.split('|');
                    if (parts.length < 6) {
                        console.warn(`Invalid question format in ${difficulty}: ${line}`);
                        return null;
                    }
                    return {
                        question: parts[0],
                        options: [parts[1], parts[2], parts[3], parts[4]],
                        answer: parts[5]
                    };
                }).filter(q => q !== null);

                console.log(`✅ Loaded ${questions[difficulty].length} ${difficulty} questions from file`);
                
            } catch (fileError) {
                console.error(`❌ Failed to load ${difficulty} questions from file:`, fileError);
                loadedFromFiles = false;
                break;
            }
        }

        if (loadedFromFiles && questions.easy.length > 0 && questions.medium.length > 0 && questions.hard.length > 0) {
            console.log('🎉 All questions loaded successfully from files!');
            console.log(`📊 Total: Easy: ${questions.easy.length}, Medium: ${questions.medium.length}, Hard: ${questions.hard.length}`);
        } else {
            throw new Error('Failed to load questions from files or files are empty');
        }
        
    } catch (error) {
        console.error('❌ Error loading questions from files:', error);
        console.log('🔄 Loading fallback questions...');
        // Fallback to basic questions if files can't be loaded
        loadFallbackQuestions();
        console.log('✅ Fallback questions loaded successfully!');
        console.log(`📊 Fallback: Easy: ${questions.easy.length}, Medium: ${questions.medium.length}, Hard: ${questions.hard.length}`);
    }
}

// Fallback questions in case files can't be loaded (50 questions each)
function loadFallbackQuestions() {
    questions = {
        easy: [
            { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
            { question: "What color is the sky?", options: ["Blue", "Green", "Red", "Yellow"], answer: "Blue" },
            { question: "How many days are in a week?", options: ["5", "6", "7", "8"], answer: "7" },
            { question: "What is the capital of the United States?", options: ["New York", "Washington D.C.", "Los Angeles", "Chicago"], answer: "Washington D.C." },
            { question: "Which animal is known as man's best friend?", options: ["Cat", "Dog", "Bird", "Fish"], answer: "Dog" },
            { question: "What is 10 - 5?", options: ["3", "4", "5", "6"], answer: "5" },
            { question: "How many fingers do humans typically have?", options: ["8", "10", "12", "14"], answer: "10" },
            { question: "What do bees make?", options: ["Milk", "Honey", "Butter", "Cheese"], answer: "Honey" },
            { question: "What is the opposite of hot?", options: ["Warm", "Cool", "Cold", "Freezing"], answer: "Cold" },
            { question: "Which season comes after winter?", options: ["Summer", "Fall", "Spring", "Autumn"], answer: "Spring" },
            { question: "What is 3 × 3?", options: ["6", "9", "12", "15"], answer: "9" },
            { question: "What do we use to write?", options: ["Spoon", "Pen", "Fork", "Knife"], answer: "Pen" },
            { question: "How many wheels does a bicycle have?", options: ["1", "2", "3", "4"], answer: "2" },
            { question: "What is the first letter of the alphabet?", options: ["A", "B", "C", "D"], answer: "A" },
            { question: "Which fruit is red and round?", options: ["Banana", "Apple", "Orange", "Grape"], answer: "Apple" },
            { question: "What is 15 ÷ 3?", options: ["3", "4", "5", "6"], answer: "5" },
            { question: "How many hours are in a day?", options: ["12", "24", "36", "48"], answer: "24" },
            { question: "What do fish live in?", options: ["Air", "Water", "Sand", "Trees"], answer: "Water" },
            { question: "What is the color of grass?", options: ["Blue", "Red", "Green", "Yellow"], answer: "Green" },
            { question: "How many months are in a year?", options: ["10", "11", "12", "13"], answer: "12" },
            { question: "What is 4 + 4?", options: ["6", "7", "8", "9"], answer: "8" },
            { question: "Which animal says 'moo'?", options: ["Dog", "Cat", "Cow", "Pig"], answer: "Cow" },
            { question: "What is the shape of a ball?", options: ["Square", "Triangle", "Circle", "Rectangle"], answer: "Circle" },
            { question: "How many sides does a triangle have?", options: ["2", "3", "4", "5"], answer: "3" },
            { question: "What is 20 - 10?", options: ["5", "10", "15", "20"], answer: "10" },
            { question: "Which meal do we eat in the morning?", options: ["Lunch", "Dinner", "Breakfast", "Snack"], answer: "Breakfast" },
            { question: "What is the color of the sun?", options: ["Blue", "Green", "Yellow", "Purple"], answer: "Yellow" },
            { question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], answer: "8" },
            { question: "What is 6 × 2?", options: ["10", "12", "14", "16"], answer: "12" },
            { question: "Which direction is opposite to up?", options: ["Left", "Right", "Down", "Forward"], answer: "Down" },
            { question: "What is 100 ÷ 10?", options: ["5", "10", "15", "20"], answer: "10" },
            { question: "How many eyes do humans have?", options: ["1", "2", "3", "4"], answer: "2" },
            { question: "What is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
            { question: "Which planet do we live on?", options: ["Mars", "Venus", "Earth", "Jupiter"], answer: "Earth" },
            { question: "What is 7 + 8?", options: ["14", "15", "16", "17"], answer: "15" },
            { question: "How many cents are in a dollar?", options: ["50", "75", "100", "125"], answer: "100" },
            { question: "What do we call frozen water?", options: ["Steam", "Ice", "Snow", "Rain"], answer: "Ice" },
            { question: "Which animal is the king of the jungle?", options: ["Tiger", "Lion", "Elephant", "Bear"], answer: "Lion" },
            { question: "What is 9 - 4?", options: ["3", "4", "5", "6"], answer: "5" },
            { question: "How many minutes are in an hour?", options: ["30", "45", "60", "90"], answer: "60" },
            { question: "What is the opposite of big?", options: ["Large", "Huge", "Small", "Tiny"], answer: "Small" },
            { question: "Which bird cannot fly?", options: ["Eagle", "Sparrow", "Penguin", "Robin"], answer: "Penguin" },
            { question: "What is 5 × 4?", options: ["15", "20", "25", "30"], answer: "20" },
            { question: "How many sides does a square have?", options: ["3", "4", "5", "6"], answer: "4" },
            { question: "What is the first month of the year?", options: ["December", "January", "February", "March"], answer: "January" },
            { question: "Which sense do we use to see?", options: ["Hearing", "Smell", "Sight", "Touch"], answer: "Sight" },
            { question: "What is 18 ÷ 2?", options: ["6", "7", "8", "9"], answer: "9" },
            { question: "How many legs does a cat have?", options: ["2", "4", "6", "8"], answer: "4" },
            { question: "What is the color of snow?", options: ["Black", "White", "Gray", "Blue"], answer: "White" },
            { question: "Which fruit is yellow and curved?", options: ["Apple", "Orange", "Banana", "Grape"], answer: "Banana" },
            { question: "What is 12 + 8?", options: ["18", "19", "20", "21"], answer: "20" }
        ],
        medium: [
            { question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], answer: "Paris" },
            { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Venus", "Jupiter"], answer: "Mars" },
            { question: "Who wrote Romeo and Juliet?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], answer: "William Shakespeare" },
            { question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], answer: "Au" },
            { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
            { question: "What is 15% of 200?", options: ["25", "30", "35", "40"], answer: "30" },
            { question: "In which year did World War II end?", options: ["1944", "1945", "1946", "1947"], answer: "1945" },
            { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: "8" },
            { question: "Which country is famous for the Taj Mahal?", options: ["China", "India", "Egypt", "Greece"], answer: "India" },
            { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], answer: "Nile" },
            { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
            { question: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Rupee"], answer: "Yen" },
            { question: "Which gas makes up most of Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Nitrogen" },
            { question: "What is 12 × 15?", options: ["160", "170", "180", "190"], answer: "180" },
            { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], answer: "Leonardo da Vinci" },
            { question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: "Vatican City" },
            { question: "Which element has the chemical symbol 'O'?", options: ["Gold", "Silver", "Oxygen", "Iron"], answer: "Oxygen" },
            { question: "What is 144 ÷ 12?", options: ["10", "11", "12", "13"], answer: "12" },
            { question: "In which continent is Brazil located?", options: ["North America", "South America", "Europe", "Asia"], answer: "South America" },
            { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Silver"], answer: "Diamond" },
            { question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: "6" },
            { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: "Canberra" },
            { question: "Which planet is closest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], answer: "Mercury" },
            { question: "What is 25% of 80?", options: ["15", "20", "25", "30"], answer: "20" },
            { question: "Who invented the telephone?", options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Benjamin Franklin"], answer: "Alexander Graham Bell" },
            { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], answer: "Blue Whale" },
            { question: "In which year did the Titanic sink?", options: ["1910", "1911", "1912", "1913"], answer: "1912" },
            { question: "What is the chemical formula for water?", options: ["CO2", "H2O", "NaCl", "CH4"], answer: "H2O" },
            { question: "Which country has the most natural lakes?", options: ["Russia", "Canada", "Finland", "Sweden"], answer: "Canada" },
            { question: "What is 7 × 13?", options: ["89", "91", "93", "95"], answer: "91" },
            { question: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], answer: "Ottawa" },
            { question: "Which instrument measures earthquakes?", options: ["Barometer", "Thermometer", "Seismograph", "Anemometer"], answer: "Seismograph" },
            { question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Kalahari", "Arabian"], answer: "Sahara" },
            { question: "How many bones are in an adult human body?", options: ["196", "206", "216", "226"], answer: "206" },
            { question: "What is 169 ÷ 13?", options: ["11", "12", "13", "14"], answer: "13" },
            { question: "Which vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], answer: "Vitamin D" },
            { question: "What is the speed of light?", options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"], answer: "299,792,458 m/s" },
            { question: "In which city is the Statue of Liberty located?", options: ["Boston", "Philadelphia", "New York", "Washington D.C."], answer: "New York" },
            { question: "What is the chemical symbol for iron?", options: ["Ir", "In", "Fe", "Fr"], answer: "Fe" },
            { question: "Which country invented pizza?", options: ["France", "Spain", "Italy", "Greece"], answer: "Italy" },
            { question: "What is 18 × 7?", options: ["124", "126", "128", "130"], answer: "126" },
            { question: "What is the largest organ in the human body?", options: ["Heart", "Brain", "Liver", "Skin"], answer: "Skin" },
            { question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
            { question: "What is the capital of Egypt?", options: ["Alexandria", "Cairo", "Luxor", "Aswan"], answer: "Cairo" },
            { question: "How many chambers does a human heart have?", options: ["2", "3", "4", "5"], answer: "4" },
            { question: "What is 225 ÷ 15?", options: ["13", "14", "15", "16"], answer: "15" },
            { question: "Which mountain range contains Mount Everest?", options: ["Andes", "Rockies", "Alps", "Himalayas"], answer: "Himalayas" },
            { question: "What is the study of earthquakes called?", options: ["Geology", "Seismology", "Meteorology", "Oceanography"], answer: "Seismology" },
            { question: "In which ocean is the Bermuda Triangle located?", options: ["Pacific", "Indian", "Arctic", "Atlantic"], answer: "Atlantic" },
            { question: "What is 16 × 9?", options: ["142", "144", "146", "148"], answer: "144" },
            { question: "What is the smallest unit of matter?", options: ["Molecule", "Atom", "Electron", "Proton"], answer: "Atom" }
        ],
        hard: [
            { question: "What is the derivative of x²?", options: ["x", "2x", "x²", "2"], answer: "2x" },
            { question: "Who developed the theory of relativity?", options: ["Newton", "Einstein", "Galileo", "Tesla"], answer: "Einstein" },
            { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"], answer: "Mitochondria" },
            { question: "In which year was the Berlin Wall torn down?", options: ["1987", "1988", "1989", "1990"], answer: "1989" },
            { question: "What is the chemical formula for sulfuric acid?", options: ["HCl", "H2SO4", "HNO3", "H3PO4"], answer: "H2SO4" },
            { question: "What is the integral of 2x?", options: ["x²", "x² + C", "2x²", "2x² + C"], answer: "x² + C" },
            { question: "Which philosopher wrote 'The Republic'?", options: ["Aristotle", "Socrates", "Plato", "Kant"], answer: "Plato" },
            { question: "What is the half-life of Carbon-14?", options: ["5,730 years", "6,730 years", "4,730 years", "7,730 years"], answer: "5,730 years" },
            { question: "In quantum mechanics, what does the Schrödinger equation describe?", options: ["Energy", "Wave function", "Momentum", "Position"], answer: "Wave function" },
            { question: "What is the most abundant element in the universe?", options: ["Helium", "Oxygen", "Carbon", "Hydrogen"], answer: "Hydrogen" },
            { question: "Who composed 'The Four Seasons'?", options: ["Bach", "Mozart", "Vivaldi", "Beethoven"], answer: "Vivaldi" },
            { question: "What is the speed of sound in air at 20°C?", options: ["343 m/s", "340 m/s", "350 m/s", "360 m/s"], answer: "343 m/s" },
            { question: "Which programming language was developed by Bjarne Stroustrup?", options: ["Java", "Python", "C++", "JavaScript"], answer: "C++" },
            { question: "What is the Avogadro constant?", options: ["6.022 × 10²³", "6.022 × 10²²", "6.022 × 10²⁴", "6.022 × 10²¹"], answer: "6.022 × 10²³" },
            { question: "In which layer of the atmosphere do most weather phenomena occur?", options: ["Stratosphere", "Troposphere", "Mesosphere", "Thermosphere"], answer: "Troposphere" },
            { question: "What is the molecular formula for glucose?", options: ["C6H12O6", "C12H22O11", "C6H6", "C2H6O"], answer: "C6H12O6" },
            { question: "Who proved that DNA has a double helix structure?", options: ["Watson and Crick", "Mendel", "Darwin", "Pasteur"], answer: "Watson and Crick" },
            { question: "What is the uncertainty principle in quantum mechanics?", options: ["Heisenberg", "Schrödinger", "Planck", "Bohr"], answer: "Heisenberg" },
            { question: "Which element has the highest melting point?", options: ["Tungsten", "Carbon", "Rhenium", "Osmium"], answer: "Tungsten" },
            { question: "What is the equation for Einstein's mass-energy equivalence?", options: ["E = mc", "E = mc²", "E = m²c", "E = 2mc"], answer: "E = mc²" },
            { question: "In computer science, what does 'NP' stand for?", options: ["Not Polynomial", "Non-deterministic Polynomial", "New Programming", "Network Protocol"], answer: "Non-deterministic Polynomial" },
            { question: "What is the pH of pure water at 25°C?", options: ["6", "7", "8", "9"], answer: "7" },
            { question: "Who developed the periodic table?", options: ["Lavoisier", "Mendeleev", "Dalton", "Bohr"], answer: "Mendeleev" },
            { question: "What is the limit of (sin x)/x as x approaches 0?", options: ["0", "1", "∞", "undefined"], answer: "1" },
            { question: "Which particle was discovered by J.J. Thomson?", options: ["Proton", "Neutron", "Electron", "Photon"], answer: "Electron" },
            { question: "What is the second law of thermodynamics about?", options: ["Energy conservation", "Entropy", "Temperature", "Pressure"], answer: "Entropy" },
            { question: "In genetics, what does 'DNA' stand for?", options: ["Deoxyribonucleic Acid", "Dinitrogen Acid", "Dynamic Nuclear Acid", "Dextrose Nucleic Acid"], answer: "Deoxyribonucleic Acid" },
            { question: "What is the Planck constant approximately?", options: ["6.626 × 10⁻³⁴ J·s", "6.626 × 10⁻³³ J·s", "6.626 × 10⁻³⁵ J·s", "6.626 × 10⁻³² J·s"], answer: "6.626 × 10⁻³⁴ J·s" },
            { question: "Which mathematician proved Fermat's Last Theorem?", options: ["Gauss", "Euler", "Wiles", "Riemann"], answer: "Wiles" },
            { question: "What is the strongest force in nature?", options: ["Electromagnetic", "Weak nuclear", "Strong nuclear", "Gravitational"], answer: "Strong nuclear" },
            { question: "In organic chemistry, what is a benzene ring?", options: ["C6H6", "C6H12", "C5H5", "C7H7"], answer: "C6H6" },
            { question: "What is the critical angle for total internal reflection in water?", options: ["42°", "48.6°", "45°", "50°"], answer: "48.6°" },
            { question: "Who formulated the laws of planetary motion?", options: ["Galileo", "Newton", "Kepler", "Copernicus"], answer: "Kepler" },
            { question: "What is the standard model in particle physics?", options: ["Theory of everything", "Quantum field theory", "String theory", "Loop quantum gravity"], answer: "Quantum field theory" },
            { question: "In calculus, what is the derivative of ln(x)?", options: ["1/x", "x", "ln(x)", "e^x"], answer: "1/x" },
            { question: "What is the boiling point of nitrogen?", options: ["-196°C", "-186°C", "-206°C", "-176°C"], answer: "-196°C" },
            { question: "Which scientist proposed the continental drift theory?", options: ["Darwin", "Wegener", "Lyell", "Hutton"], answer: "Wegener" },
            { question: "What is the Fibonacci sequence rule?", options: ["F(n) = F(n-1) + F(n-2)", "F(n) = F(n-1) × F(n-2)", "F(n) = 2F(n-1)", "F(n) = F(n-1)²"], answer: "F(n) = F(n-1) + F(n-2)" },
            { question: "In computer science, what is the time complexity of quicksort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: "O(n log n)" },
            { question: "What is the escape velocity from Earth?", options: ["9.8 km/s", "11.2 km/s", "15.5 km/s", "7.9 km/s"], answer: "11.2 km/s" },
            { question: "Who discovered penicillin?", options: ["Pasteur", "Fleming", "Koch", "Lister"], answer: "Fleming" },
            { question: "What is the Goldbach conjecture about?", options: ["Prime numbers", "Even numbers", "Odd numbers", "Perfect numbers"], answer: "Even numbers" },
            { question: "In physics, what is the fine structure constant approximately?", options: ["1/137", "1/127", "1/147", "1/117"], answer: "1/137" },
            { question: "What is the most electronegative element?", options: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"], answer: "Fluorine" },
            { question: "Who developed game theory?", options: ["Nash", "von Neumann", "Morgenstern", "Smith"], answer: "von Neumann" },
            { question: "What is the Riemann hypothesis about?", options: ["Prime numbers", "Complex numbers", "Real numbers", "Rational numbers"], answer: "Prime numbers" },
            { question: "In biology, what is apoptosis?", options: ["Cell division", "Cell death", "Cell growth", "Cell mutation"], answer: "Cell death" },
            { question: "What is the Chandrasekhar limit?", options: ["1.4 solar masses", "2.4 solar masses", "0.4 solar masses", "3.4 solar masses"], answer: "1.4 solar masses" },
            { question: "Who proposed the double helix model of DNA?", options: ["Franklin", "Wilkins", "Watson and Crick", "Chargaff"], answer: "Watson and Crick" },
            { question: "What is the Heisenberg uncertainty principle formula?", options: ["Δx·Δp ≥ ℏ/2", "Δx·Δp ≥ ℏ", "Δx·Δp ≥ 2ℏ", "Δx·Δp ≥ ℏ/4"], answer: "Δx·Δp ≥ ℏ/2" },
            { question: "In mathematics, what is Euler's identity?", options: ["e^(iπ) + 1 = 0", "e^(iπ) - 1 = 0", "e^(iπ) = 1", "e^(iπ) = -1"], answer: "e^(iπ) + 1 = 0" },
            { question: "What is the standard temperature and pressure (STP)?", options: ["0°C, 1 atm", "25°C, 1 atm", "0°C, 1 bar", "20°C, 1 atm"], answer: "0°C, 1 atm" }
        ]
    };
}

// Email server configuration
const EMAIL_SERVER_URL = 'http://localhost:3001';

// Check server status
async function checkServerStatus() {
    const statusElement = document.getElementById('server-status');
    const iconElement = document.getElementById('status-icon');
    const textElement = document.getElementById('status-text');

    try {
        const response = await fetch(`${EMAIL_SERVER_URL}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000)
        });

        if (response.ok) {
            statusElement.className = 'server-status online';
            iconElement.className = 'fas fa-circle';
            textElement.textContent = 'Email server online - Real emails available';
        } else {
            throw new Error('Server not responding');
        }
    } catch (error) {
        statusElement.className = 'server-status offline';
        iconElement.className = 'fas fa-circle';
        textElement.textContent = 'Email server offline - Use "Generate Test Code"';
    }
}

// Initialize questions when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadQuestions();
    checkServerStatus();

    // Listen for email verification messages from popup window
    window.addEventListener('message', function (event) {
        if (event.data.type === 'EMAIL_VERIFIED') {
            alert('Email verified successfully! You can now login.');
            document.getElementById('confirmCode').value = 'VERIFIED';
            confirmationCode = 'VERIFIED';
        }
    });
});

// Advanced email sending with EmailJS (optional - requires setup)
function sendEmailWithEmailJS(email, code) {
    // This requires EmailJS setup - for now, we'll use the fallback method
    // You would need to:
    // 1. Create an EmailJS account
    // 2. Set up an email service
    // 3. Create an email template
    // 4. Get your public key and service/template IDs

    /*
    const templateParams = {
        to_email: email,
        confirmation_code: code,
        user_name: 'Quiz Master User'
    };
    
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            alert('Confirmation code sent successfully to ' + email);
        }, function(error) {
            console.error('EmailJS failed:', error);
            showAlternativeEmailMethod(email, code);
        });
    */

    // For now, use the alternative method
    showAlternativeEmailMethod(email, code);
}

// Generate random confirmation code
function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send confirmation code to email using real email server
async function sendConfirmationCode(buttonElement) {
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();

    if (!email) {
        alert('Please enter your email address first.');
        return;
    }

    if (!username) {
        alert('Please enter your username first.');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Get button element if not passed
    const button = buttonElement || document.querySelector('button[onclick="sendConfirmationCode()"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;

    try {
        // Check if server is running first
        const healthCheck = await fetch(`${EMAIL_SERVER_URL}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000) // 3 second timeout
        });

        if (!healthCheck.ok) {
            throw new Error('Email server not responding');
        }

        // Send verification email via server
        const response = await fetch(`${EMAIL_SERVER_URL}/send-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                username: username
            })
        });

        const result = await response.json();

        if (result.success) {
            confirmationCode = result.code; // For development - remove in production
            alert(`✅ Verification email sent successfully to ${email}!\n\nPlease check your email and enter the 6-digit code, or click the verification link in the email.\n\nThe email may take a few minutes to arrive. Check your spam folder if you don't see it.`);
        } else {
            throw new Error(result.error || 'Failed to send email');
        }

    } catch (error) {
        console.error('Email sending failed:', error);

        // Determine error type and provide appropriate fallback
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
            // Server not running
            alert(`🔧 Email server is not running!\n\nTo use real email sending:\n1. Double-click "start-server.bat" to start the email server\n2. Wait for "Server running on port 3001" message\n3. Then try again\n\nFor now, use "Generate Test Code" to continue.`);
        } else {
            // Other error
            alert(`❌ Email sending failed: ${error.message}\n\nUsing fallback method. Click "Generate Test Code" instead.`);
        }

    } finally {
        // Restore button state
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Alternative method when mailto fails
function showAlternativeEmailMethod(email, code) {
    const message = `
Email client couldn't be opened automatically.

Your confirmation code is: ${code}

Alternative options:
1. Use this code directly in the login form
2. Manually send yourself an email with this code
3. Copy this code: ${code}

The code is: ${code}
    `;

    alert(message);

    // Also copy to clipboard if possible
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            console.log('Code copied to clipboard');
        }).catch(err => {
            console.log('Could not copy to clipboard:', err);
        });
    }
}

// Generate test code for development/testing
function generateTestCode() {
    const email = document.getElementById('email').value.trim();
    if (!email) {
        alert('Please enter your email address first.');
        return;
    }

    confirmationCode = generateConfirmationCode();

    // Show the code directly for testing
    alert(`Test Confirmation Code Generated!\n\nYour code is: ${confirmationCode}\n\nYou can now use this code to login.\n\nNote: This is a test feature. In production, the code would be sent to your email.`);

    // Auto-fill the confirmation code field for convenience
    document.getElementById('confirmCode').value = confirmationCode;
}

// Login function
function login() {
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const enteredCode = document.getElementById('confirmCode').value.trim();

    // Validate all fields
    if (!email) {
        alert('Please enter your email address.');
        document.getElementById('email').focus();
        return;
    }

    if (!username) {
        alert('Please enter your username.');
        document.getElementById('username').focus();
        return;
    }

    if (!password) {
        alert('Please enter your password.');
        document.getElementById('password').focus();
        return;
    }

    if (!enteredCode) {
        alert('Please enter the confirmation code. Use "Generate Test Code" if you haven\'t received an email.');
        document.getElementById('confirmCode').focus();
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        document.getElementById('email').focus();
        return;
    }

    // Validate password length
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        document.getElementById('password').focus();
        return;
    }

    // Check confirmation code
    if (!confirmationCode && enteredCode !== 'VERIFIED') {
        alert('Please generate a confirmation code first by clicking "Send Code to Email" or "Generate Test Code".');
        return;
    }

    if (enteredCode !== confirmationCode && enteredCode !== 'VERIFIED') {
        alert('Invalid confirmation code. Please check the code and try again.\n\nTip: Use "Generate Test Code" for testing purposes.');
        document.getElementById('confirmCode').focus();
        return;
    }

    // Login successful
    isLoggedIn = true;
    currentUser = username;
    document.getElementById('logged-user').textContent = username;
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('quiz-app').classList.remove('hidden');

    // Success message
    setTimeout(() => {
        alert(`Welcome ${username}! You have successfully logged in to Quiz Master.`);
    }, 500);
}

// Logout function
function logout() {
    isLoggedIn = false;
    currentUser = '';
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('quiz-app').classList.add('hidden');

    // Reset form
    document.getElementById('email').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmCode').value = '';
    confirmationCode = '';
}

// Select difficulty
function selectDifficulty(level) {
    selectedDifficulty = level;

    // Remove selected class from all cards
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class to clicked card
    document.querySelector(`.difficulty-card.${level}`).classList.add('selected');

    // Show start button
    document.getElementById('start-quiz-btn').classList.remove('hidden');
}

// Start quiz
function startQuiz() {
    if (!selectedDifficulty) {
        alert('Please select a difficulty level first.');
        return;
    }

    console.log(`🚀 Starting ${selectedDifficulty} quiz...`);
    
    // Get 10 random questions from selected difficulty
    const allQuestions = questions[selectedDifficulty];
    
    if (!allQuestions || allQuestions.length === 0) {
        alert(`❌ No ${selectedDifficulty} questions available! Please try again or contact support.`);
        console.error(`No questions found for difficulty: ${selectedDifficulty}`);
        return;
    }
    
    console.log(`📚 Available ${selectedDifficulty} questions: ${allQuestions.length}`);
    
    currentQuiz = getRandomQuestions(allQuestions, 10);
    
    if (currentQuiz.length === 0) {
        alert('❌ Failed to load quiz questions! Please refresh and try again.');
        return;
    }
    
    console.log(`🎯 Quiz prepared with ${currentQuiz.length} questions`);
    
    currentIndex = 0;
    score = 0;
    timeLeft = 300; // 5 minutes
    quizStartTime = new Date();

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');

    startTimer();
    showQuestion();
}

// Get random questions
function getRandomQuestions(questionsArray, count) {
    if (!questionsArray || questionsArray.length === 0) {
        console.error('No questions available!');
        return [];
    }
    
    console.log(`🎯 Selecting ${count} random questions from ${questionsArray.length} available questions`);
    
    // If we have fewer questions than requested, duplicate some randomly
    if (questionsArray.length < count) {
        console.warn(`⚠️ Only ${questionsArray.length} questions available, but ${count} requested. Duplicating some questions.`);
        const extended = [];
        while (extended.length < count) {
            const remaining = count - extended.length;
            const toAdd = Math.min(remaining, questionsArray.length);
            const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
            extended.push(...shuffled.slice(0, toAdd));
        }
        return extended.slice(0, count);
    }
    
    // Normal case: shuffle and take the requested count
    const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    
    console.log(`✅ Selected ${selected.length} questions successfully`);
    return selected;
}

// Start timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

// Show question
function showQuestion() {
    const q = currentQuiz[currentIndex];
    document.getElementById('question').textContent = q.question;
    document.getElementById('current-q').textContent = currentIndex + 1;

    // Update progress bar
    const progress = ((currentIndex) / 10) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // Update progress percentage
    const progressPercentage = document.getElementById('progress-percentage');
    if (progressPercentage) {
        progressPercentage.textContent = Math.round(progress) + '%';
    }

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option, btn);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('feedback').textContent = '';
    document.getElementById('next-btn').classList.add('hidden');
}

// Check answer
function checkAnswer(selected, buttonElement) {
    const correct = currentQuiz[currentIndex].answer;
    const buttons = document.querySelectorAll('#options button');

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.classList.add('correct');
        } else if (btn === buttonElement && selected !== correct) {
            btn.classList.add('incorrect');
        }
    });

    if (selected === correct) {
        score++;
        document.getElementById('feedback').textContent = "Correct! ✓";
        document.getElementById('feedback').style.color = "#28a745";
    } else {
        document.getElementById('feedback').textContent = `Wrong! The correct answer is: ${correct}`;
        document.getElementById('feedback').style.color = "#dc3545";
    }

    document.getElementById('next-btn').classList.remove('hidden');
}

// Next question
function nextQuestion() {
    currentIndex++;
    if (currentIndex < currentQuiz.length) {
        showQuestion();
    } else {
        clearInterval(timer);
        showResult();
    }
}

// Show result
function showResult() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    const percentage = Math.round((score / 10) * 100);
    const completionTime = new Date();

    document.getElementById('score').textContent = `${score} / 10`;
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    document.getElementById('completion-time').textContent = completionTime.toLocaleString();

    // Update score emoji based on performance
    const scoreEmoji = document.getElementById('score-emoji');
    let emojiIcon = '🎯';
    
    if (percentage >= 90) {
        emojiIcon = '🏆';
    } else if (percentage >= 80) {
        emojiIcon = '🥇';
    } else if (percentage >= 70) {
        emojiIcon = '🥈';
    } else if (percentage >= 60) {
        emojiIcon = '🥉';
    } else {
        emojiIcon = '📚';
    }
    
    if (scoreEmoji) {
        scoreEmoji.textContent = emojiIcon;
    }

    // Performance level
    let performanceLevel = '';
    let message = '';

    if (percentage >= 90) {
        performanceLevel = '🏆 EXPERT LEVEL - LEGENDARY!';
        message = '🌟 Outstanding performance! You\'re a true quiz master! 🌟';
    } else if (percentage >= 80) {
        performanceLevel = '🥇 ADVANCED LEVEL - EXCELLENT!';
        message = '⭐ Excellent work! You have strong knowledge! ⭐';
    } else if (percentage >= 70) {
        performanceLevel = '🥈 INTERMEDIATE LEVEL - GOOD!';
        message = '👍 Good job! You\'re doing well! Keep it up! 👍';
    } else if (percentage >= 60) {
        performanceLevel = '🥉 BEGINNER LEVEL - NOT BAD!';
        message = '💪 Not bad! Keep practicing to improve! You can do it! 💪';
    } else {
        performanceLevel = '📚 NEEDS IMPROVEMENT - KEEP TRYING!';
        message = '🚀 Don\'t give up! Practice makes perfect! You\'ll get better! 🚀';
    }

    document.getElementById('performance-level').textContent = performanceLevel;
    document.getElementById('message').textContent = message;
}

// Set rating
function setRating(rating) {
    userRating = rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Submit feedback using real email server
async function submitFeedback(buttonElement) {
    const feedbackText = document.getElementById('feedbackText').value.trim();

    if (!feedbackText) {
        alert('Please enter your feedback.');
        return;
    }

    if (userRating === 0) {
        alert('Please select a rating.');
        return;
    }

    // Get button element if not passed
    const button = buttonElement || document.querySelector('button[onclick="submitFeedback()"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;

    try {
        // Send feedback via server
        const response = await fetch(`${EMAIL_SERVER_URL}/send-feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: currentUser,
                email: document.getElementById('email').value,
                difficulty: selectedDifficulty,
                score: `${score}/10 (${Math.round((score / 10) * 100)}%)`,
                rating: userRating,
                feedback: feedbackText,
                completionTime: new Date().toLocaleString()
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Thank you for your feedback! It has been sent successfully to our team.');
            document.getElementById('feedbackText').value = '';
            setRating(0);
        } else {
            throw new Error(result.error || 'Failed to send feedback');
        }

    } catch (error) {
        console.error('Feedback sending failed:', error);

        // Fallback to mailto
        const subject = 'Quiz Master - User Feedback';
        const body = `
User Feedback from Quiz Master:

Username: ${currentUser}
Difficulty Level: ${selectedDifficulty}
Score: ${score}/10 (${Math.round((score / 10) * 100)}%)
Rating: ${userRating}/5 stars
Completion Time: ${new Date().toLocaleString()}

Feedback:
${feedbackText}

---
This feedback was submitted through Quiz Master application.
        `;

        const mailtoLink = `mailto:ankitx3mummy941@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);

        alert('⚠️ Email server unavailable. Opening your email client as fallback.');
        document.getElementById('feedbackText').value = '';
        setRating(0);

    } finally {
        // Restore button state
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Restart quiz
function restartQuiz() {
    selectedDifficulty = '';
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById('start-quiz-btn').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}