const express = require("express");
const pool = require("./db");
const app = express();
app.use(express.json());

app.post("/envelopes", async (req, res) => {
  try {
    const { budget, title } = req.body;
    const envelope = await pool.query(
      "INSERT INTO envelopes (budget, title) VALUES ($1, $2) RETURNING *",
      [budget, title]
    );
    res.status(201).json({ msg: "Envelope added", envelope: envelope.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app.get("/envelopes", async (_, res) => {
  try {
    const envelopes = await pool.query(
      "SELECT * FROM envelopes ORDER BY id ASC"
    );
    res.json({ envelopes: envelopes.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app.get("/envelopes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const envelopes = await pool.query(
      "SELECT * FROM envelopes WHERE id = $1",
      [id]
    );
    res.json({ envelope: envelopes.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app.put("/envelopes/:id", async (req, res) => {
  try {
    const { budget, title } = req.body;
    const id = parseInt(req.params.id);
    const envelope = await pool.query(
      "UPDATE envelopes SET budget = $1, title = $2 WHERE id = $3 RETURNING *",
      [budget, title, id]
    );
    res.json({ msg: `Envelope updated`, envelope: envelope.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app.delete("/envelopes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await pool.query("DELETE FROM envelopes WHERE id = $1", [id]);
    res.json({ msg: `Envelope deleted` });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app.post("/envelopes/transfer/:from/:to", async (req, res) => {
  try {
    const value = parseInt(req.body.value);
    const { from, to } = req.params;
    await pool.query(
      "UPDATE envelopes SET budget = budget - $1 WHERE id = $2",
      [value, from]
    );
    await pool.query(
      "UPDATE envelopes SET budget = budget + $1 WHERE id = $2",
      [value, to]
    );
    res.json({ msg: "Budget successfully transferred" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app
  .route("/transactions")
  .post(async (req, res) => {
    try {
      const { date, amount, recipient, envelopeId } = req.body;
      const transaction = await pool.query(
        "INSERT INTO transactions (date, amount, recipient, envelopeId) VALUES ($1, $2, $3, $4) RETURNING *",
        [date, amount, recipient, envelopeId]
      );
      res
        .status(201)
        .json({ msg: "Transaction added", transaction: transaction.rows[0] });
    } catch (err) {
      console.log(err);
      res.status(500).json("Error");
    }
  })
  .get(async (_, res) => {
    try {
      const transactions = await pool.query(
        "SELECT * FROM transactions ORDER BY id ASC"
      );
      res.json({ transactions: transactions.rows });
    } catch (err) {
      console.log(err);
      res.status(500).json("Error");
    }
  });

app
  .route("/transactions/:id")
  .put(async (req, res) => {
    try {
      const { date, amount, recipient, envelopeId } = req.body;
      const id = parseInt(req.params.id);
      const transaction = await pool.query(
        "UPDATE transactions SET date = $1, amount = $2, recipient = $3, envelopeId = $4 WHERE id = $5 RETURNING *",
        [date, amount, recipient, envelopeId, id]
      );
      res.json({
        msg: `Transaction updated`,
        transaction: transaction.rows[0],
      });
    } catch (err) {
      console.log(err);
      res.status(500).json("Error");
    }
  })
  .delete(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
      res.json({ msg: `Transaction deleted` });
    } catch (err) {
      console.log(err);
      res.status(500).json("Error");
    }
  });

app.get("/", (_, res) => {
  res.json("Hello World");
});

app.listen(3000, () => {
  console.log(`Listening on port ${3000}`);
});
