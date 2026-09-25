// ==============================================================================
// SSREC WANO FEST 2026 — Google Apps Script Web App
// Target Spreadsheet : https://docs.google.com/spreadsheets/d/1bStbDykU_Fjsi-26X4FGVaWubUGzw_M_McOgfY7uxEQ/edit?gid=387111073#gid=387111073
// Spreadsheet ID     : 1bStbDykU_Fjsi-26X4FGVaWubUGzw_M_McOgfY7uxEQ
// Sheet GID          : 387111073
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
    return json_({
      ok: true,
      message: "SSREC Wano Fest 2026 Registration API is running successfully!",
      sheetName: sheet.getName(),
      sheetGid: sheet.getSheetId(),
      spreadsheetId: SPREADSHEET_ID,
      folderName: folder.getName(),
      totalRegistrations: Math.max(0, sheet.getLastRow() - 1)
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

    // Normalized member fields
    const m1Name  = data.member1Name || data.m1Name || "";
    const m1Email = data.member1Email || data.m1Email || "";
    const m1Phone = data.member1Phone || data.m1Phone || "";
    const m1Dept  = data.member1Department || data.m1Department || "";
    const m1Year  = data.member1Year || data.m1Year || "";

    const m2Name  = data.member2Name || data.m2Name || "";
    const m2Email = data.member2Email || data.m2Email || "";
    const m2Phone = data.member2Phone || data.m2Phone || "";
    const m2Dept  = data.member2Department || data.m2Department || "";
    const m2Year  = data.member2Year || data.m2Year || "";

    const m3Name  = data.member3Name || data.m3Name || "";
    const m3Email = data.member3Email || data.m3Email || "";
    const m3Phone = data.member3Phone || data.m3Phone || "";
    const m3Dept  = data.member3Department || data.m3Department || "";
    const m3Year  = data.member3Year || data.m3Year || "";

    const m4Name  = data.member4Name || data.m4Name || "";
    const m4Email = data.member4Email || data.m4Email || "";
    const m4Phone = data.member4Phone || data.m4Phone || "";
    const m4Dept  = data.member4Department || data.m4Department || "";
    const m4Year  = data.member4Year || data.m4Year || "";

    const leaderName  = data.leader || data.leaderName || data.fullName || "";
    const leaderEmail = data.leaderEmail || data.email || "";
    const leaderPhone = data.leaderPhone || data.phone || "";
    const leaderDept  = data.leaderDepartment || data.department || "";
    const leaderYear  = data.leaderYear || data.year || "3rd Year";

    const eventName     = data.eventName || "SSREC Event";
    const eventType     = data.eventType || "Technical";
    const teamName      = data.teamName || `${leaderName}'s Team`;
    const college       = data.college || data.collegeName || "SSREC";
    const department    = data.department || leaderDept || "Not Specified";
    const projectTitle  = data.projectTitle || data.ideaTitle || "General Entry";
    const description   = data.description || data.projectDescription || "No description provided.";
    const transactionId = data.transactionId || "PAY-AT-VENUE";
    const regFee        = data.registrationFee || DEFAULT_FEE;

    const row = [
      registrationId,
      timestamp,
      eventName,
      eventType,
      teamName,
      college,
      department,

      // Leader
      leaderName,
      leaderEmail,
      leaderPhone,
      leaderDept,
      leaderYear,

      // Member 1
      m1Name,
      m1Email,
      m1Phone,
      m1Dept,
      m1Year,

      // Member 2
      m2Name,
      m2Email,
      m2Phone,
      m2Dept,
      m2Year,

      // Member 3
      m3Name,
      m3Email,
      m3Phone,
      m3Dept,
      m3Year,

      // Member 4
      m4Name,
      m4Email,
      m4Phone,
      m4Dept,
      m4Year,

      // Project & Payment
      projectTitle,
      description,
      transactionId,
      paymentUrl,
      regFee,
      "Submitted"
    ];

    sheet.appendRow(row);

    return json_({
      ok: true,
      registrationId: registrationId,
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
    sheet.autoResizeColumns(1, headers.length);
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
  Logger.log("✅ Successfully connected to Wano Fest Sheet!");
  Logger.log("Sheet Name : " + sheet.getName());
  Logger.log("Sheet GID  : " + sheet.getSheetId());
  Logger.log("Drive Folder: " + folder.getName());
  Logger.log("Total Rows : " + sheet.getLastRow());
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
  sheet.autoResizeColumns(1, headers.length);
  Logger.log("✅ Wano Fest headers fixed! " + headers.length + " columns formatted on Row 1.");
}
