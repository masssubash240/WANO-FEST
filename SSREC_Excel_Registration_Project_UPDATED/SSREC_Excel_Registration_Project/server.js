
const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const ROOT = __dirname;
const UPLOAD_DIR = path.join(ROOT, "uploads");
const EXCEL_FILE = path.join(ROOT, "registrations.xlsx");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG/PNG payment screenshots are allowed."));
  }
});

const columns = [
  "Registration ID", "Submitted At", "Team Name", "Event Type", "Event Name",
  "College Name", "College Department",
  "Team Leader Name", "Leader Email", "Leader Mobile", "Leader Department", "Leader Year"
];

for (let i = 1; i <= 4; i++) {
  columns.push(
    `Member ${i} Name`, `Member ${i} Email`, `Member ${i} Mobile`,
    `Member ${i} Department`, `Member ${i} Year`
  );
}

columns.push(
  "Project / Idea Title", "Short Description",
  "UPI Transaction / Reference ID", "Payment Screenshot",
  "Registration Fee", "Confirmation"
);

function createWorkbookIfMissing() {
  if (!fs.existsSync(EXCEL_FILE)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([columns]);
    ws["!cols"] = columns.map(() => ({ wch: 22 }));
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, EXCEL_FILE);
  }
}

function addRegistration(row) {
  createWorkbookIfMissing();

  const wb = XLSX.readFile(EXCEL_FILE);
  const ws = wb.Sheets["Registrations"] || XLSX.utils.aoa_to_sheet([columns]);

  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  data.push(columns.map(col => row[col] ?? ""));

  const newWs = XLSX.utils.aoa_to_sheet(data);
  newWs["!cols"] = columns.map(() => ({ wch: 22 }));
  wb.Sheets["Registrations"] = newWs;
  XLSX.writeFile(wb, EXCEL_FILE);
}

app.use(express.static(ROOT));

app.post("/api/register", upload.single("paymentScreenshot"), (req, res) => {
  try {
    const b = req.body;

    const required = [
      "teamName", "eventType", "eventName", "college", "department",
      "leader", "leaderEmail", "leaderPhone", "leaderDepartment", "leaderYear",
      "projectTitle", "description", "transactionId", "agree"
    ];

    for (const key of required) {
      if (!String(b[key] || "").trim()) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: `Missing required field: ${key}` });
      }
    }

    for (let i = 1; i <= 4; i++) {
      for (const key of ["Name", "Email", "Phone", "Department", "Year"]) {
        const field = `member${i}${key}`;
        if (!String(b[field] || "").trim()) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(400).json({ message: `Missing required field: ${field}` });
        }
      }
    }

    if (!req.file) {
      return res.status(400).json({ message: "Payment screenshot is required." });
    }

    const registrationId = `SSREC-${new Date().getFullYear()}-${Date.now().toString().slice(-7)}`;

    const row = {
      "Registration ID": registrationId,
      "Submitted At": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      "Team Name": b.teamName,
      "Event Type": b.eventType === "technical" ? "Technical Event" : "Non-Technical Event",
      "Event Name": b.eventName,
      "College Name": b.college,
      "College Department": b.department,
      "Team Leader Name": b.leader,
      "Leader Email": b.leaderEmail,
      "Leader Mobile": b.leaderPhone,
      "Leader Department": b.leaderDepartment,
      "Leader Year": b.leaderYear,
      "Project / Idea Title": b.projectTitle,
      "Short Description": b.description,
      "UPI Transaction / Reference ID": b.transactionId,
      "Payment Screenshot": path.join("uploads", req.file.filename),
      "Registration Fee": "₹200",
      "Confirmation": "Submitted"
    };

    for (let i = 1; i <= 4; i++) {
      row[`Member ${i} Name`] = b[`member${i}Name`];
      row[`Member ${i} Email`] = b[`member${i}Email`];
      row[`Member ${i} Mobile`] = b[`member${i}Phone`];
      row[`Member ${i} Department`] = b[`member${i}Department`];
      row[`Member ${i} Year`] = b[`member${i}Year`];
    }

    addRegistration(row);

    res.json({ ok: true, registrationId });
  } catch (err) {
    console.error(err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err.message || "Could not save registration." });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "SSREC registration server is running." });
});

app.use((err, _req, res, _next) => {
  res.status(400).json({ message: err.message || "Upload error." });
});

createWorkbookIfMissing();

app.listen(PORT, () => {
  console.log(`SSREC Registration Server running at http://localhost:${PORT}`);
});
