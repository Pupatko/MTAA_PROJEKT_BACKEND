-- MATURITA ZO SJL TESTY 
INSERT INTO tests (id, title, subject) VALUES
('SJL2024', 'SJL 2024', 'Slovenský jazyk'),
('SJL2025', 'SJL 2025', 'Slovenský jazyk');

-- MATURITA SJL 2024 - otázky
INSERT INTO questions (id, test_id, question) VALUES
('Q1', 'SJL2024', 'Slovo všeobecnejší predstavuje druhý stupeň ...'),
('Q2', 'SJL2024', 'Ktoré tvrdenie o diele Kým kohút nezaspieva je pravdivé?'),
('Q3', 'SJL2024', 'Slovo dodávateľ ...'),
('Q4', 'SJL2024', 'V ktorej možnosti je gramaticky a pravopisne správny tvar vzťahového prídavného mena?'),
('Q5', 'SJL2024', 'Taliančina patrí do rovnakej jazykovej skupiny indoeurópskych jazykov ako ...'),
('Q6', 'SJL2024', 'V ktorej možnosti sa nachádza vokalizovaná predložka?'),
('Q7', 'SJL2024', 'Text B patrí do tej istej skupiny slohových útvarov/žánrov ako ...'),
('Q8', 'SJL2024', 'V slovnom spojení jednu z najroztomilejších stvoričiek sa nachádza ...'),
('Q9', 'SJL2024', 'Ktorý typ priraďovacieho súvetia predstavuje nasledujúca veta? Teším sa tomu a som šťastný.'),
('Q10', 'SJL2024', 'Ktoré tvrdenie o vonkajšej kompozícii divadelnej hry je pravdivé?');

-- MATURITA SJL 2025 - otázky
INSERT INTO questions (id, test_id, question) VALUES
('Q11', 'SJL2025', 'Slovo všeobecnejší predstavuje druhý stupeň ...'),
('Q12', 'SJL2025', 'Slohový útvar/žáner obsahujúci výrazové prostriedky z viacerých jazykových štýlov je ...'),
('Q13', 'SJL2025', 'Slová biotechnologický, tomografia, skener zaraďujeme ...'),
('Q14', 'SJL2025', 'Ktoré znaky jazykového štýlu nájdeme v ukážke 1?'),
('Q15', 'SJL2025', 'V ktorej možnosti je gramaticky a pravopisne správny tvar vzťahového prídavného mena?'),
('Q16', 'SJL2025', 'Ktorý typ priraďovacieho súvetia predstavuje nasledujúca veta? Teším sa tomu a som šťastný.'),
('Q17', 'SJL2025', 'Slovo dodávateľ ...');

-- MATURITA SJL 2024 - odpovede k otázkam

-- Q1: Slovo všeobecnejší predstavuje druhý stupeň ...
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q1A1', 'Q1', 'pravidelného stupňovania prísloviek.', FALSE),
('Q1A2', 'Q1', 'pravidelného stupňovania prídavných mien.', FALSE),
('Q1A3', 'Q1', 'nepravidelného stupňovania prísloviek.', FALSE),
('Q1A4', 'Q1', 'nepravidelného stupňovania prídavných mien.', TRUE);

-- Q2: Ktoré tvrdenie o diele Kým kohút nezaspieva je pravdivé?
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q2A1', 'Q2', 'Inscenáciu tejto divadelnej hry realizuje činoherný súbor.', FALSE),
('Q2A2', 'Q2', 'Dielo ako celok zaraďujeme k tragikomédiám.', FALSE),
('Q2A3', 'Q2', 'Dielo ako celok zaraďujeme do absurdnej drámy.', TRUE),
('Q2A4', 'Q2', 'Inscenáciu tejto divadelnej hry realizuje kabaretný súbor.', FALSE);

-- Q3: Slovo dodávateľ ...
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q3A1', 'Q3', 'vzniklo kombináciou skladania a odvodzovania.', FALSE),
('Q3A2', 'Q3', 'vzniklo prenesením základného významu slova.', FALSE),
('Q3A3', 'Q3', 'obsahuje tri slovotvorné základy.', FALSE),
('Q3A4', 'Q3', 'obsahuje slovotvornú predponu a príponu.', TRUE);

-- Q4: V ktorej možnosti je gramaticky a pravopisne správny tvar vzťahového prídavného mena?
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q4A1', 'Q4', 'portréty habsburských panovníkov', TRUE),
('Q4A2', 'Q4', 'portréty Habsburských panovníkov', FALSE),
('Q4A3', 'Q4', 'portréty habsburgských panovníkov', FALSE),
('Q4A4', 'Q4', 'portréty Habsburgských panovníkov', FALSE);

-- Q5: Taliančina patrí do rovnakej jazykovej skupiny indoeurópskych jazykov ako ...
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q5A1', 'Q5', 'dánčina.', FALSE),
('Q5A2', 'Q5', 'nemčina.', FALSE),
('Q5A3', 'Q5', 'rumunčina.', TRUE),
('Q5A4', 'Q5', 'bulharčina.', FALSE);

-- Q6: V ktorej možnosti sa nachádza vokalizovaná predložka?
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q6A1', 'Q6', 'za kladné vybavenie', FALSE),
('Q6A2', 'Q6', 'na osobnom pohovore', FALSE),
('Q6A3', 'Q6', 'dorozumiem sa aj po maďarsky', TRUE),
('Q6A4', 'Q6', 'skúsenosti so spoluorganizovaním', FALSE);

-- Q7: Text B patrí do tej istej skupiny slohových útvarov/žánrov ako ...
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q7A1', 'Q7', 'prívet.', FALSE),
('Q7A2', 'Q7', 'výklad.', FALSE),
('Q7A3', 'Q7', 'recenzia.', FALSE),
('Q7A4', 'Q7', 'reklamácia.', TRUE);

-- Q8: V slovnom spojení jednu z najroztomilejších stvoričiek sa nachádza ...
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q8A1', 'Q8', 'zvukomaľba.', FALSE),
('Q8A2', 'Q8', 'nonsens.', FALSE),
('Q8A3', 'Q8', 'symbol.', FALSE),
('Q8A4', 'Q8', 'zdrobnenina.', TRUE);

-- Q9: Ktorý typ priraďovacieho súvetia predstavuje nasledujúca veta? Teším sa tomu a som šťastný.
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q9A1', 'Q9', 'odporovacie', FALSE),
('Q9A2', 'Q9', 'vylučovacie', FALSE),
('Q9A3', 'Q9', 'zlučovacie', TRUE),
('Q9A4', 'Q9', 'stupňovacie', FALSE);

-- Q10: Ktoré tvrdenie o vonkajšej kompozícii divadelnej hry je pravdivé?
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q10A1', 'Q10', 'Dejstvo sa člení na výstupy.', TRUE),
('Q10A2', 'Q10', 'Výstup sa člení na dejstvá.', FALSE),
('Q10A3', 'Q10', 'Replika sa skladá z dialógu.', FALSE),
('Q10A4', 'Q10', 'Monológ sa skladá z replík.', FALSE);

-- MATURITA SJL 2025 - odpovede k otázkam

-- Q11: Slovo všeobecnejší predstavuje druhý stupeň ...
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q11A1', 'Q11', 'pravidelného stupňovania prísloviek.', FALSE),
('Q11A2', 'Q11', 'pravidelného stupňovania prídavných mien.', TRUE),
('Q11A3', 'Q11', 'nepravidelného stupňovania prísloviek.', FALSE),
('Q11A4', 'Q11', 'nepravidelného stupňovania prídavných mien.', FALSE);

-- Q12: Slohový útvar/žáner obsahujúci výrazové prostriedky z viacerých jazykových štýlov je ...
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q12A1', 'Q12', 'polysémický.', FALSE),
('Q12A2', 'Q12', 'subjektívny.', FALSE),
('Q12A3', 'Q12', 'objektívny.', FALSE),
('Q12A4', 'Q12', 'hybridný.', TRUE);

-- Q13: Slová biotechnologický, tomografia, skener zaraďujeme ...
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q13A1', 'Q13', 'k odborným výrazom.', TRUE),
('Q13A2', 'Q13', 'k slangovým slovám.', FALSE),
('Q13A3', 'Q13', 'k eufemizmom.', FALSE),
('Q13A4', 'Q13', 'k archaizmom.', FALSE);

-- Q14: Ktoré znaky jazykového štýlu nájdeme v ukážke 1?
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q14A1', 'Q14', 'objektívnosť, presnosť, odborné termíny', TRUE),
('Q14A2', 'Q14', 'expresívnosť, hovorovosť, nespisovné výrazy', FALSE),
('Q14A3', 'Q14', 'subjektívnosť, obraznosť, umelecké prostriedky', FALSE),
('Q14A4', 'Q14', 'stručnosť, informačnosť, publicizmy', FALSE);

-- Q15: V ktorej možnosti je gramaticky a pravopisne správny tvar vzťahového prídavného mena?
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q15A1', 'Q15', 'portréty habsburských panovníkov', TRUE),
('Q15A2', 'Q15', 'portréty Habsburských panovníkov', FALSE),
('Q15A3', 'Q15', 'portréty habsburgských panovníkov', FALSE),
('Q15A4', 'Q15', 'portréty Habsburgských panovníkov', FALSE);

-- Q16: Ktorý typ priraďovacieho súvetia predstavuje nasledujúca veta? Teším sa tomu a som šťastný.
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q16A1', 'Q16', 'odporovacie', FALSE),
('Q16A2', 'Q16', 'vylučovacie', FALSE),
('Q16A3', 'Q16', 'zlučovacie', TRUE),
('Q16A4', 'Q16', 'stupňovacie', FALSE);

-- Q17: Slovo dodávateľ ...
INSERT INTO answers (id, question_id, answer_text, is_correct) VALUES
('Q17A1', 'Q17', 'vzniklo kombináciou skladania a odvodzovania.', FALSE),
('Q17A2', 'Q17', 'vzniklo prenesením základného významu slova.', FALSE),
('Q17A3', 'Q17', 'obsahuje tri slovotvorné základy.', FALSE),
('Q17A4', 'Q17', 'obsahuje slovotvornú predponu a príponu.', TRUE);
