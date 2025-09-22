CREATE TABLE faculty (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    institute_name VARCHAR(100),
    profile_image VARCHAR(100)
);

CREATE TABLE product_faculty (
    product_id UUID REFERENCES products(id),
    faculty_id UUID REFERENCES faculty(id),
    PRIMARY KEY (product_id, faculty_id)
);

CREATE TABLE variant (
    id UUID PRIMARY KEY,
    attempt VARCHAR(100),
    price INT,
    variant_image VARCHAR(100),
    delivery_mode VARCHAR(100),
    availability BOOLEAN DEFAULT TRUE,
    validity VARCHAR(100),
    product_id UUID REFERENCES products(id)
);