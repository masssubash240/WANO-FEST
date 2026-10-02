// ==============================================================================
// SSREC WANO FEST 2026 — Smart Dynamic Google Apps Script Web App
// Target Spreadsheet : https://docs.google.com/spreadsheets/d/1bStbDykU_Fjsi-26X4FGVaWubUGzw_M_McOgfY7uxEQ/edit?gid=387111073#gid=387111073
// Spreadsheet ID     : 1bStbDykU_Fjsi-26X4FGVaWubUGzw_M_McOgfY7uxEQ
// Sheet GID          : 387111073
//
// 🎯 SMART FEATURE: Dynamic Header Mapping & Auto College Detection
// - Automatically matches columns BY THEIR HEADER TEXT in Row 1.
// - Automatically detects if "College Name" column is missing and inserts it!
// - Works regardless of column order, preventing data misalignment!
// ==============================================================================

const SPREADSHEET_ID = "1bStbDykU_Fjsi-26X4FGVaWubUGzw_M_McOgfY7uxEQ";
const TARGET_GID     = 387111073;
const SHEET_NAME     = "Registrations";
const FOLDER_NAME    = "SSREC Wano Fest Payment Screenshots";
const DEFAULT_FEE    = "₹200 / head";

/**
 * Health check & setup test (GET request)
 */
function doGet() {
  try {
    const sheet  = getSheet_();
    const folder = getFolder_();
    const headers = getHeadersFromSheet_(sheet);
    const hasCollege = headers.some(function(h) { return /college|institution|university/i.test(h); });

    return json_({
      ok: true,
      message: "SSREC Wano Fest 2026 Dynamic API is running successfully!",
      sheetName: sheet.getName(),
      sheetGid: sheet.getSheetId(),
      spreadsheetId: SPREADSHEET_ID,
      folderName: folder.getName(),
      totalRegistrations: Math.max(0, sheet.getLastRow() - 1),
      hasCollegeColumn: hasCollege,
      headersCount: headers.length,
      columns: headers
    });
  } catch (err) {
    return json_({
      ok: false,
      error: err && err.message ? err.message : String(err)
    });
  }
}

/**
 * Handle incoming registration submission (POST request)
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No registration data received in request.");
    }

    const data = JSON.parse(e.postData.contents);
    const sheet  = getSheet_();
    const folder = getFolder_();

    const timestamp      = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const registrationId = data.registrationId || ("SSREC-2026-" + String(Date.now()).slice(-7));

    // Upload payment screenshot if provided
    let paymentUrl = "No screenshot provided";
    if (data.paymentScreenshot && data.paymentScreenshot.base64) {
      try {
        const shot     = data.paymentScreenshot;
        const bytes    = Utilities.base64Decode(shot.base64);
        const mimeType = shot.mimeType || "image/jpeg";
        const fileName = `${registrationId}_${shot.name || "screenshot.jpg"}`;
        const blob     = Utilities.newBlob(bytes, mimeType, fileName);

        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        paymentUrl = file.getUrl();
      } catch (uploadErr) {
        paymentUrl = "Upload error: " + (uploadErr.message || String(uploadErr));
      }
    }

    // ── Prepare Key-Value Data Dictionary ───────────────────────
    const leaderName  = trim_(data.leaderName || data.leader || data.fullName);
    const leaderEmail = trim_(data.leaderEmail || data.email);
    const leaderPhone = trim_(data.leaderPhone || data.phone || data.mobile);
    const leaderDept  = trim_(data.leaderDepartment || data.leaderDept || data.department);
    const leaderYear  = trim_(data.leaderYear || data.year || "3rd Year");

    // College Name: check all possible incoming keys with safe fallback
    const college = trim_(data.college || data.collegeName || data.college_name || data.institution || "SSREC");
    const department = trim_(data.department || data.collegeDepartment || data.college_department || leaderDept || "Not Specified");

    const dict = {
      registrationId: registrationId,
      timestamp: timestamp,
      eventName: trim_(data.eventName) || "SSREC Event",
      eventType: trim_(data.eventType) === "technical" ? "Technical Event" : (trim_(data.eventType) || "General"),
      teamName: trim_(data.teamName) || `${leaderName}'s Team`,
      college: college,
      department: department,

      // Leader
      leaderName: leaderName,
      leaderEmail: leaderEmail,
      leaderPhone: leaderPhone,
      leaderDept: leaderDept,
      leaderYear: leaderYear,

      // Member 1
      m1Name: trim_(data.member1Name || data.m1Name),
      m1Email: trim_(data.member1Email || data.m1Email),
      m1Phone: trim_(data.member1Phone || data.m1Phone),
      m1Dept: trim_(data.member1Department || data.m1Dept),
      m1Year: trim_(data.member1Year || data.m1Year),

      // Member 2
      m2Name: trim_(data.member2Name || data.m2Name),
      m2Email: trim_(data.member2Email || data.m2Email),
      m2Phone: trim_(data.member2Phone || data.m2Phone),
      m2Dept: trim_(data.member2Department || data.m2Dept),
      m2Year: trim_(data.member2Year || data.m2Year),

      // Member 3
      m3Name: trim_(data.member3Name || data.m3Name),
      m3Email: trim_(data.member3Email || data.m3Email),
      m3Phone: trim_(data.member3Phone || data.m3Phone),
      m3Dept: trim_(data.member3Department || data.m3Dept),
      m3Year: trim_(data.member3Year || data.m3Year),

      // Member 4
      m4Name: trim_(data.member4Name || data.m4Name),
      m4Email: trim_(data.member4Email || data.m4Email),
      m4Phone: trim_(data.member4Phone || data.m4Phone),
      m4Dept: trim_(data.member4Department || data.m4Dept),
      m4Year: trim_(data.member4Year || data.m4Year),

      // Project & Payment
      projectTitle: trim_(data.projectTitle || data.ideaTitle || "General Entry"),
      description: trim_(data.description || data.projectDescription || "No description provided."),
      transactionId: trim_(data.transactionId || "PAY-AT-VENUE"),
      paymentUrl: paymentUrl,
      regFee: trim_(data.registrationFee || DEFAULT_FEE),
      status: "Submitted"
    };

    // ── Auto-ensure "College Name" column exists in Sheet ───────
    ensureCollegeColumn_(sheet);

    // ── Read Row 1 Headers from Sheet ──────────────────────────
    const lastCol = Math.max(sheet.getLastColumn(), 1);
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // Build the row array dynamically based on existing headers in Row 1
    const newRow = new Array(headers.length).fill("");

    for (let colIdx = 0; colIdx < headers.length; colIdx++) {
      const h = String(headers[colIdx] || "").trim().toLowerCase();

      if (/registration\s*id/i.test(h)) {
        newRow[colIdx] = dict.registrationId;
      } else if (/submitted|timestamp|date/i.test(h)) {
        newRow[colIdx] = dict.timestamp;
      } else if (/college\s*(dept|department)/i.test(h)) {
        newRow[colIdx] = dict.department;
      } else if (/college|institution|university|campus/i.test(h)) {
        newRow[colIdx] = dict.college;
      } else if (/event\s*type|category/i.test(h)) {
        newRow[colIdx] = dict.eventType;
      } else if (/event\s*name|^event$/i.test(h)) {
        newRow[colIdx] = dict.eventName;
      } else if (/team\s*name|^team$/i.test(h) && !/leader|member/i.test(h)) {
        newRow[colIdx] = dict.teamName;
      } else if (/college\s*department|^department$/i.test(h) && !/leader|member/i.test(h)) {
        newRow[colIdx] = dict.department;
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
      // Project & Payment
      else if (/title|idea|project/i.test(h)) {
        newRow[colIdx] = dict.projectTitle;
      } else if (/description/i.test(h)) {
        newRow[colIdx] = dict.description;
      } else if (/transaction|upi|ref/i.test(h)) {
        newRow[colIdx] = dict.transactionId;
      } else if (/screenshot|payment.*(proof|link|url)/i.test(h)) {
        newRow[colIdx] = dict.paymentUrl;
      } else if (/fee|amount/i.test(h)) {
        newRow[colIdx] = dict.regFee;
      } else if (/status|confirm/i.test(h)) {
        newRow[colIdx] = dict.status;
      }
    }

    // Append dynamically matched row to the sheet
    sheet.appendRow(newRow);

    return json_({
      ok: true,
      registrationId: registrationId,
      college: college,
      message: "Registration successfully recorded in Google Sheets!",
      timestamp: timestamp
    });

  } catch (error) {
    return json_({
      ok: false,
      message: error && error.message ? error.message : String(error)
    });
  }
}

/**
 * Automatically ensures "College Name" column exists in the Sheet.
 * If missing, inserts it safely right after Team Name or Column 5.
 */
function ensureCollegeColumn_(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  for (let i = 0; i < headers.length; i++) {
    if (/college|institution|university|campus/i.test(String(headers[i] || ""))) {
      return; // Already exists!
    }
  }

  // Not found: find suitable position to insert (after Team Name or Event Name, or at col 5)
  let insertAfterCol = 5;
  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i] || "").toLowerCase();
    if (/team\s*name|event\s*name|event\s*type/i.test(h)) {
      insertAfterCol = i + 1;
    }
  }

  sheet.insertColumnAfter(insertAfterCol);
  const collegeColIdx = insertAfterCol + 1;
  const headerCell = sheet.getRange(1, collegeColIdx);
  headerCell.setValue("College Name");
  headerCell.setFontWeight("bold");
  headerCell.setBackground("#1a2234");
  headerCell.setFontColor("#00e5ff");

  try {
    sheet.autoResizeColumns(collegeColIdx, 1);
  } catch (e) {}

  Logger.log("✅ 'College Name' column auto-inserted at Column " + collegeColIdx);
}

/**
 * Standard Headers Definition for Wano Fest (33 columns)
 */
function getHeaders_() {
  return [
    "Registration ID",
    "Submitted At (IST)",
    "Event Name",
    "Event Type",
    "Team Name",
    "College Name",
    "College Department",

    // Leader
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

    // Project & Payment
    "Project / Idea Title",
    "Short Description",
    "UPI Transaction ID",
    "Payment Screenshot Link",
    "Registration Fee",
    "Status"
  ];
}

function getHeadersFromSheet_(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(c) {
    return String(c || "").trim();
  });
}

/**
 * Locate target spreadsheet and sheet tab (matches GID 387111073 or sheet name)
 */
function getSheet_() {
  let ss = null;

  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    // not running bound
  }

  if (!ss) {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      throw new Error("Could not open spreadsheet by ID: " + SPREADSHEET_ID + ". Make sure the script is bound to the sheet or ID is correct.");
    }
  }

  let sheet = null;
  const sheets = ss.getSheets();

  // 1. Try matching target GID: 387111073
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === TARGET_GID) {
      sheet = sheets[i];
      break;
    }
  }

  // 2. Try matching sheet name "Registrations"
  if (!sheet) {
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  // 3. Fallback to first sheet
  if (!sheet) {
    sheet = sheets[0] || ss.insertSheet(SHEET_NAME);
  }

  // Auto-initialize headers if empty
  const headers = getHeaders_();
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.getRange(1, 1, 1, headers.length).setBackground("#1a2234");
    sheet.getRange(1, 1, 1, headers.length).setFontColor("#00e5ff");
    try {
      sheet.autoResizeColumns(1, headers.length);
    } catch (e) {}
  }

  return sheet;
}

/**
 * Locate or create payment screenshots folder in Google Drive
 */
function getFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  const folder = DriveApp.createFolder(FOLDER_NAME);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return folder;
}

function trim_(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/**
 * Return JSON response
 */
function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Manual test function: Click "Run" on this function in Apps Script to verify connection!
 */
function testSetup() {
  const sheet  = getSheet_();
  const folder = getFolder_();
  ensureCollegeColumn_(sheet);
  Logger.log("✅ Successfully connected to Wano Fest Sheet!");
  Logger.log("Sheet Name : " + sheet.getName());
  Logger.log("Sheet GID  : " + sheet.getSheetId());
  Logger.log("Drive Folder: " + folder.getName());
  Logger.log("Total Rows : " + sheet.getLastRow());
  Logger.log("Columns    : " + JSON.stringify(getHeadersFromSheet_(sheet)));
}

/**
 * Fix headers function: Click "Run" on this function once to format Row 1 with all headers
 */
function fixHeaders() {
  const sheet   = getSheet_();
  const headers = getHeaders_();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.getRange(1, 1, 1, headers.length).setBackground("#1a2234");
  sheet.getRange(1, 1, 1, headers.length).setFontColor("#00e5ff");
  try {
    sheet.autoResizeColumns(1, headers.length);
  } catch (e) {}
  Logger.log("✅ Wano Fest headers fixed! " + headers.length + " columns formatted on Row 1.");
}
