CREATE TABLE faculty(
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    InstituteName VARCHAR(100),
    ProfileImage VARCHAR(100)
);

CREATE TABLE productFaculty(
    productId  UUID REFERENCES products(id),
    facultyId UUID REFERENCES faculty(id),
    PRIMARY KEY (productId, facultyId)
);

CREATE TABLE variant(
    id UUID PRIMARY KEY,
    attempt VARCHAR(100),
    price INT,
    VariantImage VARCHAR(100),
    deliveryMode VARCHAR(100),
    availability Boolean default TRUE,
    validity VARCHAR(100),
    ProductId UUID References products(id)
);