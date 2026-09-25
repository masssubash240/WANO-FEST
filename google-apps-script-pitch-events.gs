// ==============================================================================
// SSREC PITCH PERFECT '26 — Smart Dynamic Google Apps Script Web App
// Target Sheet : https://docs.google.com/spreadsheets/d/1WgYRWudN8zeOnf1JW0yWRssfGbexGwn3JwCEny7sNf0/edit?gid=1604668848
// Spreadsheet ID : 1WgYRWudN8zeOnf1JW0yWRssfGbexGwn3JwCEny7sNf0
// Target GID     : 1604668848 (Registrations tab)
//
// 🎯 SMART FEATURE: Dynamic Header Mapping
// This script automatically matches columns BY THEIR HEADER TEXT in Row 1.
// It will NEVER mess up your existing data (Rows 2, 3, etc.)!
// Wherever "College Name" is placed, it will automatically find and fill it!
// ==============================================================================

const SPREADSHEET_ID  = "1WgYRWudN8zeOnf1JW0yWRssfGbexGwn3JwCEny7sNf0";
const TARGET_GID      = 1604668848;
const SHEET_NAME      = "Registrations";
const FOLDER_NAME     = "SSREC Pitch Perfect Payment Screenshots";
const REGISTRATION_FEE = "₹200/member";

/**
 * GET request — Health check
 */
function doGet() {
  try {
    const sheet = getSheet_();
    return json_({
      ok: true,
      message: "SSREC Pitch Perfect '26 Dynamic API is running successfully!",
      sheetName: sheet.getName(),
      sheetGid: sheet.getSheetId(),
      totalRegistrations: Math.max(0, sheet.getLastRow() - 1)
    });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

/**
 * POST request — Smart Registration Append
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

    // ── Prepare Key-Value Data Dictionary ───────────────────────
    const leaderName = trim_(data.leaderName || data.leader || data.fullName);
    const leaderEmail = trim_(data.leaderEmail || data.email);
    const leaderPhone = trim_(data.leaderPhone || data.leaderMobile || data.phone);
    const leaderDept = trim_(data.leaderDepartment || data.department);
    const leaderYear = trim_(data.leaderYear || data.year || "3rd Year");
    const college = trim_(data.college || data.collegeName || "SSREC");

    const dict = {
      registrationId: registrationId,
      timestamp: timestamp,
      teamName: trim_(data.teamName) || `${leaderName}'s Team`,
      category: trim_(data.participationCategory || data.category || "IDEA PITCH"),
      projectTitle: trim_(data.projectTitle || data.ideaTitle),
      domain: trim_(data.domain || "Innovation & Technology"),
      description: trim_(data.description || data.projectDescription),
      college: college,

      leaderName: leaderName,
      leaderEmail: leaderEmail,
      leaderPhone: leaderPhone,
      leaderDept: leaderDept,
      leaderYear: leaderYear,

      m1Name: trim_(data.member1Name),
      m1Email: trim_(data.member1Email),
      m1Phone: trim_(data.member1Phone || data.member1Mobile),
      m1Dept: trim_(data.member1Department),
      m1Year: trim_(data.member1Year),

      m2Name: trim_(data.member2Name),
      m2Email: trim_(data.member2Email),
      m2Phone: trim_(data.member2Phone || data.member2Mobile),
      m2Dept: trim_(data.member2Department),
      m2Year: trim_(data.member2Year),

      m3Name: trim_(data.member3Name),
      m3Email: trim_(data.member3Email),
      m3Phone: trim_(data.member3Phone || data.member3Mobile),
      m3Dept: trim_(data.member3Department),
      m3Year: trim_(data.member3Year),

      transactionId: trim_(data.transactionId) || "PAY-AT-VENUE",
      paymentUrl: paymentUrl,
      regFee: REGISTRATION_FEE,
      status: "Submitted"
    };

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
      } else if (/college/i.test(h)) {
        newRow[colIdx] = dict.college;
      } else if (/team\s*name|^name$/i.test(h) && !/leader|member/i.test(h)) {
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
      // Transaction / Screenshot / Fee / Status
      else if (/transaction|upi/i.test(h)) {
        newRow[colIdx] = dict.transactionId;
      } else if (/screenshot|payment.*(proof|link|url)/i.test(h)) {
        newRow[colIdx] = dict.paymentUrl;
      } else if (/fee|amount/i.test(h)) {
        newRow[colIdx] = dict.regFee;
      } else if (/status/i.test(h)) {
        newRow[colIdx] = dict.status;
      }
    }

    // Append the row to sheet
    sheet.appendRow(newRow);

    return json_({
      ok: true,
      registrationId: registrationId,
      paymentScreenshot: paymentUrl,
      message: "Pitch Perfect registration successfully recorded!",
      timestamp: timestamp
    });

  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

/**
 * ─────────────────────────────────────────────────────────────
 * addCollegeColumn — Run this ONCE to automatically insert
 * "College Name" column safely without disturbing existing data!
 * ─────────────────────────────────────────────────────────────
 */
function addCollegeColumn() {
  const sheet = getSheet_();
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  // Check if College Name already exists
  for (let i = 0; i < headers.length; i++) {
    if (/college/i.test(String(headers[i]))) {
      Logger.log("ℹ️ 'College Name' column already exists at Column " + (i + 1) + " (" + headers[i] + "). No changes needed!");
      return;
    }
  }

  // Find position: insert after Column L (Team Leader - Year) or after Column C (Team Name)
  let insertAfterCol = 3; // default after Column C
  for (let i = 0; i < headers.length; i++) {
    if (/leader.*year/i.test(String(headers[i]))) {
      insertAfterCol = i + 1; // insert right after Leader Year!
      break;
    }
  }

  sheet.insertColumnAfter(insertAfterCol);
  const collegeColIdx = insertAfterCol + 1;
  const headerCell = sheet.getRange(1, collegeColIdx);
  headerCell.setValue("College Name");
  headerCell.setFontWeight("bold");
  headerCell.setBackground("#1a2234");
  headerCell.setFontColor("#00e5ff");
  sheet.autoResizeColumns(collegeColIdx, 1);

  Logger.log("✅ 'College Name' column successfully inserted at Column " + collegeColIdx + " without touching existing rows!");
}

/**
 * ─────────────────────────────────────────────────────────────
 * getSheet_ — finds target sheet tab by GID or Name
 * ─────────────────────────────────────────────────────────────
 */
function getSheet_() {
  let ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}

  if (!ss) {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      throw new Error("Could not open spreadsheet by ID: " + SPREADSHEET_ID);
    }
  }

  const sheets = ss.getSheets();

  // 1. Try matching GID 1604668848
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === TARGET_GID) {
      return sheets[i];
    }
  }

  // 2. Try matching Sheet Name "Registrations"
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) return sheet;

  // 3. Fallback
  return sheets[0];
}

/**
 * ─────────────────────────────────────────────────────────────
 * getFolder_ — Google Drive folder for payment screenshots
 * ─────────────────────────────────────────────────────────────
 */
function getFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  const folder = DriveApp.createFolder(FOLDER_NAME);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return folder;
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
