const express = require("express");
const app = express();
app.use(express.json());

const envelopes = [
  {
    id: 1,
    budget: 1000,
    title: "Budget 1",
  },
];

app.post("/envelopes", (req, res) => {
  const lastId = envelopes[envelopes.length - 1].id;
  const body = { id: lastId + 1, ...req.body };
  envelopes.push(body);
  res.status(201).json({ envelope: body });
});

app.get("/envelopes", (_, res) => {
  res.json({ envelopes });
});

app.get("/envelopes/:id", (req, res) => {
  const envelope = envelopes.find((e) => e.id == req.params.id);
  if (!envelope) return res.status(404).json({ msg: "Not found" });
  res.json({ envelope });
});

app.put("/envelopes/:id", (req, res) => {
  const body = req.body;
  const envelopeId = envelopes.findIndex((e) => e.id == req.params.id);
  if (envelopeId < 0) return res.status(404).json({ msg: "Not found" });
  envelopes[envelopeId] = { id: parseInt(req.params.id), ...body };
  res.json({ envelope: envelopes[envelopeId] });
});

app.delete("/envelopes/:id", (req, res) => {
  const envelopeId = envelopes.findIndex((e) => e.id == req.params.id);
  if (envelopeId < 0) return res.status(404).json({ msg: "Not found" });
  const envelope = envelopes[envelopeId];
  envelopes.splice(envelopeId, 1);
  res.json({ envelope });
});

app.post("/envelopes/transfer/:from/:to", (req, res) => {
  const { value } = req.body;
  const { from, to } = req.params;
  const fromIdx = envelopes.findIndex((e) => e.id == from);
  const toIdx = envelopes.findIndex((e) => e.id == to);
  if (fromIdx < 0 || toIdx < 0)
    return res.status(404).json({ msg: "Not found" });
  envelopes[fromIdx].budget -= value;
  envelopes[toIdx].budget += value;
  res.json({ msg: "Budget successfully transferred" });
});

app.get("/", (_, res) => {
  res.json("Hello World");
});

app.listen(3000, () => {
  console.log(`Listening on port ${3000}`);
});
