CREATE TABLE courses(
    id UUID PRIMARY KEY,
    courseName VARCHAR(100) NOT NULL,
    courseDescription VARCHAR(100)
);

CREATE TABLE subjects(
    id UUID PRIMARY KEY,
    subjectName VARCHAR(100) NOT NULL,
    subjectDescription VARCHAR(100)
);

CREATE TABLE products(
    id UUID PRIMARY KEY,
    productTitle VARCHAR(100) NOT NULL,
    productDescription VARCHAR(100),
    courseId UUID REFERENCES courses(id),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    productType VARCHAR(100) DEFAULT 'Regular',
    isCombo BOOLEAN
);

CREATE TABLE productSubjects(
    product_id UUID REFERENCES products(id),
    subject_id UUID REFERENCES subjects(id),
    PRIMARY KEY (product_id,subject_id)
);