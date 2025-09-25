CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO faq (id, question, answer) VALUES
(gen_random_uuid(), 'What is the eligibility for enrolling in a CA course?', 'To start with the CA Foundation course, you must have passed Class 12th. After graduation, you can directly enter into CA Intermediate under the direct entry scheme.'),
(gen_random_uuid(), 'How long does it take to complete the CA course?', 'On average, it takes 4.5 to 5 years to complete the CA course, provided you clear all levels (Foundation, Intermediate, and Final) in the first attempt along with the required articleship training.'),
(gen_random_uuid(), 'What is the exam pattern for CA Foundation?', 'The CA Foundation exam consists of 4 papers: two subjective (Accounting and Business Laws) and two objective (Mathematics, Economics, and Business & Commercial Knowledge).'),
(gen_random_uuid(), 'Is articleship compulsory for CA?', 'Yes, a 3-year articleship under a practicing Chartered Accountant is mandatory before you can attempt the CA Final exams.'),
(gen_random_uuid(), 'Can I pursue CA along with graduation?', 'Yes, many students pursue CA alongside their graduation. However, balancing both requires good time management and dedication.'),
(gen_random_uuid(), 'What career opportunities are available after completing CA?', 'As a qualified CA, you can work in auditing, taxation, financial advisory, corporate finance, investment banking, or even start your own practice.');