CREATE TABLE courses (
    id UUID PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_description VARCHAR(100)
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_description VARCHAR(100)
);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    product_title VARCHAR(100) NOT NULL,
    product_description VARCHAR(100),
    course_id UUID REFERENCES courses(id),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_type VARCHAR(100) DEFAULT 'Regular',
    is_combo BOOLEAN
);

CREATE TABLE product_subjects (
    product_id UUID REFERENCES products(id),
    subject_id UUID REFERENCES subjects(id),
    PRIMARY KEY (product_id, subject_id)
);