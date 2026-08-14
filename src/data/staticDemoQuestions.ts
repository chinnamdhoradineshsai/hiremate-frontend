export interface StaticDemoQuestion {
  id: number;
  round_type: 'Aptitude' | 'Technical' | 'HR';
  question: string;
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswerLabel?: string;
  marks: number;
  explanation?: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const staticDemoQuestions: StaticDemoQuestion[] = [
  // ==================== APTITUDE ROUND (30 QUESTIONS: 10 EASY, 10 MEDIUM, 10 HARD) ====================
  // EASY (1-10)
  {
    id: 1,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
    options: ["120 meters", "150 meters", "180 meters", "320 meters"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Speed in m/s = 60 * (5/18) = 50/3 m/s. Length of train = Speed * Time = (50/3) * 9 = 150 meters.",
    topic: "Speed & Distance"
  },
  {
    id: 2,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "Find the next number in the series: 4, 11, 30, 67, 128, __?",
    options: ["195", "205", "219", "243"],
    correctAnswerIndex: 2,
    correctAnswerLabel: "C",
    marks: 1,
    explanation: "The series follows the pattern n^3 + 3 for n = 1, 2, 3, 4, 5, 6. For n = 6: 6^3 + 3 = 216 + 3 = 219.",
    topic: "Number Series"
  },
  {
    id: 3,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "If 12 engineers can deploy a cloud service in 15 days, how many days will 18 engineers take working at the same pace?",
    options: ["8 days", "10 days", "12 days", "14 days"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Total Work = 12 * 15 = 180 man-days. Days required by 18 engineers = 180 / 18 = 10 days.",
    topic: "Time & Work"
  },
  {
    id: 4,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "The ratio of ages of A and B is 4:5. After 6 years, their age ratio becomes 5:6. What is the present age of A?",
    options: ["18 years", "24 years", "30 years", "36 years"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Let ages be 4x and 5x. (4x + 6)/(5x + 6) = 5/6 => 24x + 36 = 25x + 30 => x = 6. Present age of A = 4 * 6 = 24 years.",
    topic: "Ratios & Ages"
  },
  {
    id: 5,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "A sum of money doubles itself at simple interest in 8 years. What is the annual interest rate?",
    options: ["10%", "12.5%", "15%", "20%"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Simple Interest SI = Principal P. Rate R = (SI * 100) / (P * T) = (P * 100) / (P * 8) = 12.5%.",
    topic: "Simple Interest"
  },
  {
    id: 6,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. If both open together, how long will it take to fill the tank?",
    options: ["10 minutes", "12 minutes", "15 minutes", "18 minutes"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Combined rate = 1/20 + 1/30 = (3+2)/60 = 5/60 = 1/12. Time taken = 12 minutes.",
    topic: "Pipes & Cisterns"
  },
  {
    id: 7,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "In how many different ways can the letters of the word 'LOGIC' be arranged?",
    options: ["60", "120", "180", "240"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "LOGIC has 5 distinct letters. Total permutations = 5! = 5 * 4 * 3 * 2 * 1 = 120 ways.",
    topic: "Permutations"
  },
  {
    id: 8,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "What is the probability of getting a sum of 8 when two fair dice are thrown simultaneously?",
    options: ["5/36", "1/6", "7/36", "1/4"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "Total outcomes = 36. Favorable outcomes for sum 8 are (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes. Probability = 5/36.",
    topic: "Probability"
  },
  {
    id: 9,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "A merchant marks an item 20% above cost price and allows a 10% discount. What is his net profit percentage?",
    options: ["8%", "10%", "12%", "15%"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "Let CP = 100. Marked Price = 120. Selling Price = 120 - 10% = 108. Net profit % = 8%.",
    topic: "Profit & Loss"
  },
  {
    id: 10,
    round_type: 'Aptitude',
    difficulty: 'easy',
    question: "Find the odd one out in the series: 3, 5, 11, 14, 17, 21",
    options: ["14", "17", "21", "11"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "14 is the only even number in the list; all other numbers in the set are odd.",
    topic: "Logical Classification"
  },

  // MEDIUM (11-20)
  {
    id: 11,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "An average of 5 numbers is 27. If one number is excluded, the average becomes 25. What is the excluded number?",
    options: ["30", "35", "37", "40"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Sum of 5 numbers = 5 * 27 = 135. Sum of remaining 4 numbers = 4 * 25 = 100. Excluded number = 135 - 100 = 35.",
    topic: "Averages"
  },
  {
    id: 12,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "If 15% of X is equal to 20% of Y, what is X : Y?",
    options: ["3 : 4", "4 : 3", "5 : 4", "2 : 3"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "15% * X = 20% * Y => 15X = 20Y => X/Y = 20/15 = 4/3 => X : Y = 4 : 3.",
    topic: "Percentages"
  },
  {
    id: 13,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "A boat goes 8 km upstream in 24 minutes and returns downstream in 16 minutes. What is the speed of the stream?",
    options: ["2.5 km/hr", "5 km/hr", "7.5 km/hr", "10 km/hr"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Upstream speed U = 8 / (24/60) = 20 km/h. Downstream speed D = 8 / (16/60) = 30 km/h. Stream speed = (D - U)/2 = (30 - 20)/2 = 5 km/h.",
    topic: "Boats & Streams"
  },
  {
    id: 14,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "Find the HCF of 42, 63, and 105.",
    options: ["7", "14", "21", "28"],
    correctAnswerIndex: 2,
    correctAnswerLabel: "C",
    marks: 1,
    explanation: "42 = 2 * 3 * 7, 63 = 3^2 * 7, 105 = 3 * 5 * 7. Highest Common Factor = 3 * 7 = 21.",
    topic: "HCF & LCM"
  },
  {
    id: 15,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "If A is B's brother, C is A's mother, D is C's father, and E is B's son, how is D related to E?",
    options: ["Grandfather", "Great Grandfather", "Father", "Uncle"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "C is mother of B. D is father of C => D is grandfather of B. E is son of B => D is great-grandfather of E.",
    topic: "Blood Relations"
  },
  {
    id: 16,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "A clock strikes 6 times in 5 seconds. How many seconds will it take to strike 11 times?",
    options: ["9 seconds", "10 seconds", "11 seconds", "12 seconds"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "6 strikes have 5 intervals taking 5 seconds => 1 interval = 1 second. 11 strikes have 10 intervals taking 10 seconds.",
    topic: "Clocks & Calendar"
  },
  {
    id: 17,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "What day of the week was 15th August 1947?",
    options: ["Thursday", "Friday", "Saturday", "Sunday"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Odd days calculation from year 1600 to 1947 yields 5 odd days, corresponding to Friday.",
    topic: "Calendars"
  },
  {
    id: 18,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "If CODING is written as DPEJOH in a code language, how is REASON written?",
    options: ["SFBTOP", "SFBTPO", "RFBTOP", "SFCUPO"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "Each letter is incremented by +1 in the alphabet. R->S, E->F, A->B, S->T, O->P, N->P... REASON becomes SFBTOP.",
    topic: "Coding Decoding"
  },
  {
    id: 19,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "Point A is 10m North of Point B. Point C is 10m East of Point A. In which direction is Point C with respect to B?",
    options: ["North-East", "North-West", "South-East", "South-West"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "Moving North then East places Point C in the North-East quadrant relative to Point B.",
    topic: "Direction Sense"
  },
  {
    id: 20,
    round_type: 'Aptitude',
    difficulty: 'medium',
    question: "The area of a square is 196 cm². What is the perimeter of the square?",
    options: ["28 cm", "48 cm", "56 cm", "64 cm"],
    correctAnswerIndex: 2,
    correctAnswerLabel: "C",
    marks: 1,
    explanation: "Side = sqrt(196) = 14 cm. Perimeter = 4 * 14 = 56 cm.",
    topic: "Mensuration"
  },

  // HARD (21-30)
  {
    id: 21,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "Evaluate: 0.008 * 0.02",
    options: ["0.00016", "0.0016", "0.016", "0.16"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "8 * 2 = 16. Total decimal places = 3 + 2 = 5 => 0.00016.",
    topic: "Decimal Operations"
  },
  {
    id: 22,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "Which of the following is a prime number?",
    options: ["51", "87", "91", "97"],
    correctAnswerIndex: 3,
    correctAnswerLabel: "D",
    marks: 1,
    explanation: "51=3*17, 87=3*29, 91=7*13. 97 is only divisible by 1 and 97, making it prime.",
    topic: "Number System"
  },
  {
    id: 23,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "The price of petrol increases by 25%. By what percentage must consumption be reduced to keep expenditure constant?",
    options: ["15%", "20%", "25%", "30%"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Reduction % = [R / (100 + R)] * 100 = [25 / 125] * 100 = 20%.",
    topic: "Percentages"
  },
  {
    id: 24,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "A 200m long train passes a 300m platform in 25 seconds. What is the speed of the train in km/hr?",
    options: ["54 km/h", "72 km/h", "90 km/h", "108 km/h"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Total Distance = 200 + 300 = 500m. Speed = 500 / 25 = 20 m/s = 20 * (18/5) = 72 km/h.",
    topic: "Speed & Distance"
  },
  {
    id: 25,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "Complete the series: Z, W, T, Q, N, __?",
    options: ["K", "L", "M", "J"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "Alphabet positions decrease by 3 each step: 26 (Z), 23 (W), 20 (T), 17 (Q), 14 (N), 11 (K).",
    topic: "Letter Series"
  },
  {
    id: 26,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "What is the compounding frequency if compound interest on $5,000 at 10% per annum yields $525 in 1 year?",
    options: ["Annually", "Half-Yearly", "Quarterly", "Monthly"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Half-yearly rate = 5% per 6 months. Amount = 5000 * (1.05)^2 = 5512.50 => Interest = $512.50...",
    topic: "Compound Interest"
  },
  {
    id: 27,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "Statements: All laptops are devices. Some devices are phones. Conclusion: I. Some laptops are phones. II. All devices are laptops.",
    options: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    correctAnswerIndex: 3,
    correctAnswerLabel: "D",
    marks: 1,
    explanation: "From given statements, neither conclusion necessarily follows.",
    topic: "Syllogisms"
  },
  {
    id: 28,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "A student scored 30% marks and failed by 15 marks. Another student scored 40% and got 15 marks more than pass mark. What is total marks?",
    options: ["200", "300", "400", "500"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Difference in % = 40% - 30% = 10%. Difference in marks = 15 + 15 = 30. Total marks = (30 / 10%) = 300.",
    topic: "Percentages"
  },
  {
    id: 29,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "Find the mean of numbers: 12, 18, 24, 30, 36.",
    options: ["20", "24", "26", "28"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Symmetric AP series mean = middle term = 24.",
    topic: "Statistics"
  },
  {
    id: 30,
    round_type: 'Aptitude',
    difficulty: 'hard',
    question: "If a car covers a distance of 180 km in 3 hours, what is its average speed in m/s?",
    options: ["16.67 m/s", "20 m/s", "25 m/s", "30 m/s"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "Speed = 180 / 3 = 60 km/h. In m/s = 60 * (5/18) = 16.67 m/s.",
    topic: "Speed Conversion"
  },

  // ==================== TECHNICAL ROUND (30 QUESTIONS: 10 EASY, 10 MEDIUM, 10 HARD) ====================
  // EASY (31-40)
  {
    id: 31,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "Which data structure is primarily used to implement Function Call Stack and Recursion in programming languages?",
    options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Function invocation records and local variables are pushed onto the Call Stack in LIFO (Last-In First-Out) order.",
    topic: "Data Structures"
  },
  {
    id: 32,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "In Python, which mutable data type is used for storing unordered unique elements?",
    options: ["List", "Tuple", "Set", "Dictionary"],
    correctAnswerIndex: 2,
    correctAnswerLabel: "C",
    marks: 1,
    explanation: "Sets in Python are mutable, unordered collections of unique hashable elements.",
    topic: "Python"
  },
  {
    id: 33,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "In Java, which keyword prevents a class from being inherited by child classes?",
    options: ["static", "final", "abstract", "private"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "The final keyword applied to a Java class prevents any sub-classing or extension.",
    topic: "Java"
  },
  {
    id: 34,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "Which HTTP status code signifies that the requested resource has been permanently moved to a new URI?",
    options: ["301 Moved Permanently", "302 Found", "404 Not Found", "500 Internal Error"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "HTTP 301 is a permanent redirect response code indicating that the resource has relocated permanently.",
    topic: "Computer Networks"
  },
  {
    id: 35,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "In JavaScript, what is the value of `typeof null`?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correctAnswerIndex: 2,
    correctAnswerLabel: "C",
    marks: 1,
    explanation: "Due to legacy implementation in JavaScript, typeof null returns 'object'.",
    topic: "JavaScript"
  },
  {
    id: 36,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "In React, which hook is used to perform side effects such as fetching data or subscribing to events in functional components?",
    options: ["useState", "useEffect", "useMemo", "useContext"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "useEffect is designed for imperative side effects in functional React components.",
    topic: "React"
  },
  {
    id: 37,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "In CSS Flexbox, which property aligns items along the cross axis?",
    options: ["justify-content", "align-items", "flex-direction", "grid-template"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "justify-content aligns items along the main axis; align-items aligns items along the cross axis.",
    topic: "CSS"
  },
  {
    id: 38,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "Which HTML5 tag is used to embed client-side vector graphics dynamically via JavaScript?",
    options: ["<canvas>", "<svg>", "<image>", "<embed>"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "The <canvas> element provides a bitmapped drawing surface programmable via JavaScript.",
    topic: "HTML"
  },
  {
    id: 39,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "In Git version control, which command creates a new branch and switches to it immediately?",
    options: ["git branch new-branch", "git checkout -b new-branch", "git commit -b new-branch", "git merge new-branch"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "git checkout -b <branch> (or git switch -c) creates the new branch and checks it out in a single step.",
    topic: "Git"
  },
  {
    id: 40,
    round_type: 'Technical',
    difficulty: 'easy',
    question: "What is the primary difference between IPv4 and IPv6?",
    options: ["IPv4 uses 32-bit addresses; IPv6 uses 128-bit addresses", "IPv4 is encrypted; IPv6 is unencrypted", "IPv4 runs over UDP; IPv6 runs over TCP", "IPv4 operates at Layer 7; IPv6 operates at Layer 3"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "IPv4 uses 32-bit (4-byte) addresses (~4.3B unique IPs), while IPv6 uses 128-bit (16-byte) hex addresses.",
    topic: "Computer Networks"
  },

  // MEDIUM (41-50)
  {
    id: 41,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "In relational databases, which ACID property guarantees that database transactions are committed permanently even in case of system failure?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctAnswerIndex: 3,
    correctAnswerLabel: "D",
    marks: 1,
    explanation: "Durability guarantees that once a transaction commits, its effects survive power loss, crashes, or system outages.",
    topic: "DBMS"
  },
  {
    id: 42,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "What is the primary function of the Virtual Memory system in modern Operating Systems?",
    options: ["Increase CPU clock rate", "Provide memory isolation and address space expansion beyond physical RAM", "Speed up GPU rendering", "Compress disk files"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Virtual memory maps process address spaces to physical RAM and secondary disk storage while enforcing process isolation.",
    topic: "Operating Systems"
  },
  {
    id: 43,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "In SQL, which join returns all rows from the left table and matched rows from the right table?",
    options: ["INNER JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "LEFT OUTER JOIN retrieves all records from the left table regardless of whether a matching record exists in the right table.",
    topic: "SQL"
  },
  {
    id: 44,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "Which OSI model layer handles end-to-end flow control, segmentation, and error recovery (e.g. TCP/UDP)?",
    options: ["Network Layer", "Transport Layer", "Data Link Layer", "Session Layer"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Layer 4 (Transport Layer) manages host-to-host process communication, packet segmentation, and error control.",
    topic: "Computer Networks"
  },
  {
    id: 45,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "In Object-Oriented Programming, what is Polymorphism?",
    options: ["Hiding internal implementation details", "Ability of a message or function call to take multiple forms depending on context", "Creating multiple objects from a single class", "Binding data with methods into a single unit"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Polymorphism allows objects of different types to respond to method calls with identical signatures in type-specific ways.",
    topic: "OOP"
  },
  {
    id: 46,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "Which Spring Boot annotation marks a class as a RESTful web controller returning JSON/XML directly in response body?",
    options: ["@Controller", "@RestController", "@Service", "@Component"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "@RestController combines @Controller and @ResponseBody, serializing return objects directly to HTTP response bodies.",
    topic: "Spring Boot"
  },
  {
    id: 47,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "What is the difference between processes and threads?",
    options: ["Processes share memory; threads have separate memory spaces", "Threads share memory space of parent process; processes have isolated memory spaces", "Threads run on GPU; processes run on CPU", "Processes cannot communicate with each other"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Threads are lightweight execution units operating within a process's shared virtual memory address space.",
    topic: "Operating Systems"
  },
  {
    id: 48,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "In RESTful API design, which HTTP method should be idempotent and used to completely replace an existing resource?",
    options: ["POST", "PUT", "PATCH", "DELETE"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "PUT is idempotent and replaces the target resource representation in full.",
    topic: "API Architecture"
  },
  {
    id: 49,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "Which Docker component contains read-only instructions for creating a runnable container instance?",
    options: ["Container", "Dockerfile / Image", "Volume", "Bridge Network"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "A Docker Image is an immutable template containing application code, dependencies, and environment setup.",
    topic: "DevOps"
  },
  {
    id: 50,
    round_type: 'Technical',
    difficulty: 'medium',
    question: "In JavaScript, what is Closure?",
    options: ["Function bundled together with references to its surrounding lexical state", "A function without a return statement", "A method that terminates process execution", "A block scoping statement"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "A closure gives an inner function access to variables in its enclosing scope even after outer function execution finishes.",
    topic: "JavaScript"
  },

  // HARD (51-60)
  {
    id: 51,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "What is the worst-case time complexity of QuickSelect algorithm for finding the k-th smallest element?",
    options: ["O(N log N)", "O(N²)", "O(N)", "O(1)"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "QuickSelect has an average time complexity of O(N), but worst-case time complexity of O(N²) when bad pivots are chosen.",
    topic: "Algorithms"
  },
  {
    id: 52,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "What is the time complexity to search an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Tree height in balanced BSTs is kept at O(log N), ensuring lookup time complexity remains O(log N).",
    topic: "Data Structures"
  },
  {
    id: 53,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "Which indexing structure is commonly used by BDBMS databases like PostgreSQL and MySQL InnoDB for range queries?",
    options: ["Hash Index", "B+ Tree Index", "Bitmap Index", "Inverted Index"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "B+ Trees store data pointers in linked leaf nodes, making sequential range queries efficient.",
    topic: "DBMS"
  },
  {
    id: 54,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "In Operating Systems, what condition causes a Deadlock?",
    options: ["Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait", "Paging, Swapping, Thrashing, Segmentation", "SJF, Round Robin, Priority, FCFS", "Mutex, Semaphore, Monitor, Lock"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "Coffman conditions state that deadlock occurs if and only if Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait hold simultaneously.",
    topic: "Operating Systems"
  },
  {
    id: 55,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "In Python GIL (Global Interpreter Lock), what is its primary effect on multi-threaded programs?",
    options: ["Accelerates I/O bound execution", "Prevents multiple native threads from executing Python bytecode simultaneously", "Enforces memory garbage collection", "Provides automatic thread safety"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "GIL restricts CPython execution so only one thread executes Python bytecode at any given moment.",
    topic: "Python"
  },
  {
    id: 56,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "Which sorting algorithm operates with a guaranteed worst-case time complexity of O(N log N)?",
    options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Insertion Sort"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Merge Sort consistently divides arrays in halves and merges them in O(N log N) time even in worst case.",
    topic: "Algorithms"
  },
  {
    id: 57,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "In Microservice architectures, what is the role of an API Gateway?",
    options: ["Executes database SQL joins", "Single entry point handling routing, security, rate limiting, and request aggregation", "Stores persistent blob files", "Generates SSL certificates"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "An API Gateway proxies incoming traffic, enforcing authentication, rate limits, SSL termination, and routing.",
    topic: "System Architecture"
  },
  {
    id: 58,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "Which hashing algorithm collision resistance vulnerability led to MD5 deprecation in cryptographic applications?",
    options: ["Collision vulnerability where different inputs produce identical hash outputs", "High memory usage", "Slow hash generation speed", "Non-deterministic behavior"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "MD5 suffers from cryptographic collision attacks where distinct inputs yield identical 128-bit hashes.",
    topic: "Security"
  },
  {
    id: 59,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "In React, what causes component re-rendering?",
    options: ["Changes in component props, state, or parent re-renders", "Calling console.log", "Declaring local variables", "Importing CSS styles"],
    correctAnswerIndex: 0,
    correctAnswerLabel: "A",
    marks: 1,
    explanation: "React components trigger re-render cycles when internal state changes, props update, or parent components re-render.",
    topic: "React"
  },
  {
    id: 60,
    round_type: 'Technical',
    difficulty: 'hard',
    question: "What is the main advantage of Redis in web application architectures?",
    options: ["Relational schema integrity", "In-memory data store providing sub-millisecond read/write latencies for caching and session state", "Automatic video compression", "Cold storage backup"],
    correctAnswerIndex: 1,
    correctAnswerLabel: "B",
    marks: 1,
    explanation: "Redis keeps data structures in main memory, providing microsecond lookup speeds ideal for caching.",
    topic: "System Architecture"
  },

  // ==================== HR ROUND (10 QUESTIONS: 3 EASY, 3 MEDIUM, 4 HARD) ====================
  // EASY (61-63)
  {
    id: 61,
    round_type: 'HR',
    difficulty: 'easy',
    question: "Tell me about yourself, your academic background, and your key technical interests.",
    marks: 1,
    topic: "Self Introduction"
  },
  {
    id: 62,
    round_type: 'HR',
    difficulty: 'easy',
    question: "What are your core technical strengths, and how do you leverage them in software projects?",
    marks: 1,
    topic: "Strengths"
  },
  {
    id: 63,
    round_type: 'HR',
    difficulty: 'easy',
    question: "Why do you want to join our organization specifically, and what excites you about our engineering culture?",
    marks: 1,
    topic: "Company Alignment"
  },

  // MEDIUM (64-66)
  {
    id: 64,
    round_type: 'HR',
    difficulty: 'medium',
    question: "Describe a major technical or personal challenge you faced and how you successfully navigated it.",
    marks: 1,
    topic: "Problem Solving & Resilience"
  },
  {
    id: 65,
    round_type: 'HR',
    difficulty: 'medium',
    question: "How do you handle pressure, tight deadlines, or shifting project requirements?",
    marks: 1,
    topic: "Stress Management"
  },
  {
    id: 66,
    round_type: 'HR',
    difficulty: 'medium',
    question: "Describe a situation where you collaborated with a team to accomplish a challenging goal.",
    marks: 1,
    topic: "Teamwork & Collaboration"
  },

  // HARD (67-70)
  {
    id: 67,
    round_type: 'HR',
    difficulty: 'hard',
    question: "Tell me about a major technical or project failure you experienced, and what key lessons you learned from it.",
    marks: 1,
    topic: "Failure & Accountability"
  },
  {
    id: 68,
    round_type: 'HR',
    difficulty: 'hard',
    question: "How would you handle a serious technical disagreement with your engineering manager or lead architect?",
    marks: 1,
    topic: "Conflict Management"
  },
  {
    id: 69,
    round_type: 'HR',
    difficulty: 'hard',
    question: "Describe a situation where you had to make a critical engineering decision with incomplete information.",
    marks: 1,
    topic: "Decision Making Under Uncertainty"
  },
  {
    id: 70,
    round_type: 'HR',
    difficulty: 'hard',
    question: "Why should we hire you over another equally qualified candidate with similar technical skills?",
    marks: 1,
    topic: "Value Proposition"
  }
];
