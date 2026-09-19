// ======================================================
// SSREC PITCH REGISTRATION 2026
// script.js
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  setupRegistrationForm();
  setupMemberValidation();
});


// ======================================================
// API
// ======================================================

const GOOGLE_SCRIPT_URL = "/api/register";


// ======================================================
// REGISTRATION FORM
// ======================================================

function setupRegistrationForm() {

  const form =
    document.querySelector(
      "#registrationForm"
    ) ||
    document.querySelector(
      "form"
    );

  if (!form) {
    console.error(
      "Registration form not found."
    );
    return;
  }


  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      try {

        // ==============================================
        // GET FORM VALUES
        // ==============================================

        const data = {

          // ----------------------------------------------
          // TEAM DETAILS
          // ----------------------------------------------

          teamName:
            getValue(
              form,
              [
                "teamName",
                "team-name"
              ]
            ),


          // ----------------------------------------------
          // PITCH PROPOSAL
          // ----------------------------------------------

          participationCategory:
            getValue(
              form,
              [
                "participationCategory",
                "participation-category"
              ]
            ),

          projectTitle:
            getValue(
              form,
              [
                "projectTitle",
                "titleOfIdeaProject",
                "title",
                "project-title"
              ]
            ),

          domain:
            getValue(
              form,
              [
                "domain"
              ]
            ),

          description:
            getValue(
              form,
              [
                "description",
                "briefDescription",
                "projectDescription",
                "project-description"
              ]
            ),


          // ----------------------------------------------
          // TEAM LEADER
          // ----------------------------------------------

          leader:
            getValue(
              form,
              [
                "leader",
                "leaderName",
                "teamLeader",
                "fullName"
              ]
            ),

          leaderEmail:
            getValue(
              form,
              [
                "leaderEmail",
                "email",
                "leader-email"
              ]
            ),

          leaderPhone:
            getValue(
              form,
              [
                "leaderPhone",
                "leaderMobile",
                "mobile",
                "mobileNumber",
                "leader-mobile"
              ]
            ),

          leaderDepartment:
            getValue(
              form,
              [
                "leaderDepartment",
                "department",
                "leader-department"
              ]
            ),

          leaderYear:
            getValue(
              form,
              [
                "leaderYear",
                "year",
                "yearOfStudy",
                "leader-year"
              ]
            ),


          // ----------------------------------------------
          // MEMBER 01
          // ----------------------------------------------

          member1Name:
            getValue(
              form,
              [
                "member1Name",
                "member01Name",
                "member-1-name",
                "member01-name"
              ]
            ),

          member1Email:
            getValue(
              form,
              [
                "member1Email",
                "member01Email",
                "member-1-email",
                "member01-email"
              ]
            ),

          member1Phone:
            getValue(
              form,
              [
                "member1Phone",
                "member1Mobile",
                "member01Phone",
                "member01Mobile",
                "member-1-phone",
                "member01-phone"
              ]
            ),

          member1Department:
            getValue(
              form,
              [
                "member1Department",
                "member01Department",
                "member-1-department",
                "member01-department"
              ]
            ),

          member1Year:
            getValue(
              form,
              [
                "member1Year",
                "member01Year",
                "member-1-year",
                "member01-year"
              ]
            ),


          // ----------------------------------------------
          // MEMBER 02
          // ----------------------------------------------

          member2Name:
            getValue(
              form,
              [
                "member2Name",
                "member02Name",
                "member-2-name",
                "member02-name"
              ]
            ),

          member2Email:
            getValue(
              form,
              [
                "member2Email",
                "member02Email",
                "member-2-email",
                "member02-email"
              ]
            ),

          member2Phone:
            getValue(
              form,
              [
                "member2Phone",
                "member2Mobile",
                "member02Phone",
                "member02Mobile",
                "member-2-phone",
                "member02-phone"
              ]
            ),

          member2Department:
            getValue(
              form,
              [
                "member2Department",
                "member02Department",
                "member-2-department",
                "member02-department"
              ]
            ),

          member2Year:
            getValue(
              form,
              [
                "member2Year",
                "member02Year",
                "member-2-year",
                "member02-year"
              ]
            ),


          // ----------------------------------------------
          // MEMBER 03
          // ----------------------------------------------

          member3Name:
            getValue(
              form,
              [
                "member3Name",
                "member03Name",
                "member-3-name",
                "member03-name"
              ]
            ),

          member3Email:
            getValue(
              form,
              [
                "member3Email",
                "member03Email",
                "member-3-email",
                "member03-email"
              ]
            ),

          member3Phone:
            getValue(
              form,
              [
                "member3Phone",
                "member3Mobile",
                "member03Phone",
                "member03Mobile",
                "member-3-phone",
                "member03-phone"
              ]
            ),

          member3Department:
            getValue(
              form,
              [
                "member3Department",
                "member03Department",
                "member-3-department",
                "member03-department"
              ]
            ),

          member3Year:
            getValue(
              form,
              [
                "member3Year",
                "member03Year",
                "member-3-year",
                "member03-year"
              ]
            ),


          // ----------------------------------------------
          // PAYMENT
          // ----------------------------------------------

          transactionId:
            getValue(
              form,
              [
                "transactionId",
                "transactionID",
                "transaction-id"
              ]
            )

        };


        // ==============================================
        // PAYMENT SCREENSHOT
        // ==============================================

        const paymentInput =
          findElement(
            form,
            [
              "paymentScreenshot",
              "payment-screenshot",
              "paymentImage"
            ]
          );


        if (
          !paymentInput ||
          !paymentInput.files ||
          !paymentInput.files.length
        ) {

          showError(
            "Payment screenshot is required."
          );

          return;
        }


        const paymentFile =
          paymentInput.files[0];


        // ==============================================
        // FILE SIZE
        // ==============================================

        const maxSize =
          10 * 1024 * 1024;


        if (
          paymentFile.size >
          maxSize
        ) {

          showError(
            "Payment screenshot must be less than 10 MB."
          );

          return;
        }


        // ==============================================
        // CONVERT IMAGE TO BASE64
        // ==============================================

        const base64 =
          await fileToBase64(
            paymentFile
          );


        data.paymentScreenshot = {

          name:
            paymentFile.name,

          mimeType:
            paymentFile.type ||
            "image/jpeg",

          base64:
            base64

        };


        // ==============================================
        // MEMBER COUNT
        // ==============================================

        let memberCount = 0;


        if (
          data.member1Name
        ) {
          memberCount++;
        }


        if (
          data.member2Name
        ) {
          memberCount++;
        }


        if (
          data.member3Name
        ) {
          memberCount++;
        }


        if (
          memberCount < 1
        ) {

          showError(
            "At least 1 team member is required."
          );

          return;
        }


        if (
          memberCount > 3
        ) {

          showError(
            "Maximum 3 team members are allowed."
          );

          return;
        }


        // ==============================================
        // SHOW LOADING
        // ==============================================

        setSubmitLoading(
          form,
          true
        );


        // ==============================================
        // SEND TO SERVER
        // ==============================================

        console.log(
          "Sending registration..."
        );

        console.log(
          "Team:",
          data.teamName
        );

        console.log(
          "Members:",
          memberCount
        );


        const response =
          await fetch(
            GOOGLE_SCRIPT_URL,
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "text/plain;charset=utf-8"

              },

              body:
                JSON.stringify(
                  data
                )

            }
          );


        // ==============================================
        // READ RESPONSE
        // ==============================================

        const responseText =
          await response.text();


        console.log(
          "Server response:",
          responseText
        );


        let result;


        try {

          result =
            JSON.parse(
              responseText
            );

        } catch (error) {

          throw new Error(
            "Server returned an invalid response."
          );

        }


        // ==============================================
        // FAILED
        // ==============================================

        if (
          !response.ok ||
          !result.success
        ) {

          throw new Error(
            result.message ||
            "Registration failed."
          );

        }


        // ==============================================
        // SUCCESS
        // ==============================================

        showSuccess(
          result.registrationId,
          result.memberCount ||
            memberCount
        );


        // ==============================================
        // RESET FORM
        // ==============================================

        form.reset();


      } catch (error) {

        console.error(
          "Registration error:",
          error
        );


        showError(
          error.message ||
          "Registration failed. Please try again."
        );


      } finally {

        setSubmitLoading(
          form,
          false
        );

      }

    }
  );

}


// ======================================================
// MEMBER VALIDATION
// ======================================================

function setupMemberValidation() {

  const form =
    document.querySelector(
      "#registrationForm"
    ) ||
    document.querySelector(
      "form"
    );


  if (!form) {
    return;
  }


  // ----------------------------------------------
  // MEMBER 02
  // ----------------------------------------------

  setupOptionalMember(
    form,
    2
  );


  // ----------------------------------------------
  // MEMBER 03
  // ----------------------------------------------

  setupOptionalMember(
    form,
    3
  );

}


// ======================================================
// OPTIONAL MEMBER
// ======================================================

function setupOptionalMember(
  form,
  number
) {

  const nameInput =
    findElement(
      form,
      [
        `member${number}Name`,
        `member0${number}Name`,
        `member-${number}-name`,
        `member0${number}-name`
      ]
    );


  if (!nameInput) {
    return;
  }


  nameInput.addEventListener(
    "input",
    () => {

      const hasName =
        nameInput.value.trim()
          .length > 0;


      const fields = [

        findElement(
          form,
          [
            `member${number}Email`,
            `member0${number}Email`,
            `member-${number}-email`,
            `member0${number}-email`
          ]
        ),

        findElement(
          form,
          [
            `member${number}Phone`,
            `member${number}Mobile`,
            `member0${number}Phone`,
            `member0${number}Mobile`
          ]
        ),

        findElement(
          form,
          [
            `member${number}Department`,
            `member0${number}Department`
          ]
        ),

        findElement(
          form,
          [
            `member${number}Year`,
            `member0${number}Year`
          ]
        )

      ];


      fields.forEach(
        (field) => {

          if (!field) {
            return;
          }


          if (hasName) {

            field.required = true;

          } else {

            field.required = false;

          }

        }
      );

    }
  );

}


// ======================================================
// FIND ELEMENT
// ======================================================

function findElement(
  form,
  names
) {

  for (
    const name of names
  ) {

    const element =
      form.querySelector(
        `[name="${name}"]`
      ) ||
      form.querySelector(
        `#${name}`
      );


    if (element) {
      return element;
    }

  }


  return null;

}


// ======================================================
// GET VALUE
// ======================================================

function getValue(
  form,
  names
) {

  const element =
    findElement(
      form,
      names
    );


  if (!element) {
    return "";
  }


  // SELECT
  if (
    element.tagName ===
    "SELECT"
  ) {

    return String(
      element.value || ""
    ).trim();

  }


  // RADIO
  if (
    element.type ===
    "radio"
  ) {

    const checked =
      form.querySelector(
        `input[name="${element.name}"]:checked`
      );


    return checked
      ? String(
          checked.value || ""
        ).trim()
      : "";

  }


  return String(
    element.value || ""
  ).trim();

}


// ======================================================
// FILE → BASE64
// ======================================================

function fileToBase64(
  file
) {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const reader =
        new FileReader();


      reader.onload =
        () => {

          const result =
            String(
              reader.result || ""
            );


          // Remove:
          // data:image/jpeg;base64,

          const commaIndex =
            result.indexOf(",");


          if (
            commaIndex === -1
          ) {

            reject(
              new Error(
                "Invalid payment screenshot."
              )
            );

            return;

          }


          resolve(
            result.substring(
              commaIndex + 1
            )
          );

        };


      reader.onerror =
        () => {

          reject(
            new Error(
              "Could not read payment screenshot."
            )
          );

        };


      reader.readAsDataURL(
        file
      );

    }
  );

}


// ======================================================
// SUBMIT LOADING
// ======================================================

function setSubmitLoading(
  form,
  loading
) {

  const button =
    form.querySelector(
      'button[type="submit"]'
    ) ||
    form.querySelector(
      'input[type="submit"]'
    );


  if (!button) {
    return;
  }


  if (loading) {

    button.disabled =
      true;

    button.dataset.originalText =
      button.textContent;


    if (
      button.tagName ===
      "BUTTON"
    ) {

      button.textContent =
        "Submitting...";

    }

  } else {

    button.disabled =
      false;


    if (
      button.dataset.originalText
    ) {

      button.textContent =
        button.dataset.originalText;

    }

  }

}


// ======================================================
// SUCCESS
// ======================================================

function showSuccess(
  registrationId,
  memberCount
) {

  console.log(
    "Registration successful:",
    registrationId
  );


  const modal =
    document.querySelector(
      "#successModal"
    );


  if (modal) {

    const idElement =
      modal.querySelector(
        "#registrationId"
      ) ||
      modal.querySelector(
        ".registration-id"
      );


    const memberElement =
      modal.querySelector(
        "#memberCount"
      ) ||
      modal.querySelector(
        ".member-count"
      );


    if (idElement) {

      idElement.textContent =
        registrationId || "";

    }


    if (memberElement) {

      memberElement.textContent =
        memberCount || 1;

    }


    modal.classList.add(
      "active"
    );


    modal.style.display =
      "flex";


    return;

  }


  // Fallback

  alert(
    "Registration submitted successfully!\n\n" +
    "Registration ID: " +
    registrationId +
    "\nMembers: " +
    memberCount
  );

}


// ======================================================
// ERROR
// ======================================================

function showError(
  message
) {

  console.error(
    message
  );


  const errorElement =
    document.querySelector(
      "#errorMessage"
    ) ||
    document.querySelector(
      ".error-message"
    );


  if (errorElement) {

    errorElement.textContent =
      message;

    errorElement.style.display =
      "block";


    setTimeout(
      () => {

        errorElement.style.display =
          "";

      },
      5000
    );


    return;

  }


  alert(
    message
  );

}


// ======================================================
// CLOSE SUCCESS MODAL
// ======================================================

document.addEventListener(
  "click",
  (event) => {

    if (
      event.target.matches(
        "#closeModal"
      )
    ) {

      const modal =
        document.querySelector(
          "#successModal"
        );


      if (modal) {

        modal.classList.remove(
          "active"
        );

        modal.style.display =
          "none";

      }

    }

  }
);