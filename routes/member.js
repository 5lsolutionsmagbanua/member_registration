var express = require("express");
var router = express.Router();
const { Select, Update, Insert, Delete } = require("../repository/dbcontext");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("member", { title: "Express" });
});

module.exports = router;

router.get("/get-members", async (req, res) => {
  try {
    let query = "SELECT * FROM member";

    let result = await Select(query);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching members." });
  }
});

router.post("/add-member", async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      age,
      dateOfBirth,
      address,
      emailAddress,
      password,
    } = req.body;

    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !gender ||
      !age ||
      !dateOfBirth ||
      !address ||
      !emailAddress ||
      !password
    ) {
      return res.status(400).json({ message: "Missing Required Fields" });
    }

    console.log(req.body);
    const check =
      "SELECT first_name AS firstName FROM member WHERE first_name = ? LIMIT 1";
    const checkResult = await Select(check, [firstName]);
    if (checkResult.length !== 0) {
      res.status(400).json({ message: `${firstName} already exist` });
      return;
    }

    const checkEmail =
      "SELECT email_address AS emailAddress FROM member WHERE email_address = ? LIMIT 1";
    const checkEmailResult = await Select(checkEmail, [emailAddress]);
    if (checkEmailResult.length !== 0) {
      res.status(400).json({ message: `${emailAddress} already exist` });
      return;
    }

    let isActive = 1;
    let createdAt = new Date();
    let query =
      "INSERT INTO member (first_name, middle_name, last_name, gender, age, date_of_birth, address, email_address, password, is_active, create_at) VALUES ?";
    let result = await Insert(query, [
      [
        firstName,
        middleName,
        lastName,
        gender,
        age,
        dateOfBirth,
        address,
        emailAddress,
        password,
        isActive,
        createdAt,
      ],
    ]);
    console.log(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while adding member." });
  }
});

router.put("/update-member", async (req, res) => {
  try {
    const {
      memberId,
      firstName,
      middleName,
      lastName,
      gender,
      age,
      dateOfBirth,
      address,
      emailAddress,
      password,
    } = req.body;

    if (
      !memberId ||
      !firstName ||
      !middleName ||
      !lastName ||
      !gender ||
      !age ||
      !dateOfBirth ||
      !address ||
      !emailAddress ||
      !password
    ) {
      return res.status(400).json({
        message: "Missing Required Fields",
      });
    }

    let updatedAt = new Date();

    const query = `
      UPDATE member 
      SET 
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        gender = ?,
        age = ?,
        date_of_birth = ?,
        address = ?,
        email_address = ?,
        password = ?,
        updated_at = ?
      WHERE id = ?
    `;

    const result = await Update(query, [
      firstName,
      middleName,
      lastName,
      gender,
      age,
      dateOfBirth,
      address,
      emailAddress,
      password,
      updatedAt,
      memberId,
    ]);

    console.log(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while updating member." });
  }
});

router.delete("/delete-member", async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        message: "Member ID is required",
      });
    }

    const deletedAt = new Date();

    const query = `
      DELETE FROM member
      WHERE id = ?
    `;

    const result = await Delete(query, [memberId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    console.log(req.body);

    res.status(200).json({
      message: "Member deleted successfully",
      result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while deleting data.",
    });
  }
});
