// =====================================================
// SSREC PITCH REGISTRATION 2026
// Google Apps Script Web App
// Bound to the "SSREC Pitch Registration 2026" sheet.
// =====================================================

const SHEET_NAME = "Registrations";
const FOLDER_NAME = "SSREC Pitch Payment Screenshots";
const REGISTRATION_FEE = "₹200";

function doGet() {
  // Also creates the sheet if it does not exist.
  getSheet_();
  getFolder_();

  return json_({
    ok: true,
    message: "SSREC Pitch Registration 2026 API is working"
  });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No registration data received.");
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    const folder = getFolder_();

    const registrationId =
      "SSREC-2026-" + String(Date.now()).slice(-8);

    let paymentUrl = "";

    if (data.paymentScreenshot && data.paymentScreenshot.base64) {
      const shot = data.paymentScreenshot;
      const bytes = Utilities.base64Decode(shot.base64);
      const blob = Utilities.newBlob(
        bytes,
        shot.mimeType || "image/jpeg",
        shot.name || "payment.jpg"
      );

      const file = folder.createFile(blob);
      file.setName(registrationId + "_" + (shot.name || "payment.jpg"));
      paymentUrl = file.getUrl();
    }

    const row = [
      registrationId,
      new Date(),
      data.teamName || "",
      data.eventType || "Pitch Registration",
      data.eventName || "SSREC Pitch Registration 2026",
      data.participationCategory || "",
      data.projectTitle || "",
      data.domain || "",
      data.description || "",

      // Team leader
      data.leaderName || "",
      data.leaderEmail || "",
      data.leaderPhone || "",
      data.leaderDepartment || "",
      data.leaderYear || "",

      // Member 1
      data.member1Name || "",
      data.member1Email || "",
      data.member1Phone || "",
      data.member1Department || "",
      data.member1Year || "",

      // Member 2
      data.member2Name || "",
      data.member2Email || "",
      data.member2Phone || "",
      data.member2Department || "",
      data.member2Year || "",

      // Member 3
      data.member3Name || "",
      data.member3Email || "",
      data.member3Phone || "",
      data.member3Department || "",
      data.member3Year || "",

      // Payment
      data.transactionId || "",
      paymentUrl,
      REGISTRATION_FEE,
      "Submitted"
    ];

    sheet.appendRow(row);

    return json_({
      ok: true,
      registrationId: registrationId,
      message: "Registration submitted successfully."
    });
  } catch (error) {
    return json_({
      ok: false,
      message: error && error.message ? error.message : String(error)
    });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      "This Apps Script must be opened from the SSREC Pitch Registration 2026 Google Sheet using Extensions > Apps Script."
    );
  }

  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = [
    "Registration ID",
    "Submitted At",
    "Team Name",
    "Event Type",
    "Event Name",
    "Participation Category",
    "Project Title",
    "Domain",
    "Project Description",

    "Leader Name",
    "Leader Email",
    "Leader Mobile",
    "Leader Department",
    "Leader Year",

    "Member 1 Name",
    "Member 1 Email",
    "Member 1 Mobile",
    "Member 1 Department",
    "Member 1 Year",

    "Member 2 Name",
    "Member 2 Email",
    "Member 2 Mobile",
    "Member 2 Department",
    "Member 2 Year",

    "Member 3 Name",
    "Member 3 Email",
    "Member 3 Mobile",
    "Member 3 Department",
    "Member 3 Year",

    "Transaction ID",
    "Payment Screenshot",
    "Registration Fee",
    "Status"
  ];

  // If the sheet is empty, create headers automatically.
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }

  return sheet;
}

function getFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  return folders.hasNext()
    ? folders.next()
    : DriveApp.createFolder(FOLDER_NAME);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this ONCE manually after pasting the code.
function setupSheet() {
  const sheet = getSheet_();
  const folder = getFolder_();

  return json_({
    ok: true,
    message: "Setup completed successfully",
    sheet: sheet.getName(),
    folder: folder.getName()
  });
}
