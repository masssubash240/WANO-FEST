// =====================================================
// SSREC COLLEGE EVENT REGISTRATION
// Google Sheets + Google Drive
// =====================================================


// =====================================================
// GOOGLE APPS SCRIPT URL
// =====================================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzyC_jUvtA94ZzpvOhk3HIFNHZ1-RZDBS8FYXwHyGtFzEFcrXPJbrOcM-1B2qiDOyXV/exec";


// =====================================================
// ELEMENTS
// =====================================================

const form =
  document.getElementById("registrationForm");

const eventType =
  document.getElementById("eventType");

const eventName =
  document.getElementById("eventName");

const eventInfo =
  document.getElementById("eventInfo");

const membersContainer =
  document.getElementById("membersContainer");

const nextBtn =
  document.getElementById("nextMember");

const memberCount =
  document.getElementById("memberCount");

const success =
  document.getElementById("successMessage");

const paymentScreenshot =
  document.getElementById("paymentScreenshot");


// =====================================================
// EVENTS
// =====================================================

const events = {

  technical: [

    ["Capture the Flag", "Capture the Flag"],

    ["Coding Challenge", "Coding Challenge"],

    ["AI Prompt", "AI Prompt"],

    ["UI/UX Challenge", "UI/UX Challenge"]

  ],


  "non-technical": [

    ["Quiz", "Will of D"],

    ["Treasure Hunt", "Red Line Rush"],

    ["Dance", "Nika's Dance Arena"],

    ["Singing", "Bink's Rhythm"],

    ["Photography", "Private Portraits"],

    ["Videography", "Grand Line Visuals"],

    ["Short Film", "Straw Hat Studio"],

    ["E-Sports", "E-Sports"]

  ]

};


// =====================================================
// EVENT TYPE CHANGE
// =====================================================

if (eventType) {

  eventType.addEventListener("change", () => {

    const type = eventType.value;

    eventName.innerHTML = "";


    if (!type) {

      eventName.disabled = true;

      eventName.required = true;

      eventName.innerHTML =
        '<option value="">Select event type first</option>';

      eventInfo.hidden = true;

      return;
    }


    eventName.disabled = false;

    eventName.innerHTML =
      '<option value="">Select an event</option>';


    events[type].forEach(([value, label]) => {

      const option =
        document.createElement("option");

      option.value = value;

      option.textContent = label;

      eventName.appendChild(option);

    });


    eventInfo.hidden = true;

  });

}


// =====================================================
// EVENT NAME CHANGE
// =====================================================

if (eventName) {

  eventName.addEventListener("change", () => {

    if (!eventName.value) {

      eventInfo.hidden = true;

      return;
    }


    const type =
      eventType.value;


    const pair =
      events[type].find(
        item => item[0] === eventName.value
      );


    if (!pair) return;


    eventInfo.textContent =
      `Selected ${
        type === "technical"
          ? "Technical"
          : "Non-Technical"
      } Event: ${pair[1]}`;


    eventInfo.hidden = false;

  });

}


// =====================================================
// MEMBER CARD
// =====================================================

function memberCard(n) {

  const div =
    document.createElement("div");


  div.className =
    "member-card" +
    (n === 1 ? " active" : "");


  div.innerHTML = `

    <div class="member-head">

      <div>

        <span class="member-number">
          MEMBER ${String(n).padStart(2, "0")}
        </span>

        <h4>
          Team Member ${n}
        </h4>

      </div>

      <span class="required-badge">
        Required
      </span>

    </div>


    <div class="grid">


      <div class="field">

        <label>
          Name *
        </label>

        <input
          name="member${n}Name"
          required
          placeholder="Enter full name"
        >

      </div>


      <div class="field">

        <label>
          Email *
        </label>

        <input
          name="member${n}Email"
          type="email"
          required
          placeholder="name@example.com"
        >

      </div>


      <div class="field">

        <label>
          Mobile Number *
        </label>

        <input
          name="member${n}Phone"
          type="tel"
          pattern="[0-9]{10}"
          maxlength="10"
          required
          placeholder="10-digit number"
        >

      </div>


      <div class="field">

        <label>
          Department *
        </label>

        <input
          name="member${n}Department"
          required
          placeholder="Enter department"
        >

      </div>


      <div class="field">

        <label>
          Year of Study *
        </label>

        <select
          name="member${n}Year"
          required
        >

          <option value="">
            Select year
          </option>

          <option>
            1st Year
          </option>

          <option>
            2nd Year
          </option>

          <option>
            3rd Year
          </option>

          <option>
            4th Year
          </option>

        </select>

      </div>


    </div>

  `;


  return div;
}


// =====================================================
// CREATE 4 MEMBERS
// =====================================================

if (membersContainer) {

  for (let i = 1; i <= 4; i++) {

    membersContainer.appendChild(
      memberCard(i)
    );

  }

}


// =====================================================
// MEMBER NAVIGATION
// =====================================================

const cards =
  [...document.querySelectorAll(".member-card")];

let currentMember = 1;


function updateMember() {

  cards.forEach((card, index) => {

    card.classList.toggle(
      "active",
      index === currentMember - 1
    );

  });


  if (memberCount) {

    memberCount.textContent =
      `Member ${currentMember} of 4`;

  }


  if (nextBtn) {

    if (currentMember < 4) {

      nextBtn.textContent =
        "Next Member →";

      nextBtn.disabled = false;

    } else {

      nextBtn.textContent =
        "✓ 4 Members Completed";

      nextBtn.disabled = true;

    }

  }

}


updateMember();


// =====================================================
// NEXT MEMBER
// =====================================================

if (nextBtn) {

  nextBtn.addEventListener("click", () => {

    const card =
      cards[currentMember - 1];


    const inputs =
      [...card.querySelectorAll(
        "input, select"
      )];


    for (const input of inputs) {

      if (!input.checkValidity()) {

        input.reportValidity();

        return;

      }

    }


    if (currentMember < 4) {

      currentMember++;

      updateMember();


      cards[currentMember - 1]
        .scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

    }

  });

}


// =====================================================
// PAYMENT SCREENSHOT VALIDATION
// =====================================================

if (paymentScreenshot) {

  paymentScreenshot.addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];


      if (!file) return;


      const allowedTypes = [
        "image/jpeg",
        "image/png"
      ];


      const maxSize =
        5 * 1024 * 1024;


      if (
        file.size > maxSize ||
        !allowedTypes.includes(file.type)
      ) {

        alert(
          "Upload JPG/PNG image under 5 MB."
        );


        event.target.value = "";

      }

    }
  );

}


// =====================================================
// FILE → BASE64
// =====================================================

function fileToBase64(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();


      reader.onload = () => {

        const result =
          String(reader.result);


        const base64 =
          result.split(",")[1];


        resolve(base64);

      };


      reader.onerror =
        reject;


      reader.readAsDataURL(file);

    }
  );

}


// =====================================================
// FORM → OBJECT
// =====================================================

function getFormData() {

  const formData =
    new FormData(form);


  const data = {};


  for (
    const [key, value]
    of formData.entries()
  ) {

    if (key === "paymentScreenshot") {
      continue;
    }


    data[key] = value;

  }


  return data;

}


// =====================================================
// SUBMIT
// =====================================================

if (form) {

  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      // -----------------------------------------------
      // Check all 4 members
      // -----------------------------------------------

      if (currentMember !== 4) {

        alert(
          "Please complete all 4 members before submitting."
        );

        return;

      }


      // -----------------------------------------------
      // HTML validation
      // -----------------------------------------------

      if (!form.checkValidity()) {

        form.reportValidity();

        return;

      }


      // -----------------------------------------------
      // Get payment screenshot
      // -----------------------------------------------

      const file =
        paymentScreenshot
          ? paymentScreenshot.files[0]
          : null;


      if (!file) {

        alert(
          "Please upload the payment screenshot."
        );

        return;

      }


      // -----------------------------------------------
      // Disable submit button
      // -----------------------------------------------

      const submitButton =
        form.querySelector(
          'button[type="submit"], input[type="submit"]'
        );


      const oldButtonText =
        submitButton
          ? submitButton.textContent
          : "";


      if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
          "Submitting...";

      }


      try {

        // ---------------------------------------------
        // Collect form data
        // ---------------------------------------------

        const data =
          getFormData();


        // ---------------------------------------------
        // Convert screenshot to Base64
        // ---------------------------------------------

        const base64 =
          await fileToBase64(file);


        data.paymentScreenshot = {

          name: file.name,

          mimeType: file.type,

          base64: base64

        };


        // ---------------------------------------------
        // Send to Google Apps Script
        // ---------------------------------------------

        const response =
          await fetch(
            GOOGLE_SCRIPT_URL,
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "text/plain;charset=utf-8"
              },

              body:
                JSON.stringify(data)

            }
          );


        // ---------------------------------------------
        // Read response
        // ---------------------------------------------

        const result =
          await response.json();


        if (!result.ok) {

          throw new Error(
            result.message ||
            "Registration failed."
          );

        }


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        if (success) {

          success.hidden = false;

        }


        alert(
          "Registration submitted successfully!\n\n" +
          "Registration ID: " +
          result.registrationId
        );


        // ---------------------------------------------
        // Reset form
        // ---------------------------------------------

        form.reset();


        currentMember = 1;

        updateMember();


        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });


      } catch (error) {

        console.error(error);


        alert(
          "Registration failed.\n\n" +
          error.message
        );


      } finally {

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.textContent =
            oldButtonText ||
            "Submit Registration";

        }

      }

    }
  );

}