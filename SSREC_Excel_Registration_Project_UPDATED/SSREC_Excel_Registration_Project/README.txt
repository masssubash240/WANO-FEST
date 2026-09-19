# SSREC College Event Registration — Excel Storage

This version saves every submitted registration into `registrations.xlsx`.
Payment screenshots are saved in `uploads/`.

## 1. Install Node.js
Install the current Node.js LTS release.

## 2. Open this project folder in VS Code

Open a terminal inside this folder and run:

```bash
npm install
npm start
```

Then open:

http://localhost:3000

## 3. What gets saved

Each successful submission creates one row in:

`registrations.xlsx`

It stores:
- Registration ID and submission time
- Team name
- Event type and event
- College and department
- Team leader details
- All 4 member details
- Project / idea title and description
- UPI transaction/reference ID
- Payment screenshot filename
- Registration fee (₹200)
- Confirmation status

The actual payment image is stored under:

`uploads/`

## Important
The Excel file is stored on the computer/server running Node.js. If the website is deployed to a hosting service, do not assume its local filesystem is permanent. For a college event, keep a backup of `registrations.xlsx` and `uploads/`.
