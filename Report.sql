SELECT
    CONCAT_WS(' ', mp.short_name, s.first_name, s.last_name) AS full_name,
    mg.name AS gender,
    TIMESTAMPDIFF(YEAR, s.birth_date, CURDATE()) AS age,
    c.room_name AS classroom_name,
    cs.academic_year
FROM students AS s
JOIN master_prefix AS mp
    ON mp.id = s.prefix_id
JOIN master_gender AS mg
    ON mg.id = s.gender_id
JOIN classroom_students AS cs
    ON cs.student_id = s.id
JOIN classrooms AS c
    ON c.id = cs.classroom_id
WHERE mg.code = 'M'
  AND TIMESTAMPDIFF(YEAR, s.birth_date, CURDATE()) BETWEEN 10 AND 12
  AND s.deleted_at IS NULL
  AND cs.deleted_at IS NULL
  AND c.deleted_at IS NULL
ORDER BY c.room_name, s.first_name;
