# README – Feedback Utilities

## Pull Requests

Feel free to make pull requests. Pull requests should be related to a specific [issue](https://github.com/randomlogic78/FeedbackUtils/issues)

### Pull Request Process

1. Identify a current Issue (or create a new issue)
2. Create a new branch with a name that references the Issue
3. Write your patch
4. Test your patch (include testing environment in pull request)
5. Submit pull request

## Overview

This script should be attached to a Google Spreadsheet and triggered by the **onOpen** event (i.e., the `onOpen` function runs automatically whenever the spreadsheet is opened).

## Required Sheet Structure  

### 1. Roster Sheet  
- Must be named **`Roster`**.  
- Contains a single header row (at least one data rows are required).

### 2. Assessment Sheets  
- Each assessment resides on its own sheet.  
- Every assessment sheet must contain the following three columns **with exact headings**:

| Column Header      | Expected Content                                                                 |
|--------------------|-----------------------------------------------------------------------------------|
| **Question**       | The full text of each question.                                                   |
| **Rubric**         | How the question should be graded – either a detailed rubric or a brief answer. |
| **Points Possible**| A numeric value indicating the maximum points for the question.                  |

## What the Script Does  

- When you open the spreadsheet, a new menu is created called "Feedback Utils" 
- Select "New Feedback Form", and the script creates a **Google Form** in the root of your Drive.  
- The form’s title matches the name of the sheet that generated it.  
- You don’t need to publish the form. Simply copy the **response link**, open it, and start grading.

## After Grading  

- All scores and feedback are written back to a **new sheet** in the original spreadsheet (the one that created the form).  
- From there you can:  
  - Export the data as a CSV file,  
  - Import it into your LMS, or  
  - Use it for any other student‑feedback workflow you prefer.


