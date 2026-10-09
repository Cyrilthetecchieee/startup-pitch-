import { QuoteItem, HealthFactItem, ArticleItem, ChallengeItem } from '@/types';

export const SEEDED_QUOTES: QuoteItem[] = [
  { id: 'q1', text: 'Action is the foundational key to all success.', category: 'Discipline', author: 'Pablo Picasso', isMotivationOnly: true },
  { id: 'q2', text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', category: 'Consistency', author: 'Will Durant', isMotivationOnly: true },
  { id: 'q3', text: 'The secret of getting ahead is getting started.', category: 'Focus', author: 'Mark Twain', isMotivationOnly: true },
  { id: 'q4', text: 'It never gets easier, you just get better.', category: 'Resilience', author: 'Greg LeMond', isMotivationOnly: true },
  { id: 'q5', text: 'Do something today that your future self will thank you for.', category: 'Mindset', author: 'Sean Patrick Flanery', isMotivationOnly: true },
  { id: 'q6', text: 'Discipline is choosing between what you want now and what you want most.', category: 'Discipline', author: 'Abraham Lincoln', isMotivationOnly: true },
  { id: 'q7', text: 'Strength does not come from physical capacity. It comes from an indomitable will.', category: 'Resilience', author: 'Mahatma Gandhi', isMotivationOnly: true },
  { id: 'q8', text: 'Small disciplines repeated with consistency every day lead to great achievements.', category: 'Consistency', author: 'John C. Maxwell', isMotivationOnly: true },
  { id: 'q9', text: 'Success isn’t always about greatness. It’s about consistency.', category: 'Consistency', author: 'Dwayne Johnson', isMotivationOnly: true },
  { id: 'q10', text: 'Energy and persistence conquer all things.', category: 'Resilience', author: 'Benjamin Franklin', isMotivationOnly: true },
  { id: 'q11', text: 'You don’t have to be extreme, just consistent.', category: 'Consistency', author: 'FitSphere Philosophy', isMotivationOnly: true },
  { id: 'q12', text: 'The only bad workout is the one that didn’t happen.', category: 'Mindset', author: 'Fitness Maxim', isMotivationOnly: true },
  { id: 'q13', text: 'Focus on progress, not perfection.', category: 'Focus', author: 'Bill Phillips', isMotivationOnly: true },
  { id: 'q14', text: 'What hurts today makes you stronger tomorrow.', category: 'Resilience', author: 'Jay Cutler', isMotivationOnly: true },
  { id: 'q15', text: 'Your body can stand almost anything; it’s your mind that you have to convince.', category: 'Mindset', author: 'Coaching Maxim', isMotivationOnly: true },
  { id: 'q16', text: 'Rome was not built in a day, but they worked on it every single day.', category: 'Consistency', author: 'Proverb', isMotivationOnly: true },
  { id: 'q17', text: 'The hard days are the best days because that’s when champions are made.', category: 'Resilience', author: 'Gabby Douglas', isMotivationOnly: true },
  { id: 'q18', text: 'Believe you can and you’re halfway there.', category: 'Mindset', author: 'Theodore Roosevelt', isMotivationOnly: true },
  { id: 'q19', text: 'Champions keep playing until they get it right.', category: 'Discipline', author: 'Billie Jean King', isMotivationOnly: true },
  { id: 'q20', text: 'Don’t count the days, make the days count.', category: 'Focus', author: 'Muhammad Ali', isMotivationOnly: true },
  { id: 'q21', text: 'Motivation gets you going, but discipline keeps you growing.', category: 'Discipline', author: 'John C. Maxwell', isMotivationOnly: true },
  { id: 'q22', text: 'Tough times never last, but tough people do.', category: 'Resilience', author: 'Robert H. Schuller', isMotivationOnly: true },
  { id: 'q23', text: 'Commitment means staying loyal to what you said you were going to do.', category: 'Consistency', author: 'Inky Johnson', isMotivationOnly: true },
  { id: 'q24', text: 'Doubt is a killer. You just have to know who you are and what you stand for.', category: 'Mindset', author: 'Jennifer Lopez', isMotivationOnly: true },
  { id: 'q25', text: 'Continuous effort—not strength or intelligence—is the key to unlocking our potential.', category: 'Discipline', author: 'Winston Churchill', isMotivationOnly: true },
  { id: 'q26', text: 'If you want something you’ve never had, you must be willing to do something you’ve never done.', category: 'Mindset', author: 'Thomas Jefferson', isMotivationOnly: true },
  { id: 'q27', text: 'The difference between the impossible and the possible lies in a person’s determination.', category: 'Resilience', author: 'Tommy Lasorda', isMotivationOnly: true },
  { id: 'q28', text: 'Great things come from hard work and perseverance. No excuses.', category: 'Discipline', author: 'Kobe Bryant', isMotivationOnly: true },
  { id: 'q29', text: 'Do not wait to strike till the iron is hot; but make it hot by striking.', category: 'Focus', author: 'William Butler Yeats', isMotivationOnly: true },
  { id: 'q30', text: 'Either you run the day or the day runs you.', category: 'Focus', author: 'Jim Rohn', isMotivationOnly: true },
  { id: 'q31', text: 'Nothing will work unless you do.', category: 'Discipline', author: 'Maya Angelou', isMotivationOnly: true },
  { id: 'q32', text: 'Perseverance is the hard work you do after you get tired of doing the hard work.', category: 'Resilience', author: 'Newt Gingrich', isMotivationOnly: true },
  { id: 'q33', text: 'Set your goals high, and don’t stop till you get there.', category: 'Focus', author: 'Bo Jackson', isMotivationOnly: true },
  { id: 'q34', text: 'A champion is someone who gets up when he can’t.', category: 'Resilience', author: 'Jack Dempsey', isMotivationOnly: true },
  { id: 'q35', text: 'You miss 100% of the shots you don’t take.', category: 'Mindset', author: 'Wayne Gretzky', isMotivationOnly: true },
  { id: 'q36', text: 'It’s not whether you get knocked down; it’s whether you get up.', category: 'Resilience', author: 'Vince Lombardi', isMotivationOnly: true },
  { id: 'q37', text: 'Success starts with self-discipline.', category: 'Discipline', author: 'Dwayne Johnson', isMotivationOnly: true },
  { id: 'q38', text: 'The clock is ticking. Are you becoming the person you want to be?', category: 'Focus', author: 'Greg Plitt', isMotivationOnly: true },
  { id: 'q39', text: 'You are one workout away from a good mood.', category: 'Mindset', author: 'Fitness Maxim', isMotivationOnly: true },
  { id: 'q40', text: 'When you feel like quitting, remember why you started.', category: 'Mindset', author: 'Unknown', isMotivationOnly: true },
  { id: 'q41', text: 'Discipline is the bridge between thought and accomplishment.', category: 'Discipline', author: 'Jim Rohn', isMotivationOnly: true },
  { id: 'q42', text: 'Push yourself, because no one else is going to do it for you.', category: 'Focus', author: 'FitSphere Ethos', isMotivationOnly: true },
  { id: 'q43', text: 'Great achievements are nurtured with daily drops of sweat.', category: 'Consistency', author: 'Athletic Axiom', isMotivationOnly: true },
  { id: 'q44', text: 'You don’t drown by falling in the water; you drown by staying there.', category: 'Resilience', author: 'Edwin Louis Cole', isMotivationOnly: true },
  { id: 'q45', text: 'Focus on the step in front of you, not the whole staircase.', category: 'Focus', author: 'Martin Luther King Jr.', isMotivationOnly: true },
  { id: 'q46', text: 'Sweat is just fat crying.', category: 'Mindset', author: 'Classic Gym Axiom', isMotivationOnly: true },
  { id: 'q47', text: 'Patience and persistence are the master keys to mastery.', category: 'Consistency', author: 'Fitness Proverb', isMotivationOnly: true },
  { id: 'q48', text: 'Wake up with determination. Go to bed with satisfaction.', category: 'Discipline', author: 'George Horace Lorimer', isMotivationOnly: true },
  { id: 'q49', text: 'The pain you feel today will be the strength you feel tomorrow.', category: 'Resilience', author: 'Arnold Schwarzenegger', isMotivationOnly: true },
  { id: 'q50', text: 'Physical fitness is not only one of the most important keys to a healthy body, it is the basis of dynamic and creative intellectual activity.', category: 'Mindset', author: 'John F. Kennedy', isMotivationOnly: true },
  { id: 'q51', text: 'Show up, lock in, execute.', category: 'Discipline', author: 'Coach Marcus', isMotivationOnly: true },
  { id: 'q52', text: 'The iron never lies to you.', category: 'Mindset', author: 'Henry Rollins', isMotivationOnly: true },
];

export const SEEDED_HEALTH_FACTS: HealthFactItem[] = [
  { id: 'f1', text: 'Adults should undertake 150–300 minutes of moderate-intensity aerobic physical activity per week for substantial health benefits.', category: 'Cardiovascular', sourceName: 'WHO Physical Activity Guidelines', sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity' },
  { id: 'f2', text: 'Muscle-strengthening activities involving all major muscle groups at least 2 days a week provide additional health benefits and reduce all-cause mortality.', category: 'Strength', sourceName: 'CDC Physical Activity Basics', sourceUrl: 'https://www.cdc.gov/physicalactivity/basics/adults/index.htm' },
  { id: 'f3', text: 'Resistance training increases resting metabolic rate and bone mineral density, significantly lowering osteopenia risk.', category: 'Strength', sourceName: 'American College of Sports Medicine (ACSM)', sourceUrl: 'https://www.acsm.org' },
  { id: 'f4', text: 'Adequate sleep (7–9 hours for adults) is essential for muscle protein synthesis and growth hormone release during slow-wave sleep.', category: 'Sleep & Recovery', sourceName: 'National Institutes of Health (NIH)', sourceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3880190/' },
  { id: 'f5', text: 'Consuming 1.6 to 2.2 grams of protein per kilogram of body weight per day optimizes muscle hypertrophy in resistance-trained individuals.', category: 'Nutrition', sourceName: 'British Journal of Sports Medicine (BJSM)', sourceUrl: 'https://bjsm.bmj.com/content/52/6/376' },
  { id: 'f6', text: 'Chronic dehydration of even 2% body mass impairs cognitive function, aerobic performance, and maximal voluntary muscle force.', category: 'Nutrition', sourceName: 'ACSM Position Stand on Hydration', sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/17277604/' },
  { id: 'f7', text: 'Regular aerobic exercise promotes neurogenesis in the hippocampus, improving spatial memory and executive cognitive function.', category: 'Longevity', sourceName: 'Harvard Health Publishing', sourceUrl: 'https://www.health.harvard.edu/mind-and-mood/exercise-is-an-all-natural-treatment-to-fight-depression' },
  { id: 'f8', text: 'Zone 2 cardio training builds mitochondrial density and elevates fat oxidation capacity at submaximal workloads.', category: 'Metabolism', sourceName: 'ACSM Exercise Physiology Reviews', sourceUrl: 'https://www.acsm.org' },
  { id: 'f9', text: 'High-intensity interval training (HIIT) significantly improves VO2 max in shorter training durations compared to moderate continuous training.', category: 'Cardiovascular', sourceName: 'CDC & NIH Clinical Studies', sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/26479856/' },
  { id: 'f10', text: 'Post-exercise carbohydrate ingestion along with protein accelerates glycogen resynthesis within the first two hours of recovery.', category: 'Recovery', sourceName: 'International Society of Sports Nutrition (ISSN)', sourceUrl: 'https://jissn.biomedcentral.com/articles/10.1186/s12970-018-0242-y' },
  { id: 'f11', text: 'Dynamic stretching prior to workouts increases range of motion without impairing maximal muscle force production.', category: 'Strength', sourceName: 'European Journal of Applied Physiology', sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/21735220/' },
  { id: 'f12', text: 'Prolonged sitting (>8 hours/day) without physical activity has cardiovascular mortality risks comparable to smoking and obesity.', category: 'Longevity', sourceName: 'Lancet Physical Activity Series / WHO', sourceUrl: 'https://www.thelancet.com/series/physical-activity' },
  { id: 'f13', text: 'Eccentric contractions induce greater muscle damage and mechanically stimulate higher type II fiber recruitment than concentric contractions alone.', category: 'Strength', sourceName: 'Journal of Strength and Conditioning Research', sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/17685689/' },
  { id: 'f14', text: 'Cardiorespiratory fitness is an independent predictor of all-cause mortality, with each 1-MET increase associated with a 13% reduction in risk.', category: 'Cardiovascular', sourceName: 'Circulation (American Heart Association)', sourceUrl: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000461' },
  { id: 'f15', text: 'Creatine monohydrate supplementation is one of the most thoroughly researched and effective ergogenic aids for high-intensity exercise capacity.', category: 'Nutrition', sourceName: 'ISSN Position Stand: Creatine', sourceUrl: 'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z' },
  { id: 'f16', text: 'Active recovery protocols (such as low-intensity cycling) clear blood lactate faster than passive rest following strenuous sets.', category: 'Recovery', sourceName: 'Sports Medicine Review', sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/20840561/' },
  { id: 'f17', text: 'Sleep deprivation significantly decreases testosterone and increases cortisol, impairing neuromuscular recovery and tissue repair.', category: 'Sleep & Recovery', sourceName: 'Journal of the American Medical Association (JAMA)', sourceUrl: 'https://jamanetwork.com/journals/jama/fullarticle/1029191' },
  { id: 'f18', text: 'Grip strength is correlated with cardiovascular health and serves as a reliable clinical biomarker of biological aging in adults.', category: 'Longevity', sourceName: 'NHS & BMJ Clinical Research', sourceUrl: 'https://www.bmj.com/content/361/bmj.k1651' },
  { id: 'f19', text: 'Electrolyte balance (sodium, potassium, magnesium) is crucial to maintain membrane potentials and prevent exercise-associated muscle cramping.', category: 'Nutrition', sourceName: 'NIH Office of Dietary Supplements', sourceUrl: 'https://ods.od.nih.gov' },
  { id: 'f20', text: 'Walking 7,000 to 10,000 steps per day is associated with a 50% to 70% lower risk of premature mortality compared to <4,000 steps.', category: 'Longevity', sourceName: 'JAMA Network Open', sourceUrl: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2783784' },
  { id: 'f21', text: 'Progressive overload—gradually increasing weight, reps, or volume—is the primary mechanical stimulus required for muscular hypertrophy.', category: 'Strength', sourceName: 'ACSM Guidelines for Exercise Testing', sourceUrl: 'https://www.acsm.org' },
  { id: 'f22', text: 'Cold water immersion immediately following resistance training may attenuate long-term hypertrophy adaptations by blunting inflammatory signaling.', category: 'Recovery', sourceName: 'Journal of Physiology', sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/26174818/' },
  { id: 'f23', text: 'A balanced diet rich in polyphenols and omega-3 fatty acids reduces markers of systemic inflammation (CRP and IL-6) post-strenuous exercise.', category: 'Nutrition', sourceName: 'Harvard School of Public Health', sourceUrl: 'https://www.hsph.harvard.edu/nutritionsource/' },
  { id: 'f24', text: 'Isometric exercise training produces significant reductions in systolic and diastolic resting blood pressure.', category: 'Cardiovascular', sourceName: 'British Journal of Sports Medicine', sourceUrl: 'https://bjsm.bmj.com/content/57/20/1317' },
  { id: 'f25', text: 'Maintaining adequate muscle mass into older age reduces the incidence of falls, fractures, and loss of independence.', category: 'Longevity', sourceName: 'CDC Healthy Aging Program', sourceUrl: 'https://www.cdc.gov/aging/index.html' },
  { id: 'f26', text: 'Caffeine ingestion (3-6 mg/kg) improves endurance capacity and muscular endurance when taken 45-60 minutes pre-workout.', category: 'Nutrition', sourceName: 'ISSN Position Stand: Caffeine and Performance', sourceUrl: 'https://jissn.biomedcentral.com/articles/10.1186/s12970-020-00383-4' },
  { id: 'f27', text: 'Compound multi-joint exercises elicit higher hormonal and metabolic responses than isolated single-joint movements.', category: 'Strength', sourceName: 'ACSM Exercise Science Manual', sourceUrl: 'https://www.acsm.org' },
  { id: 'f28', text: 'Heart Rate Variability (HRV) is a validated non-invasive marker of autonomic nervous system readiness and systemic recovery.', category: 'Recovery', sourceName: 'Frontiers in Public Health', sourceUrl: 'https://www.frontiersin.org/articles/10.3389/fpubh.2017.00258/full' },
  { id: 'f29', text: 'Regular exercise reduces resting heart rate by increasing stroke volume through eccentric left ventricular hypertrophy.', category: 'Cardiovascular', sourceName: 'American Heart Association', sourceUrl: 'https://www.heart.org' },
  { id: 'f30', text: 'Vitamin D plays a critical role in skeletal muscle contractility and immune response; deficiency impairs muscle strength.', category: 'Nutrition', sourceName: 'NIH MedlinePlus', sourceUrl: 'https://medlineplus.gov' },
  { id: 'f31', text: 'Foam rolling and myofascial release acutely increase joint range of motion without decreasing muscle power output.', category: 'Recovery', sourceName: 'International Journal of Sports Physical Therapy', sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/26618062/' },
  { id: 'f32', text: 'Proper diaphragmatic breathing downregulates the sympathetic nervous system and accelerates post-session recovery.', category: 'Sleep & Recovery', sourceName: 'Harvard Medical School', sourceUrl: 'https://www.health.harvard.edu' },
];

export const SEEDED_ARTICLES: ArticleItem[] = [
  {
    id: 'art_hypertrophy',
    title: 'The Science of Muscular Hypertrophy: Volume, Intensity, and Overload',
    body: `Muscular hypertrophy occurs through three primary mechanisms: mechanical tension, muscle damage, and metabolic stress. 
Of these three, mechanical tension is undeniably the primary driver. To maximize hypertrophic adaptations, athletes should prioritize training in the 6–12 rep range with 1–3 reps in reserve (RIR), ensuring weekly volume across each major muscle group ranges between 10 to 20 hard working sets. 

Consistency in exercise selection allows for trackable progressive overload. Avoid switching movements every week; master fundamental barbell, dumbbell, and cable patterns over 8–12 week mesocycles.`,
    category: 'Training',
    tags: ['Hypertrophy', 'Strength', 'Programming'],
    readTimeMin: 4,
    sourceName: 'ACSM & Journal of Strength and Conditioning Research',
    sourceUrl: 'https://www.acsm.org',
  },
  {
    id: 'art_zone2',
    title: 'Why Zone 2 Cardio is the Foundation of Athletic Longevity',
    body: `Zone 2 training is defined as exercise intensity where lactate production matches lactate clearance, typically around 60–70% of maximum heart rate. 
Training in this zone stimulates mitochondrial biogenesis, enhances the efficiency of fat oxidation, and builds capillary density in slow-twitch muscle fibers. 

By dedicating 2 to 3 sessions of 45 minutes each week to Zone 2, you improve recovery between heavy lifting sets and substantially decrease resting heart rate and arterial stiffness.`,
    category: 'Training',
    tags: ['Cardio', 'Mitochondria', 'Endurance'],
    readTimeMin: 3,
    sourceName: 'Mayo Clinic & British Journal of Sports Medicine',
    sourceUrl: 'https://bjsm.bmj.com',
  },
  {
    id: 'art_sleep_recovery',
    title: 'The Anabolic Power of Sleep: Neuroendocrine Recovery Protocols',
    body: `Sleep is when systemic physiological adaptation occurs. During stages 3 and 4 of non-REM sleep (slow-wave sleep), human growth hormone (HGH) peaks, facilitating tissue regeneration and protein synthesis. 
Chronic sleep restriction (<6 hours/night) has been shown to reduce myofibrillar protein synthesis by up to 18% and increase cortisol levels, creating a catabolic hormonal environment. 

Key sleep hygiene rules: maintain a consistent sleep-wake schedule, keep room temperature around 18°C (65°F), avoid bright screen light 60 minutes before bed, and cease caffeine intake 8 hours prior to bedtime.`,
    category: 'Recovery',
    tags: ['Sleep', 'Hormones', 'Recovery'],
    readTimeMin: 5,
    sourceName: 'NIH & National Sleep Foundation',
    sourceUrl: 'https://www.sleepfoundation.org',
  },
  {
    id: 'art_protein',
    title: 'Protein Timing vs. Total Daily Intake: What the Research Shows',
    body: `While the classic '30-minute anabolic window' has been shown to be far wider than previously believed (lasting several hours post-training), total daily protein intake remains paramount. 
For resistance training athletes, aiming for 1.6 to 2.2 grams per kilogram of body weight per day distributed across 3 to 5 meals (each providing at least 2.5 to 3 grams of leucine) optimizes muscle protein synthesis (MPS). 

Consuming a slow-digesting protein source like casein before bed can also support sustained amino acid availability through the overnight recovery fast.`,
    category: 'Nutrition',
    tags: ['Nutrition', 'Protein', 'Timing'],
    readTimeMin: 4,
    sourceName: 'International Society of Sports Nutrition (ISSN)',
    sourceUrl: 'https://jissn.biomedcentral.com',
  },
  {
    id: 'art_warmup',
    title: 'Injury Prevention: Warm-Up Protocols and Joint Pre-Hab',
    body: `A proper warm-up raises core body temperature, lubricates articular cartilage with synovial fluid, and activates neuromuscular pathways. 
The RAMP protocol (Raise, Activate, Mobilize, Potentiate) is the gold standard:
1. Raise heart rate with 3-5 minutes of light cardio.
2. Activate stabilizing muscles (rotator cuff, glute medius, core).
3. Mobilize dynamic joint ranges of motion (hip openers, thoracic twists).
4. Potentiate by ramping up load on your primary movement with 3-4 warm-up sets before your working weight.`,
    category: 'Injury Prevention',
    tags: ['Safety', 'Warmup', 'Mobility'],
    readTimeMin: 3,
    sourceName: 'American Physical Therapy Association',
    sourceUrl: 'https://www.apta.org',
  },
];

export const SEEDED_CHALLENGES: ChallengeItem[] = [
  {
    id: 'ch_weekly_workouts',
    title: '4-Day Strength Mastery',
    description: 'Complete 4 workout sessions this week with full set completion.',
    type: 'weekly',
    target: 4,
    metric: 'workouts',
    points: 150,
  },
  {
    id: 'ch_daily_water',
    title: 'Hydration Precision Challenge',
    description: 'Hit 3,000 mL of water daily for 7 consecutive days.',
    type: 'weekly',
    target: 7,
    metric: 'water_ml',
    points: 100,
  },
  {
    id: 'ch_active_minutes',
    title: '150-Minute Cardio Threshold',
    description: 'Log at least 150 minutes of moderate-to-vigorous physical activity this week.',
    type: 'weekly',
    target: 150,
    metric: 'active_minutes',
    points: 200,
  },
];
