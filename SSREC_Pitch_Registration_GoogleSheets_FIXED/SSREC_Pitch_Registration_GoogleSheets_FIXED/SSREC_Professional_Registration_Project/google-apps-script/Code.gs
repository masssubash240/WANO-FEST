// ==============================================================================
// SSREC PITCH PERFECT '26 — COMPLETE GOOGLE APPS SCRIPT WEB APP
// Brand New Sheet Edition (Plug & Play - Auto Setup)
// ==============================================================================

const FOLDER_NAME     = "SSREC Pitch Perfect Payment Screenshots";
const DEFAULT_FEE    = "₹200/member";

/**
 * GET request — Health check & Setup verification
 */
function doGet() {
  try {
    const sheet = getSheet_();
    const headers = getHeadersFromSheet_(sheet);
    const hasCollege = headers.some(function(h) {
      return /college|institution|university|campus/i.test(h);
    });

    return json_({
      ok: true,
      message: "SSREC Pitch Perfect '26 New API is running successfully!",
      sheetName: sheet.getName(),
      totalRegistrations: Math.max(0, sheet.getLastRow() - 1),
      hasCollegeColumn: hasCollege,
      columnsCount: headers.length,
      columns: headers
    });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

/**
 * POST request — Handles incoming registration submissions
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No registration data received in request.");
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    const folder = getFolder_();

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const registrationId = data.registrationId || ("SSREC-PITCH-2026-" + String(Date.now()).slice(-7));

    // ── Upload Screenshot to Google Drive ──────────────────────
    let paymentUrl = "No screenshot provided";
    if (data.paymentScreenshot && data.paymentScreenshot.base64) {
      try {
        const shot     = data.paymentScreenshot;
        const bytes    = Utilities.base64Decode(shot.base64);
        const mimeType = shot.mimeType || "image/jpeg";
        const fileName = `${registrationId}_${shot.name || "pitch_payment.jpg"}`;
        const blob     = Utilities.newBlob(bytes, mimeType, fileName);

        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        paymentUrl = file.getUrl();
      } catch (uploadErr) {
        paymentUrl = "Upload error: " + String(uploadErr.message || uploadErr);
      }
    }

    // ── Prepare Clean Data Dictionary ───────────────────────────
    const leaderName = trim_(data.leaderName || data.leader || data.fullName);
    const leaderEmail = trim_(data.leaderEmail || data.email);
    const leaderPhone = trim_(data.leaderPhone || data.leaderMobile || data.phone);
    const leaderDept = trim_(data.leaderDepartment || data.leaderDept || data.department);
    const leaderYear = trim_(data.leaderYear || data.year || "3rd Year");

    // Capture College with all possible aliases
    const college = trim_(data.college || data.collegeName || data.college_name || data.institution || "SSREC");
    const collegeDept = trim_(data.department || data.collegeDepartment || data.college_department || leaderDept || "Not Specified");

    const dict = {
      registrationId: registrationId,
      timestamp: timestamp,
      eventName: trim_(data.eventName) || "Pitch Perfect '26",
      category: trim_(data.participationCategory || data.category || "IDEA PITCH"),
      projectTitle: trim_(data.projectTitle || data.ideaTitle || "Pitch Entry"),
      domain: trim_(data.domain || "Technology & Innovation"),
      description: trim_(data.description || data.projectDescription || ""),
      teamName: trim_(data.teamName) || `${leaderName}'s Team`,
      college: college,
      collegeDepartment: collegeDept,

      // Leader
      leaderName: leaderName,
      leaderEmail: leaderEmail,
      leaderPhone: leaderPhone,
      leaderDept: leaderDept,
      leaderYear: leaderYear,

      // Member 1
      m1Name: trim_(data.member1Name || data.m1Name),
      m1Email: trim_(data.member1Email || data.m1Email),
      m1Phone: trim_(data.member1Phone || data.member1Mobile || data.m1Phone),
      m1Dept: trim_(data.member1Department || data.m1Dept),
      m1Year: trim_(data.member1Year || data.m1Year),

      // Member 2
      m2Name: trim_(data.member2Name || data.m2Name),
      m2Email: trim_(data.member2Email || data.m2Email),
      m2Phone: trim_(data.member2Phone || data.member2Mobile || data.m2Phone),
      m2Dept: trim_(data.member2Department || data.m2Dept),
      m2Year: trim_(data.member2Year || data.m2Year),

      // Member 3
      m3Name: trim_(data.member3Name || data.m3Name),
      m3Email: trim_(data.member3Email || data.m3Email),
      m3Phone: trim_(data.member3Phone || data.member3Mobile || data.m3Phone),
      m3Dept: trim_(data.member3Department || data.m3Dept),
      m3Year: trim_(data.member3Year || data.m3Year),

      // Member 4
      m4Name: trim_(data.member4Name || data.m4Name),
      m4Email: trim_(data.member4Email || data.m4Email),
      m4Phone: trim_(data.member4Phone || data.member4Mobile || data.m4Phone),
      m4Dept: trim_(data.member4Department || data.m4Dept),
      m4Year: trim_(data.member4Year || data.m4Year),

      // Payment & Status
      transactionId: trim_(data.transactionId) || "PAY-AT-VENUE",
      paymentUrl: paymentUrl,
      regFee: trim_(data.registrationFee || DEFAULT_FEE),
      status: "Submitted"
    };

    // ── Auto-ensure Sheet has Headers and College Column ────────
    ensureHeadersAndCollegeColumn_(sheet);

    // ── Read Row 1 Headers from Sheet ──────────────────────────
    const lastCol = Math.max(sheet.getLastColumn(), 1);
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // Build the row array dynamically based on existing headers
    const newRow = new Array(headers.length).fill("");

    for (let colIdx = 0; colIdx < headers.length; colIdx++) {
      const h = String(headers[colIdx] || "").trim().toLowerCase();

      if (/registration\s*id/i.test(h)) {
        newRow[colIdx] = dict.registrationId;
      } else if (/submitted|timestamp|date/i.test(h)) {
        newRow[colIdx] = dict.timestamp;
      } else if (/college\s*(dept|department)/i.test(h)) {
        newRow[colIdx] = dict.collegeDepartment;
      } else if (/college|institution|university|campus/i.test(h)) {
        newRow[colIdx] = dict.college;
      } else if (/team\s*name|^team$/i.test(h) && !/leader|member/i.test(h)) {
        newRow[colIdx] = dict.teamName;
      } else if (/category|participation/i.test(h)) {
        newRow[colIdx] = dict.category;
      } else if (/title|idea|project/i.test(h) && !/domain|category/i.test(h)) {
        newRow[colIdx] = dict.projectTitle;
      } else if (/domain/i.test(h)) {
        newRow[colIdx] = dict.domain;
      } else if (/description/i.test(h)) {
        newRow[colIdx] = dict.description;
      }
      // Leader fields
      else if (/leader.*(name|full)/i.test(h) || (/leader/i.test(h) && !/email|phone|mob|dept|year/i.test(h))) {
        newRow[colIdx] = dict.leaderName;
      } else if (/leader.*email/i.test(h)) {
        newRow[colIdx] = dict.leaderEmail;
      } else if (/leader.*(phone|mob)/i.test(h)) {
        newRow[colIdx] = dict.leaderPhone;
      } else if (/leader.*dept/i.test(h)) {
        newRow[colIdx] = dict.leaderDept;
      } else if (/leader.*year/i.test(h)) {
        newRow[colIdx] = dict.leaderYear;
      }
      // Member 01
      else if (/member\s*0?1.*(name|full)/i.test(h) || (/member\s*0?1$/i.test(h))) {
        newRow[colIdx] = dict.m1Name;
      } else if (/member\s*0?1.*email/i.test(h)) {
        newRow[colIdx] = dict.m1Email;
      } else if (/member\s*0?1.*(phone|mob)/i.test(h)) {
        newRow[colIdx] = dict.m1Phone;
      } else if (/member\s*0?1.*dept/i.test(h)) {
        newRow[colIdx] = dict.m1Dept;
      } else if (/member\s*0?1.*year/i.test(h)) {
        newRow[colIdx] = dict.m1Year;
      }
      // Member 02
      else if (/member\s*0?2.*(name|full)/i.test(h) || (/member\s*0?2$/i.test(h))) {
        newRow[colIdx] = dict.m2Name;
      } else if (/member\s*0?2.*email/i.test(h)) {
        newRow[colIdx] = dict.m2Email;
      } else if (/member\s*0?2.*(phone|mob)/i.test(h)) {
        newRow[colIdx] = dict.m2Phone;
      } else if (/member\s*0?2.*dept/i.test(h)) {
        newRow[colIdx] = dict.m2Dept;
      } else if (/member\s*0?2.*year/i.test(h)) {
        newRow[colIdx] = dict.m2Year;
      }
      // Member 03
      else if (/member\s*0?3.*(name|full)/i.test(h) || (/member\s*0?3$/i.test(h))) {
        newRow[colIdx] = dict.m3Name;
      } else if (/member\s*0?3.*email/i.test(h)) {
        newRow[colIdx] = dict.m3Email;
      } else if (/member\s*0?3.*(phone|mob)/i.test(h)) {
        newRow[colIdx] = dict.m3Phone;
      } else if (/member\s*0?3.*dept/i.test(h)) {
        newRow[colIdx] = dict.m3Dept;
      } else if (/member\s*0?3.*year/i.test(h)) {
        newRow[colIdx] = dict.m3Year;
      }
      // Member 04
      else if (/member\s*0?4.*(name|full)/i.test(h) || (/member\s*0?4$/i.test(h))) {
        newRow[colIdx] = dict.m4Name;
      } else if (/member\s*0?4.*email/i.test(h)) {
        newRow[colIdx] = dict.m4Email;
      } else if (/member\s*0?4.*(phone|mob)/i.test(h)) {
        newRow[colIdx] = dict.m4Phone;
      } else if (/member\s*0?4.*dept/i.test(h)) {
        newRow[colIdx] = dict.m4Dept;
      } else if (/member\s*0?4.*year/i.test(h)) {
        newRow[colIdx] = dict.m4Year;
      }
      // Payment & Transaction
      else if (/transaction|upi|ref/i.test(h)) {
        newRow[colIdx] = dict.transactionId;
      } else if (/screenshot|payment.*(proof|link|url)/i.test(h)) {
        newRow[colIdx] = dict.paymentUrl;
      } else if (/fee|amount/i.test(h)) {
        newRow[colIdx] = dict.regFee;
      } else if (/status|confirm/i.test(h)) {
        newRow[colIdx] = dict.status;
      }
    }

    // Append the row cleanly to sheet
    sheet.appendRow(newRow);

    return json_({
      ok: true,
      registrationId: registrationId,
      college: dict.college,
      paymentScreenshot: paymentUrl,
      message: "Pitch Perfect registration successfully recorded in Google Sheets!",
      timestamp: timestamp
    });

  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

/**
 * Standard 39 Headers definition
 */
function getStandardHeaders_() {
  return [
    "Registration ID",
    "Submitted At (IST)",
    "Event Name",
    "Pitch Category",
    "Project / Idea Title",
    "Technology Domain",
    "Pitch Description",
    "Team Name",
    "College Name",
    "College Department",

    // Team Leader
    "Leader Name",
    "Leader Email",
    "Leader Mobile",
    "Leader Department",
    "Leader Year",

    // Member 1
    "Member 1 Name",
    "Member 1 Email",
    "Member 1 Mobile",
    "Member 1 Department",
    "Member 1 Year",

    // Member 2
    "Member 2 Name",
    "Member 2 Email",
    "Member 2 Mobile",
    "Member 2 Department",
    "Member 2 Year",

    // Member 3
    "Member 3 Name",
    "Member 3 Email",
    "Member 3 Mobile",
    "Member 3 Department",
    "Member 3 Year",

    // Member 4
    "Member 4 Name",
    "Member 4 Email",
    "Member 4 Mobile",
    "Member 4 Department",
    "Member 4 Year",

    // Payment & Status
    "UPI Transaction ID",
    "Payment Screenshot Link",
    "Registration Fee",
    "Status"
  ];
}

/**
 * Ensures Row 1 headers exist and "College Name" column is present
 */
function ensureHeadersAndCollegeColumn_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  // If sheet is completely empty, initialize all standard headers
  if (lastRow === 0 || lastCol === 0) {
    setupNewSheet();
    return;
  }

  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  // Check if College Name column exists
  let hasCollege = false;
  for (let i = 0; i < headers.length; i++) {
    if (/college|institution|university|campus/i.test(String(headers[i] || ""))) {
      hasCollege = true;
      break;
    }
  }

  // If missing, insert College Name column right after Team Name or Category
  if (!hasCollege) {
    let insertAfterCol = 3;
    for (let i = 0; i < headers.length; i++) {
      const h = String(headers[i] || "").toLowerCase();
      if (/team\s*name/i.test(h) || /category|participation/i.test(h)) {
        insertAfterCol = i + 1;
        break;
      }
    }
    sheet.insertColumnAfter(insertAfterCol);
    const colIdx = insertAfterCol + 1;
    const cell = sheet.getRange(1, colIdx);
    cell.setValue("College Name");
    cell.setFontWeight("bold");
    cell.setBackground("#0b1329");
    cell.setFontColor("#00e5ff");
    try {
      sheet.autoResizeColumns(colIdx, 1);
    } catch (e) {}
  }
}

/**
 * Run this function once in Apps Script to instantly set up Row 1 headers with styling!
 */
function setupNewSheet() {
  const sheet = getSheet_();
  const headers = getStandardHeaders_();

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);

  // Premium Header Styling
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#0b1329");
  headerRange.setFontColor("#00e5ff");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");

  try {
    sheet.autoResizeColumns(1, headers.length);
  } catch (e) {}

  Logger.log("✅ Successfully formatted new sheet with " + headers.length + " headers!");
}

/**
 * Get active sheet tab automatically
 */
function getSheet_() {
  let ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}

  if (!ss) {
    throw new Error("Please open this script via Extensions > Apps Script from inside your new Google Sheet.");
  }

  let sheet = ss.getSheetByName("Registrations");
  if (!sheet) {
    sheet = ss.getActiveSheet() || ss.getSheets()[0];
  }
  return sheet;
}

/**
 * Locate or create payment screenshots folder in Google Drive
 */
function getFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  const folder = DriveApp.createFolder(FOLDER_NAME);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return folder;
}

function getHeadersFromSheet_(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(c) {
    return String(c || "").trim();
  });
}

function trim_(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
