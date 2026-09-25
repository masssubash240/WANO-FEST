// ==============================================================================
// SSREC PITCH PERFECT '26 - GOOGLE APPS SCRIPT WEB APP
// Connects Pitch Perfect registrations directly to your Google Sheet:
// https://docs.google.com/spreadsheets/d/1WgYRWudN8zeOnf1JW0yWRssfGbexGwn3JwCEny7sNf0/edit?pli=1&gid=1604668848#gid=1604668848
// ==============================================================================

const SPREADSHEET_ID = "1WgYRWudN8zeOnf1JW0yWRssfGbexGwn3JwCEny7sNf0";
const TARGET_GID = 1604668848;
const SHEET_NAME = "Pitch Registrations";
const FOLDER_NAME = "SSREC Pitch Payment Screenshots";
const REGISTRATION_FEE = "₹200";

/**
 * Health check & setup test (GET request)
 */
function doGet() {
  try {
    const sheet = getSheet_();
    const folder = getFolder_();
    return json_({
      ok: true,
      message: "SSREC Pitch Perfect '26 Registration API is running successfully!",
      sheetName: sheet.getName(),
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
 * Handle incoming Pitch Perfect registration submission (POST request)
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No pitch registration data received.");
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    const folder = getFolder_();

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const registrationId = data.registrationId || ("SSREC-PITCH-2026-" + String(Date.now()).slice(-7));

    // Upload payment screenshot to Google Drive if provided
    let paymentUrl = "No screenshot provided";
    if (data.paymentScreenshot && data.paymentScreenshot.base64) {
      try {
        const shot = data.paymentScreenshot;
        const bytes = Utilities.base64Decode(shot.base64);
        const mimeType = shot.mimeType || "image/jpeg";
        const fileName = `${registrationId}_${shot.name || "pitch_payment.jpg"}`;
        const blob = Utilities.newBlob(bytes, mimeType, fileName);

        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        paymentUrl = file.getUrl();
      } catch (uploadErr) {
        paymentUrl = "Upload error: " + (uploadErr.message || String(uploadErr));
      }
    }

    // Leader info
    const leaderName = data.leaderName || data.leader || data.fullName || "";
    const leaderEmail = data.leaderEmail || data.email || "";
    const leaderPhone = data.leaderPhone || data.phone || "";
    const leaderDept = data.leaderDepartment || data.department || "";
    const leaderYear = data.leaderYear || data.year || "3rd Year";
    const college = data.college || data.collegeName || "SSREC";

    // Pitch project details
    const participationCategory = data.participationCategory || data.category || "IDEA PITCH";
    const projectTitle = data.projectTitle || data.ideaTitle || "Pitch Entry";
    const domain = data.domain || "Technology & Innovation";
    const description = data.description || data.projectDescription || "";
    const teamName = data.teamName || `${leaderName}'s Pitch Team`;
    const eventName = data.eventName || `Pitch Perfect '26 - ${participationCategory}`;
    const transactionId = data.transactionId || "PAY-AT-VENUE";

    // Members 1 to 4
    const m1Name = data.member1Name || "";
    const m1Email = data.member1Email || "";
    const m1Phone = data.member1Phone || "";
    const m1Dept = data.member1Department || "";
    const m1Year = data.member1Year || "";

    const m2Name = data.member2Name || "";
    const m2Email = data.member2Email || "";
    const m2Phone = data.member2Phone || "";
    const m2Dept = data.member2Department || "";
    const m2Year = data.member2Year || "";

    const m3Name = data.member3Name || "";
    const m3Email = data.member3Email || "";
    const m3Phone = data.member3Phone || "";
    const m3Dept = data.member3Department || "";
    const m3Year = data.member3Year || "";

    const m4Name = data.member4Name || "";
    const m4Email = data.member4Email || "";
    const m4Phone = data.member4Phone || "";
    const m4Dept = data.member4Department || "";
    const m4Year = data.member4Year || "";

    const row = [
      registrationId,
      timestamp,
      eventName,
      participationCategory,
      projectTitle,
      domain,
      description,
      teamName,
      college,
      leaderDept,

      // Leader
      leaderName,
      leaderEmail,
      leaderPhone,
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

      // Payment & Verification
      transactionId,
      paymentUrl,
      REGISTRATION_FEE,
      "Submitted"
    ];

    sheet.appendRow(row);

    return json_({
      ok: true,
      registrationId: registrationId,
      paymentScreenshot: paymentUrl,
      message: "Pitch Perfect registration successfully recorded in Google Sheets!",
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
 * Locate target spreadsheet and sheet tab (matching GID 1604668848 or sheet name)
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
      throw new Error("Could not open spreadsheet by ID: " + SPREADSHEET_ID);
    }
  }

  let sheet = null;
  const sheets = ss.getSheets();

  // 1. Try matching target GID: 1604668848
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === TARGET_GID) {
      sheet = sheets[i];
      break;
    }
  }

  // 2. Try matching sheet name
  if (!sheet) {
    sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheetByName("Registrations");
  }

  // 3. Fallback to active/first sheet
  if (!sheet) {
    sheet = sheets[0] || ss.insertSheet(SHEET_NAME);
  }

  // Define headers if empty
  const headers = [
    "Registration ID",
    "Submitted At (IST)",
    "Event Name",
    "Pitch Category",
    "Project / Idea Title",
    "Technology Domain",
    "Pitch Description",
    "Team Name",
    "College Name",
    "Department",

    // Leader
    "Leader Name",
    "Leader Email",
    "Leader Mobile",
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

    // Payment & Verification
    "UPI Transaction ID",
    "Payment Screenshot Link",
    "Registration Fee",
    "Status"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.getRange(1, 1, 1, headers.length).setBackground("#0b1329");
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
 * Return JSON response with CORS headers
 */
function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Manual test function: Click "Run" on this function in Apps Script to verify connection!
 */
function testPitchSetup() {
  const sheet = getSheet_();
  const folder = getFolder_();
  Logger.log("Successfully connected to Pitch Sheet!");
  Logger.log("Sheet Name: " + sheet.getName());
  Logger.log("Sheet GID: " + sheet.getSheetId());
  Logger.log("Folder Name: " + folder.getName());
  Logger.log("Total rows: " + sheet.getLastRow());
}
