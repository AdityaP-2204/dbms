package com.example.backend.dao;

import com.example.backend.model.Faculty;
import com.example.backend.model.JoinedProduct;
import com.example.backend.model.Variant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@Repository("postgresJoinedProduct")
public class JoinedProductDataAccessService implements JoinedProductDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JoinedProductDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<JoinedProduct> getJoinedProducts() {
        // Step 1: Fetch base product info (with subjects + course)
        String productSql = """
            SELECT
                p.id AS product_id,
                p.product_title,
                p.product_description,
                p.product_type,
                p.is_combo,
                c.course_name,
                c.course_description,
                MIN(v.variant_image) AS product_image,
                COALESCE(
                    ARRAY_AGG(DISTINCT s.subject_name) FILTER (WHERE s.subject_name IS NOT NULL),
                    '{}'
                ) AS subjects
            FROM products p
            JOIN courses c ON p.course_id = c.id
            LEFT JOIN variant v ON p.id = v.product_id
            LEFT JOIN product_subjects ps ON p.id = ps.product_id
            LEFT JOIN subjects s ON ps.subject_id = s.id
            GROUP BY
                p.id,
                p.product_title,
                p.product_description,
                p.product_type,
                p.is_combo,
                c.course_name,
                c.course_description
            ORDER BY p.id;
        """;

        List<JoinedProduct> products = jdbcTemplate.query(productSql, this::mapRowToProduct);

        // Step 2: Fetch all variants
        String variantSql = """
            SELECT
                v.id,
                v.attempt,
                v.price,
                v.variant_image,
                v.delivery_mode,
                v.availability,
                v.validity,
                v.product_id
            FROM variant v
            ORDER BY v.product_id, v.id;
        """;

        List<Variant> variants = jdbcTemplate.query(variantSql, this::mapRowToVariant);

        Map<UUID, List<Variant>> variantsByProduct = variants.stream()
                .collect(Collectors.groupingBy(Variant::getProduct_id));

        // Step 3: Fetch all faculties
        String facultySql = """
            SELECT
                f.id,
                f.name,
                f.description,
                f.email,
                f.profile_image,
                f.institute_name,
                pf.product_id
            FROM faculty f
            JOIN product_faculty pf ON f.id = pf.faculty_id
            ORDER BY pf.product_id, f.id;
        """;

        List<FacultyWithProduct> faculties = jdbcTemplate.query(facultySql, this::mapRowToFaculty);

        Map<UUID, List<Faculty>> facultiesByProduct = faculties.stream()
                .collect(Collectors.groupingBy(
                        FacultyWithProduct::productId,
                        Collectors.mapping(FacultyWithProduct::faculty, Collectors.toList())
                ));

        // Step 4: Rebuild JoinedProduct with variants + faculties
        List<JoinedProduct> finalProducts = new ArrayList<>();
        for (JoinedProduct base : products) {
            List<Variant> vList = variantsByProduct.getOrDefault(base.getId(), new ArrayList<>());
            List<Faculty> fList = facultiesByProduct.getOrDefault(base.getId(), new ArrayList<>());

            finalProducts.add(new JoinedProduct(
                    base.getId(),
                    base.getTitle(),
                    base.getDescription(),
                    base.getCourse_name(),
                    base.getCourse_description(),
                    base.getProduct_type(),
                    base.getProduct_image(),
                    base.isIs_combo(),   // matches your getter
                    vList,
                    base.getSubjects(),
                    fList
            ));
        }

        return finalProducts;
    }

    @Override
    public JoinedProduct getJoinedProduct(UUID id) {
        // Step 1: fetch base product
        String productSql = """
        SELECT
            p.id AS product_id,
            p.product_title,
            p.product_description,
            p.product_type,
            p.is_combo,
            c.course_name,
            c.course_description,
            MIN(v.variant_image) AS product_image,
            COALESCE(
                ARRAY_AGG(DISTINCT s.subject_name) FILTER (WHERE s.subject_name IS NOT NULL),
                '{}'
            ) AS subjects
        FROM products p
        JOIN courses c ON p.course_id = c.id
        LEFT JOIN variant v ON p.id = v.product_id
        LEFT JOIN product_subjects ps ON p.id = ps.product_id
        LEFT JOIN subjects s ON ps.subject_id = s.id
        WHERE p.id = ?
        GROUP BY
            p.id,
            p.product_title,
            p.product_description,
            p.product_type,
            p.is_combo,
            c.course_name,
            c.course_description
        LIMIT 1;
    """;

        List<JoinedProduct> products = jdbcTemplate.query(productSql, this::mapRowToProduct, id);
        if (products.isEmpty()) {
            return null; // not found
        }
        JoinedProduct base = products.get(0);

        // Step 2: fetch variants
        String variantSql = """
        SELECT
            v.id,
            v.attempt,
            v.price,
            v.variant_image,
            v.delivery_mode,
            v.availability,
            v.validity,
            v.product_id
        FROM variant v
        WHERE v.product_id = ?
        ORDER BY v.id;
    """;
        List<Variant> variants = jdbcTemplate.query(variantSql, this::mapRowToVariant, id);

        // Step 3: fetch faculties
        String facultySql = """
        SELECT
            f.id,
            f.name,
            f.description,
            f.email,
            f.profile_image,
            f.institute_name,
            pf.product_id
        FROM faculty f
        JOIN product_faculty pf ON f.id = pf.faculty_id
        WHERE pf.product_id = ?
        ORDER BY f.id;
    """;
        List<FacultyWithProduct> faculties = jdbcTemplate.query(facultySql, this::mapRowToFaculty, id);
        List<Faculty> facultyList = faculties.stream()
                .map(FacultyWithProduct::faculty)
                .collect(Collectors.toList());

        // Step 4: return assembled object
        return new JoinedProduct(
                base.getId(),
                base.getTitle(),
                base.getDescription(),
                base.getCourse_name(),
                base.getCourse_description(),
                base.getProduct_type(),
                base.getProduct_image(),
                base.isIs_combo(),
                variants,
                base.getSubjects(),
                facultyList
        );
    }


    // --- Mappers ---

    private JoinedProduct mapRowToProduct(ResultSet rs, int rowNum) throws SQLException {
        List<String> subjects = new ArrayList<>();
        if (rs.getArray("subjects") != null) {
            String[] arr = (String[]) rs.getArray("subjects").getArray();
            subjects = Arrays.asList(arr);
        }

        return new JoinedProduct(
                (UUID) rs.getObject("product_id"),
                rs.getString("product_title"),
                rs.getString("product_description"),
                rs.getString("course_name"),
                rs.getString("course_description"),
                rs.getString("product_type"),
                rs.getString("product_image"),
                rs.getBoolean("is_combo"),
                new ArrayList<>(), // variants will be injected later
                subjects,
                new ArrayList<>()  // faculties will be injected later
        );
    }

    private Variant mapRowToVariant(ResultSet rs, int rowNum) throws SQLException {
        return new Variant(
                (UUID) rs.getObject("id"),
                rs.getString("attempt"),
                rs.getBigDecimal("price"),
                rs.getString("variant_image"),
                rs.getString("delivery_mode"),
                rs.getBoolean("availability"),
                rs.getString("validity"),
                (UUID) rs.getObject("product_id")
        );
    }

    private FacultyWithProduct mapRowToFaculty(ResultSet rs, int rowNum) throws SQLException {
        Faculty faculty = new Faculty(
                (UUID) rs.getObject("id"),
                rs.getString("name"),
                rs.getString("description"),
                rs.getString("email"),
                rs.getString("profile_image"),
                rs.getString("institute_name")
        );
        return new FacultyWithProduct(faculty, (UUID) rs.getObject("product_id"));
    }

    // --- Helper record to keep faculty + product_id together ---
    private record FacultyWithProduct(Faculty faculty, UUID productId) {}
}
