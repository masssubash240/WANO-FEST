const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTANT:
// இங்கே உங்கள் NEW Google Apps Script /exec URL-ஐ போடுங்கள்.
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxdGPR5FNlI38fNZo3Q6KjmGHoVdI_f2yZ_b8feevHnJNlXVE8SU1sU28mcII4x9EcW/exec";


// ======================================================
// STATIC FILES
// ======================================================

app.use(express.static(__dirname));


// ======================================================
// BODY PARSER
// ======================================================

app.use(
  express.text({
    type: ["text/plain", "application/json"],
    limit: "15mb",
  })
);


// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "index.html")
  );
});


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SSREC server is running",
  });
});


// ======================================================
// REGISTRATION
// ======================================================

app.post("/api/register", async (req, res) => {

  try {

    let data;

    // --------------------------------------------------
    // Parse request body
    // --------------------------------------------------

    try {

      data =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body;

    } catch (_error) {

      return res.status(400).json({
        success: false,
        message: "Invalid registration data",
      });

    }


    if (
      !data ||
      typeof data !== "object"
    ) {

      return res.status(400).json({
        success: false,
        message: "Registration data is missing",
      });

    }


    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (
      !String(
        data.teamName || ""
      ).trim()
    ) {

      return res.status(400).json({
        success: false,
        message: "Team Name is required",
      });

    }


    if (
      !String(
        data.participationCategory || ""
      ).trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Participation Category is required",
      });

    }


    if (
      !String(
        data.projectTitle || ""
      ).trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Title of Idea / Project is required",
      });

    }


    if (
      !String(
        data.domain || ""
      ).trim()
    ) {

      return res.status(400).json({
        success: false,
        message: "Domain is required",
      });

    }


    if (
      !String(
        data.description || ""
      ).trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Brief Description is required",
      });

    }


    // ==================================================
    // LEADER
    // ==================================================

    if (
      !String(
        data.leader || ""
      ).trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Team Leader Full Name is required",
      });

    }


    if (
      !String(
        data.leaderEmail || ""
      ).trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Team Leader Email is required",
      });

    }


    if (
      !String(
        data.leaderPhone ||
        data.leaderMobile ||
        ""
      ).trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Team Leader Mobile Number is required",
      });

    }


    // ==================================================
    // MEMBER COUNT
    // ==================================================

    const memberNames = [

      data.member1Name,
      data.member2Name,
      data.member3Name,

    ]
      .map((value) =>
        String(value || "").trim()
      )
      .filter(Boolean);


    const memberCount =
      memberNames.length;


    if (memberCount < 1) {

      return res.status(400).json({
        success: false,
        message:
          "At least 1 team member is required",
      });

    }


    if (memberCount > 3) {

      return res.status(400).json({
        success: false,
        message:
          "Maximum 3 team members are allowed",
      });

    }


    // ==================================================
    // PAYMENT
    // ==================================================

    if (
      !data.paymentScreenshot ||
      !data.paymentScreenshot.base64
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Payment Screenshot is required",
      });

    }


    if (
      !String(
        data.transactionId || ""
      ).trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Transaction ID is required",
      });

    }


    // ==================================================
    // SEND TO GOOGLE APPS SCRIPT
    // ==================================================

    console.log(
      "======================================"
    );

    console.log(
      "Registration request received"
    );

    console.log(
      "Team:",
      data.teamName
    );

    console.log(
      "Member Count:",
      memberCount
    );

    console.log(
      "Sending registration to Google Apps Script..."
    );


    const response =
      await fetch(
        GOOGLE_SCRIPT_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8",
          },

          body:
            JSON.stringify(data),

          redirect: "follow",
        }
      );


    const responseText =
      await response.text();


    console.log(
      "Google Apps Script Status:",
      response.status
    );

    console.log(
      "Google Response:",
      responseText
    );


    // ==================================================
    // PARSE GOOGLE RESPONSE
    // ==================================================

    let result;


    try {

      result =
        JSON.parse(responseText);

    } catch (_error) {

      return res.status(502).json({

        success: false,

        message:
          "Google Apps Script returned an invalid response.",

        raw:
          responseText.substring(
            0,
            500
          ),

      });

    }


    // ==================================================
    // GOOGLE FAILED
    // ==================================================

    if (
      !result.success
    ) {

      return res.status(400).json({

        success: false,

        message:
          result.message ||
          "Registration failed",

      });

    }


    // ==================================================
    // SUCCESS
    // ==================================================

    console.log(
      "Registration successful"
    );

    console.log(
      "Registration ID:",
      result.registrationId
    );

    console.log(
      "======================================"
    );


    return res.json({

      success: true,

      message:
        result.message ||
        "Registration submitted successfully",

      registrationId:
        result.registrationId ||
        "",

      memberCount:
        result.memberCount ||
        memberCount,

      paymentScreenshot:
        result.paymentScreenshot ||
        "",

    });


  } catch (error) {

    console.error(
      "Registration error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Server error while submitting registration",

    });

  }

});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
  (
    error,
    req,
    res,
    _next
  ) => {

    console.error(
      "Server error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Internal server error",

    });

  }
);


// ======================================================
// START SERVER
// ======================================================

app.listen(
  PORT,
  () => {

    console.log(
      "======================================"
    );

    console.log(
      "SSREC Pitch Registration 2026"
    );

    console.log(
      `Server running on: http://localhost:${PORT}`
    );

    console.log(
      "======================================"
    );

  }
);